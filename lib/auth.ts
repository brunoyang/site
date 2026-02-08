import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { adminUsers } from '@/db/schema';

const COOKIE_NAME = 'admin_token';
const TOKEN_TTL_S = 24 * 60 * 60; // 24 hours

// ── Helpers ──────────────────────────────────────────────────────────────────

function b64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function b64urlDecode(s: string): Uint8Array<ArrayBuffer> {
  const binary = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not set');
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function sha256hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── JWT ──────────────────────────────────────────────────────────────────────

type JwtPayload = { sub: string; iat: number; exp: number };

async function signJwt(payload: JwtPayload): Promise<string> {
  const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body = b64url(new TextEncoder().encode(JSON.stringify(payload)));
  const data = `${header}.${body}`;
  const key = await getHmacKey();
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}.${b64url(sig)}`;
}

async function verifyJwt(token: string): Promise<JwtPayload | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, sigB64] = parts;
  const data = `${header}.${body}`;
  const key = await getHmacKey();
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    b64urlDecode(sigB64),
    new TextEncoder().encode(data)
  );
  if (!valid) return null;
  const payload: JwtPayload = JSON.parse(new TextDecoder().decode(b64urlDecode(body)));
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function login(username: string, password: string): Promise<boolean> {
  const db = await getDb();
  const [user] = await db
    .select({ passwordHash: adminUsers.passwordHash })
    .from(adminUsers)
    .where(eq(adminUsers.username, username));
  if (!user) return false;

  const hash = await sha256hex(password);
  if (hash !== user.passwordHash) return false;

  const now = Math.floor(Date.now() / 1000);
  const token = await signJwt({ sub: username, iat: now, exp: now + TOKEN_TTL_S });

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_TTL_S,
    path: '/',
  });
  return true;
}

export async function requireAuth(locale: string): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token || !(await verifyJwt(token))) {
    redirect(`/${locale}/admin/login`);
  }
}

export async function logout(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
