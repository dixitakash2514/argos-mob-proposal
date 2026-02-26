import { SignJWT, jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

export const COOKIE_NAME = 'am_session';
const EXPIRY = '7d';

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET env var is not set');
  return new TextEncoder().encode(secret);
}

/** Parses AUTH_USERS=user1:pass1,user2:pass2 → Map<username, password> */
export function getAllowedUsers(): Map<string, string> {
  const raw = process.env.AUTH_USERS ?? '';
  const map = new Map<string, string>();
  for (const pair of raw.split(',')) {
    const [username, ...rest] = pair.trim().split(':');
    if (username && rest.length > 0) {
      map.set(username.trim(), rest.join(':').trim());
    }
  }
  return map;
}

/** Signs a JWT for the given username, 7-day expiry */
export async function createToken(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecret());
}

/** Reads and verifies the session cookie. Returns { username } or null. */
export async function getSession(
  req: NextRequest
): Promise<{ username: string } | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const username = payload.username as string | undefined;
    if (!username) return null;
    return { username };
  } catch {
    return null;
  }
}

/** Returns a Set-Cookie header string that immediately expires the session cookie */
export function clearCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
