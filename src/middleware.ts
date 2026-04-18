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
  const { userId, sessionClaims } = await auth.protect();

  // Admin routes require ADMIN or SUPER_ADMIN role
  if (isAdminRoute(req)) {
    const role = (sessionClaims?.metadata as any)?.role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)).*)",
  ],
};
