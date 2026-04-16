/**
 * Auth utilities — MVP version (no Clerk).
 *
 * When Clerk is enabled later, restore:
 *   import { currentUser } from "@clerk/nextjs/server"
 *   and look up user by clerkId in getCurrentUser().
 */

import { redirect } from "next/navigation";

/** Minimal user shape required by account / admin pages. */
export interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
}

/**
 * Get the current authenticated user from our database.
 * MVP: Always returns null — no logged-in users yet.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  return null;
}

/**
 * Require authentication. Redirects to homepage if not authenticated.
 * MVP: Always redirects — auth-gated pages are also blocked by middleware.
 */
export async function requireAuth(): Promise<AuthUser> {
  // In MVP, middleware already blocks /account/* routes.
  // This redirect is a safety net; the return type keeps TS happy.
  redirect("/");
}

/**
 * Require admin role. Redirects to homepage if not authorized.
 * MVP: Always redirects — admin routes are also blocked by middleware.
 */
export async function requireAdmin(): Promise<AuthUser> {
  redirect("/");
}
