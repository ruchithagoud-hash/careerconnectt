import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRe = /^\d{10,15}$/;

const sendOtpSchema = z.object({
  purpose: z.enum(["register", "forgot"]),
  fullName: z.string().trim().min(2).max(80).optional(),
  identifier: z.string().trim().min(1).max(120),
});

const verifyOtpSchema = z.object({
  identifier: z.string().trim().min(1),
  purpose: z.enum(["register", "forgot"]),
  code: z.string().regex(/^\d{6}$/),
});

const registerSchema = z.object({
  verificationToken: z.string().min(10),
  password: z.string().min(8).max(200),
});

const loginSchema = z.object({
  identifier: z.string().trim().min(1),
  password: z.string().min(1),
});

const resetSchema = z.object({
  verificationToken: z.string().min(10),
  password: z.string().min(8).max(200),
});

const meSchema = z.object({ token: z.string().min(10) });

function classify(identifier: string): { isEmail: boolean; normalized: string } {
  const t = identifier.trim();
  if (emailRe.test(t)) return { isEmail: true, normalized: t.toLowerCase() };
  if (mobileRe.test(t.replace(/\D/g, ""))) return { isEmail: false, normalized: t.replace(/\D/g, "") };
  throw new Error("Enter a valid email address or mobile number.");
}

export const sendOtp = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => sendOtpSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const {
      generateOtp,
      hashOtp,
      deliverOtpEmail,
      AUTH_CONSTANTS,
    } = await import("./auth.server");

    const { isEmail, normalized } = classify(data.identifier);

    // Look up existing account.
    const { data: existing, error: lookupErr } = await supabaseAdmin
      .from("app_users")
      .select("id, email, mobile")
      .or(isEmail ? `email.eq.${normalized}` : `mobile.eq.${normalized}`)
      .maybeSingle();
    if (lookupErr) throw new Error("Lookup failed. Please try again.");

    if (data.purpose === "register" && existing) {
      throw new Error("An account with this email/mobile already exists.");
    }
    if (data.purpose === "forgot" && !existing) {
      throw new Error("No account found for this email/mobile.");
    }

    // Rate-limit resends: last OTP for this identifier+purpose must be older than cooldown.
    const { data: last } = await supabaseAdmin
      .from("otp_codes")
      .select("created_at")
      .eq("identifier", normalized)
      .eq("purpose", data.purpose)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (last) {
      const age = Date.now() - new Date(last.created_at).getTime();
      if (age < AUTH_CONSTANTS.RESEND_COOLDOWN_MS) {
        const wait = Math.ceil((AUTH_CONSTANTS.RESEND_COOLDOWN_MS - age) / 1000);
        throw new Error(`Please wait ${wait}s before requesting a new code.`);
      }
    }

    const code = generateOtp();
    const code_hash = await hashOtp(code);
    const expires_at = new Date(Date.now() + AUTH_CONSTANTS.OTP_TTL_MS).toISOString();

    const { error: insErr } = await supabaseAdmin
      .from("otp_codes")
      .insert({ identifier: normalized, purpose: data.purpose, code_hash, expires_at });
    if (insErr) throw new Error("Could not issue OTP. Please try again.");

    let delivered = false;
    if (isEmail) delivered = await deliverOtpEmail(normalized, code, data.purpose);
    // SMS not integrated yet — mobile OTPs fall back to devOtp until Twilio is connected.

    return {
      ok: true,
      identifier: normalized,
      isEmail,
      expiresAt: expires_at,
      // devOtp is included ONLY when we could not actually deliver, so the demo UI keeps working.
      devOtp: delivered ? undefined : code,
    };
  });

