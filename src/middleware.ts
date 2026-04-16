import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * MVP Middleware — no auth gating.
 * 
 * Clerk auth is deferred to a later phase. For now:
 * - /account/* and /admin/* redirect to homepage (no login available)
 * - All other routes pass through
 * 
 * When Clerk is enabled, replace this with clerkMiddleware.
 */
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Block account/admin routes until auth is enabled
  if (pathname.startsWith("/account") || pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)).*)",
  ],
};
