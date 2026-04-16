import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AddressManager } from "@/components/account/address-manager";

export const metadata: Metadata = {
  title: "My Addresses",
};

export default async function AddressesPage() {
  const user = await requireAuth();

  const addresses = await db.address.findMany({
    where: { userId: user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold">Addresses</h2>
      <p className="mt-1 text-sm text-fg-secondary">
        Manage your shipping addresses.
      </p>
      <div className="mt-6">
        <AddressManager addresses={addresses} />
      </div>
    </div>
  );
}
