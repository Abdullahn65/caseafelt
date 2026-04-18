"use client";

import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { Shield } from "lucide-react";

/**
 * User menu for the site header.
 * - Signed out: shows "Sign in" button
 * - Signed in (regular customer): shows Clerk UserButton
 * - Signed in (admin): shows Admin Dashboard link + UserButton
 */
export function UserMenu({ isAdmin }: { isAdmin: boolean }) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="w-8 h-8 rounded-full bg-bg-secondary animate-pulse" />;
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="redirect">
        <button className="text-sm font-medium text-fg-secondary hover:text-fg-primary transition-colors">
          Sign in
        </button>
      </SignInButton>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-xs font-medium text-fg-secondary hover:text-fg-primary bg-bg-secondary hover:bg-bg-tertiary px-2.5 py-1.5 rounded-md transition-colors"
        >
          <Shield className="w-3.5 h-3.5" />
          Admin
        </Link>
      )}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
