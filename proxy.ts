import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory rate limiter (per-IP, 20 req/min on /api/chat)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

// Parses ALLOWED_EMAILS env var — handles quotes and extra whitespace
// e.g. `"alice@gmail.com", "bob@gmail.com"` or `alice@gmail.com,bob@gmail.com`
function getAllowedEmails(): Set<string> {
  const raw = process.env.ALLOWED_EMAILS ?? '';
  return new Set(
    raw
      .split(',')
      .map((e) => e.trim().replace(/^["']|["']$/g, '').toLowerCase())
      .filter(Boolean)
  );
}

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/unauthorized']);

export const proxy = clerkMiddleware(async (auth, req) => {
  // Rate limit /api/chat before auth check
  if (req.nextUrl.pathname.startsWith('/api/chat')) {
    const ip = getClientIP(req);
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
      rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    } else {
      entry.count++;
      if (entry.count > MAX_REQUESTS) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment.' },
          { status: 429 }
        );
      }
    }
  }

  if (isPublicRoute(req)) return;

  // Require authentication
  await auth.protect();

  // Email allowlist check (only when ALLOWED_EMAILS is configured)
  const allowedEmails = getAllowedEmails();
  if (allowedEmails.size > 0) {
    const { userId } = await auth();
    if (userId) {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const email = user.emailAddresses
        .find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress?.toLowerCase();

      if (!email || !allowedEmails.has(email)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
