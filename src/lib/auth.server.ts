// Server-only auth helpers. Never import from routes/components/*.functions.ts top-level.
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const BCRYPT_ROUNDS = 12;
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const VERIFICATION_TOKEN_TTL = "10m";
const SESSION_TOKEN_TTL = "7d";

function secret(name: string): Uint8Array {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return new TextEncoder().encode(v);
}

const JWT_SECRET = () => secret("AUTH_JWT_SECRET");

export function generateOtp(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (100000 + (buf[0] % 900000)).toString();
}

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, BCRYPT_ROUNDS);
}
export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}
export async function hashOtp(code: string): Promise<string> {
  return bcrypt.hash(code, 8); // low rounds — short-lived, high volume
}
export async function verifyOtpHash(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash);
}

export type VerificationClaims = {
  purpose: "register" | "forgot";
  identifier: string; // email (lower) or mobile
  fullName?: string;
  isEmail: boolean;
};

export async function signVerificationToken(claims: VerificationClaims): Promise<string> {
  return new SignJWT({ ...claims, typ: "otp-verified" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(VERIFICATION_TOKEN_TTL)
    .sign(JWT_SECRET());
}
export async function verifyVerificationToken(token: string): Promise<VerificationClaims> {
  const { payload } = await jwtVerify(token, JWT_SECRET());
  if (payload.typ !== "otp-verified") throw new Error("Invalid token type");
  return payload as unknown as VerificationClaims;
}

export type SessionClaims = { sub: string; email?: string; mobile?: string; name: string };

export async function signSessionToken(claims: SessionClaims): Promise<string> {
  return new SignJWT({ ...claims, typ: "session" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TOKEN_TTL)
    .sign(JWT_SECRET());
}
export async function verifySessionToken(token: string): Promise<SessionClaims> {
  const { payload } = await jwtVerify(token, JWT_SECRET());
  if (payload.typ !== "session") throw new Error("Invalid token type");
  return payload as unknown as SessionClaims;
}

export const AUTH_CONSTANTS = {
  OTP_TTL_MS,
  RESEND_COOLDOWN_MS,
};

/**
 * Sends an OTP by email. Currently a no-op fallback because no email sender
 * domain is configured. Once a domain is verified in Cloud → Emails, replace
 * the body with a call to the Lovable Emails queue (enqueue_email RPC).
 * Returns true if actually delivered, false if the caller should surface a devOtp.
 */
export async function deliverOtpEmail(_email: string, _code: string, _purpose: string): Promise<boolean> {
  // TODO(email): switch to real send once a sender domain is verified.
  return false;
}
