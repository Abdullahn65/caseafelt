import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Account Settings",
};

export default async function SettingsPage() {
  await requireAuth();

  return (
    <div>
      <h2 className="text-xl font-semibold">Settings</h2>
      <p className="mt-1 text-sm text-fg-secondary">
        Manage your account details and preferences.
      </p>
      <div className="mt-6 rounded-lg border border-border-default p-8 text-center text-fg-secondary">
        <p>Account settings will be available once user accounts are enabled.</p>
      </div>
    </div>
  );
}
