// Client-side auth store for the CareerConnect prototype.
// Uses localStorage (accounts) + sessionStorage (active session).
// Passwords are hashed with SHA-256 (prototype-grade, not production crypto).

const ACCOUNTS_KEY = "cc.accounts";
const SESSION_KEY = "cc.session";
const PENDING_KEY = "cc.pending"; // in-progress registration / forgot flow

export type Account = {
  id: string;
  fullName: string;
  email?: string;
  mobile?: string;
  passwordHash: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PendingFlow = {
  kind: "register" | "forgot";
  fullName?: string;
  email?: string;
  mobile?: string;
  otp: string;
  otpExpiresAt: number;
  verified?: boolean;
  accountId?: string; // for forgot
};

const isBrowser = () => typeof window !== "undefined";

async function sha256(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readAccounts(): Account[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAccounts(a: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(a));
}

export function findAccount(identifier: string): Account | undefined {
  const id = identifier.trim().toLowerCase();
  return readAccounts().find(
    (a) => a.email?.toLowerCase() === id || a.mobile === identifier.trim(),
  );
}

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

// ---- Pending flow (registration / forgot) ----

export function startPending(input: Omit<PendingFlow, "otp" | "otpExpiresAt">): PendingFlow {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const pending: PendingFlow = {
    ...input,
    otp,
    otpExpiresAt: Date.now() + 60_000, // 60s
  };
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  return pending;
}

export function getPending(): PendingFlow | null {
  if (!isBrowser()) return null;
  try {
    return JSON.parse(sessionStorage.getItem(PENDING_KEY) || "null");
  } catch {
    return null;
  }
}

export function updatePending(patch: Partial<PendingFlow>) {
  const cur = getPending();
  if (!cur) return null;
  const next = { ...cur, ...patch };
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(next));
  return next;
}

export function resendOtp(): PendingFlow | null {
  const cur = getPending();
  if (!cur) return null;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return updatePending({ otp, otpExpiresAt: Date.now() + 60_000 });
}

export function clearPending() {
  sessionStorage.removeItem(PENDING_KEY);
}

// ---- Account creation / login ----

export async function createAccount(params: {
  fullName: string;
  email?: string;
  mobile?: string;
  password: string;
}): Promise<Account> {
  const accounts = readAccounts();
  const identifier = params.email || params.mobile;
  if (!identifier) throw new Error("Email or mobile required");
  if (findAccount(identifier)) throw new Error("Account already exists");
  const now = new Date().toISOString();
  const account: Account = {
    id: crypto.randomUUID(),
    fullName: params.fullName,
    email: params.email,
    mobile: params.mobile,
    passwordHash: await sha256(params.password),
    verified: true,
    createdAt: now,
    updatedAt: now,
  };
  accounts.push(account);
  writeAccounts(accounts);
  return account;
}

export async function login(identifier: string, password: string): Promise<Account> {
  const acc = findAccount(identifier);
  if (!acc) throw new Error("No account found for this email/mobile");
  const hash = await sha256(password);
  if (hash !== acc.passwordHash) throw new Error("Incorrect password");
  sessionStorage.setItem(SESSION_KEY, acc.id);
  return acc;
}

export async function resetPassword(accountId: string, password: string) {
  const accounts = readAccounts();
  const idx = accounts.findIndex((a) => a.id === accountId);
  if (idx === -1) throw new Error("Account not found");
  accounts[idx].passwordHash = await sha256(password);
  accounts[idx].updatedAt = new Date().toISOString();
  writeAccounts(accounts);
}

export function getCurrentAccount(): Account | null {
  if (!isBrowser()) return null;
  const id = sessionStorage.getItem(SESSION_KEY);
  if (!id) return null;
  return readAccounts().find((a) => a.id === id) || null;
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  return !!getCurrentAccount();
}
