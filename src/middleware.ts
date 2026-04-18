import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Clerk-powered middleware.
 *
 * Public routes: storefront, API webhooks, health check, sign-in/up.
 * Protected routes: /account/* requires login, /admin/* requires ADMIN role.
 */

const isPublicRoute = createRouteMatcher([
  "/",
  "/products(.*)",
  "/collections(.*)",
  "/cart(.*)",
  "/about",
  "/contact",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/health",
  "/api/cart(.*)",
  "/api/checkout(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Public routes — no auth required
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // All other routes require authentication
  await auth.protect();

  // Admin route access is checked in the admin layout via requireAdmin()
  // This avoids needing to sync roles into Clerk session claims

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)).*)",
  ],
};
