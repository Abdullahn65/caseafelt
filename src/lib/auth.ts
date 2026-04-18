/**
 * Auth utilities — Clerk-powered.
 *
 * Uses Clerk for authentication and our local DB for role/profile data.
 */

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

/** Minimal user shape required by account / admin pages. */
export interface AuthUser {
  id: string;
  clerkId: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
}

/**
 * Get the current authenticated user from our database.
 * Auto-creates a local user record if Clerk user exists but DB record doesn't.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const clerk = await currentUser();
  if (!clerk) return null;

  let user = await db.user.findUnique({
    where: { clerkId: clerk.id },
    select: {
      id: true,
      clerkId: true,
      email: true,
      role: true,
      firstName: true,
      lastName: true,
    },
  });

  // Auto-provision: Clerk user exists but no local DB record yet
  if (!user) {
    const email =
      clerk.emailAddresses.find((e) => e.id === clerk.primaryEmailAddressId)
        ?.emailAddress ?? clerk.emailAddresses[0]?.emailAddress ?? "";

    user = await db.user.create({
      data: {
        clerkId: clerk.id,
        email,
        firstName: clerk.firstName,
        lastName: clerk.lastName,
        avatarUrl: clerk.imageUrl,
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  return user;
}

/**
 * Require authentication. Redirects to sign-in if not authenticated.
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return user;
}

/**
 * Require admin role. Redirects to homepage if not authorized.
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") redirect("/");
  return user;
}
