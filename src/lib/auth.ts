// Thin client wrapper around the server auth API.
// Keeps the previous public surface where possible so UI routes don't need to change.
// - Accounts live in the database (server-side, service role only).
// - Passwords are bcrypt-hashed on the server (never touched here).
// - Session = JWT (HS256) stored in sessionStorage under cc.session.
// - Pending OTP flow state stays in sessionStorage (client-side transient only).

import * as api from "./auth-api.functions";

const SESSION_KEY = "cc.session";
const USER_KEY = "cc.user";
const PENDING_KEY = "cc.pending";

export type Account = {
  id: string;
  fullName: string;
  email?: string | null;
  mobile?: string | null;
};

export type PendingFlow = {
  kind: "register" | "forgot";
  fullName?: string;
  identifier: string; // normalized (lower email or digits mobile)
  isEmail: boolean;
  otpExpiresAt: number;
  otp?: string; // devOtp — only present when email delivery hasn't shipped yet
  verified?: boolean;
  verificationToken?: string; // returned by verifyOtp, consumed by register/resetPassword
};

const isBrowser = () => typeof window !== "undefined";

export function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
export function isMobile(v: string) {
  const digits = v.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export type PasswordCheck = {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
};
export function checkPassword(p: string): PasswordCheck {
  return {
    length: p.length >= 8,
    upper: /[A-Z]/.test(p),
    lower: /[a-z]/.test(p),
    number: /[0-9]/.test(p),
    special: /[^A-Za-z0-9]/.test(p),
  };
}
export function passwordValid(p: string) {
  return Object.values(checkPassword(p)).every(Boolean);
}

// ---- Pending flow ----

export function getPending(): PendingFlow | null {
  if (!isBrowser()) return null;
  try {
    return JSON.parse(sessionStorage.getItem(PENDING_KEY) || "null");
  } catch {
    return null;
  }
}
export function updatePending(patch: Partial<PendingFlow>): PendingFlow | null {
  const cur = getPending();
  if (!cur) return null;
  const next = { ...cur, ...patch };
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(next));
  return next;
}
export function clearPending() {
  if (isBrowser()) sessionStorage.removeItem(PENDING_KEY);
}

function writePending(p: PendingFlow) {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(p));
}

export async function startPending(input: {
  kind: "register" | "forgot";
  fullName?: string;
  identifier: string;
}): Promise<PendingFlow> {
  const res = await api.sendOtp({
    data: {
      purpose: input.kind,
      fullName: input.fullName,
      identifier: input.identifier,
    },
  });
  const pending: PendingFlow = {
    kind: input.kind,
    fullName: input.fullName,
    identifier: res.identifier,
    isEmail: res.isEmail,
    otpExpiresAt: new Date(res.expiresAt).getTime(),
    otp: res.devOtp,
  };
  writePending(pending);
  return pending;
}

export async function resendOtp(): Promise<PendingFlow | null> {
  const cur = getPending();
  if (!cur) return null;
  const res = await api.sendOtp({
    data: {
      purpose: cur.kind,
      fullName: cur.fullName,
      identifier: cur.identifier,
    },
  });
  const next: PendingFlow = {
    ...cur,
    otpExpiresAt: new Date(res.expiresAt).getTime(),
    otp: res.devOtp,
    verified: false,
    verificationToken: undefined,
  };
  writePending(next);
  return next;
}

export async function submitOtp(code: string): Promise<PendingFlow> {
  const cur = getPending();
  if (!cur) throw new Error("Session expired. Please restart the flow.");
  const res = await api.verifyOtp({
    data: { identifier: cur.identifier, purpose: cur.kind, code },
  });
  const next: PendingFlow = {
    ...cur,
    verified: true,
    verificationToken: res.verificationToken,
    otp: undefined,
  };
  writePending(next);
  return next;
}

// ---- Account creation / login / reset ----

function persistSession(token: string, user: Account) {
  sessionStorage.setItem(SESSION_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function createAccount(params: { fullName: string; password: string }): Promise<Account> {
  const pending = getPending();
  if (!pending?.verificationToken) throw new Error("Please verify your email/mobile first.");
  const res = await api.register({
    data: {
      fullName: params.fullName,
      password: params.password,
      verificationToken: pending.verificationToken,
    },
  });
  persistSession(res.token, res.user as Account);
  return res.user as Account;
}

export async function login(identifier: string, password: string): Promise<Account> {
  const res = await api.login({ data: { identifier, password } });
  persistSession(res.token, res.user as Account);
  return res.user as Account;
}

export async function resetPassword(password: string): Promise<void> {
  const pending = getPending();
  if (!pending?.verificationToken) throw new Error("Please verify your email/mobile first.");
  await api.resetPassword({
    data: { password, verificationToken: pending.verificationToken },
  });
}

export function getCurrentAccount(): Account | null {
  if (!isBrowser()) return null;
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
export function getSessionToken(): string | null {
  if (!isBrowser()) return null;
  return sessionStorage.getItem(SESSION_KEY);
}
export function logout() {
  if (!isBrowser()) return;
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(USER_KEY);
}
export function isAuthenticated(): boolean {
  return !!getSessionToken() && !!getCurrentAccount();
}