export const verifyOtp = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => verifyOtpSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { verifyOtpHash, signVerificationToken } = await import("./auth.server");

    const identifier = data.identifier.trim().toLowerCase();
    const isEmail = emailRe.test(identifier);

    const { data: row } = await supabaseAdmin
      .from("otp_codes")
      .select("id, code_hash, expires_at, used_at")
      .eq("identifier", identifier)
      .eq("purpose", data.purpose)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!row) throw new Error("No OTP found. Please request a new code.");
    if (row.used_at) throw new Error("This code has already been used.");
    if (new Date(row.expires_at).getTime() < Date.now())
      throw new Error("This code has expired. Please request a new one.");

    const ok = await verifyOtpHash(data.code, row.code_hash);
    if (!ok) throw new Error("Incorrect code. Please try again.");

    // Mark used AND clear any older unused OTPs for the same identifier+purpose (no reuse).
    await supabaseAdmin.from("otp_codes").update({ used_at: new Date().toISOString() }).eq("id", row.id);
    await supabaseAdmin
      .from("otp_codes")
      .delete()
      .eq("identifier", identifier)
      .eq("purpose", data.purpose)
      .is("used_at", null);

    const token = await signVerificationToken({
      purpose: data.purpose,
      identifier,
      isEmail,
    });
    return { ok: true, verificationToken: token };
  });

async function issueSessionForUser(userRow: {
  id: string;
  full_name: string;
  email: string | null;
  mobile: string | null;
}) {
  const { signSessionToken } = await import("./auth.server");
  const token = await signSessionToken({
    sub: userRow.id,
    email: userRow.email ?? undefined,
    mobile: userRow.mobile ?? undefined,
    name: userRow.full_name,
  });
  return {
    token,
    user: {
      id: userRow.id,
      fullName: userRow.full_name,
      email: userRow.email,
      mobile: userRow.mobile,
    },
  };
}

export const register = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    registerSchema
      .extend({ fullName: z.string().trim().min(2).max(80) })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { verifyVerificationToken, hashPassword } = await import("./auth.server");

    let claims;
    try {
      claims = await verifyVerificationToken(data.verificationToken);
    } catch {
      throw new Error("Verification expired. Please restart the sign-up.");
    }
    if (claims.purpose !== "register") throw new Error("Invalid verification token.");

    const password_hash = await hashPassword(data.password);
    const insertRow = {
      full_name: data.fullName,
      email: claims.isEmail ? claims.identifier : null,
      mobile: claims.isEmail ? null : claims.identifier,
      password_hash,
      verified: true,
    };

    const { data: created, error } = await supabaseAdmin
      .from("app_users")
      .insert(insertRow)
      .select("id, full_name, email, mobile")
      .single();
    if (error || !created) throw new Error("Could not create account. It may already exist.");

    return issueSessionForUser(created);
  });

export const login = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => loginSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { verifyPassword } = await import("./auth.server");

    const { isEmail, normalized } = classify(data.identifier);
    const { data: user } = await supabaseAdmin
      .from("app_users")
      .select("id, full_name, email, mobile, password_hash")
      .or(isEmail ? `email.eq.${normalized}` : `mobile.eq.${normalized}`)
      .maybeSingle();
    if (!user) throw new Error("No account found for this email/mobile.");

    const ok = await verifyPassword(data.password, user.password_hash);
    if (!ok) throw new Error("Incorrect password.");

    return issueSessionForUser(user);
  });

export const resetPassword = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => resetSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { verifyVerificationToken, hashPassword } = await import("./auth.server");

    let claims;
    try {
      claims = await verifyVerificationToken(data.verificationToken);
    } catch {
      throw new Error("Verification expired. Please restart the reset.");
    }
    if (claims.purpose !== "forgot") throw new Error("Invalid verification token.");

    const password_hash = await hashPassword(data.password);
    const filter = claims.isEmail
      ? { column: "email", value: claims.identifier }
      : { column: "mobile", value: claims.identifier };
    const { error } = await supabaseAdmin
      .from("app_users")
      .update({ password_hash })
      .eq(filter.column, filter.value);
    if (error) throw new Error("Could not reset password.");
    return { ok: true };
  });

export const me = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => meSchema.parse(d))
  .handler(async ({ data }) => {
    const { verifySessionToken } = await import("./auth.server");
    try {
      const claims = await verifySessionToken(data.token);
      return {
        ok: true as const,
        user: {
          id: claims.sub,
          fullName: claims.name,
          email: claims.email ?? null,
          mobile: claims.mobile ?? null,
        },
      };
    } catch {
      return { ok: false as const };
    }
  });
