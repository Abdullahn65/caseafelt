import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  AddNoteForm,
  AddTagForm,
  RemoveTagButton,
  RoleChanger,
} from "@/components/admin/crm-actions";

export default async function CRMCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = await requireAdmin();

  const customer = await db.user.findUnique({
    where: { id },
    include: {
      customerTags: { orderBy: { tag: "asc" } },
      customerNotes: { orderBy: { createdAt: "desc" }, take: 50 },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { items: true },
      },
      _count: { select: { orders: true, reviews: true, supportTickets: true } },
    },
  });

  if (!customer) notFound();

  const totalSpent = customer.orders.reduce(
    (sum: number, o: any) => sum + (o.totalAmount?.toNumber?.() ?? Number(o.totalAmount) ?? 0),
    0
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/crm" className="text-sm text-fg-tertiary hover:underline">
            ← Back to CRM
          </Link>
          <h1 className="text-2xl font-semibold mt-2">
            {customer.firstName ?? ""} {customer.lastName ?? ""}
          </h1>
          <p className="text-sm text-fg-secondary">{customer.email}</p>
          {customer.phone && (
            <p className="text-sm text-fg-tertiary">{customer.phone}</p>
          )}
        </div>
        <div className="text-right text-sm">
          <p className="text-fg-tertiary">Joined {customer.createdAt.toLocaleDateString()}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-fg-tertiary">Role:</span>
            {admin.role === "SUPER_ADMIN" ? (
              <RoleChanger userId={customer.id} currentRole={customer.role} />
            ) : (
              <Badge>{customer.role}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {[
          { label: "Orders", value: customer._count.orders },
          { label: "Total Spent", value: formatPrice(totalSpent) },
          { label: "Reviews", value: customer._count.reviews },
          { label: "Tickets", value: customer._count.supportTickets },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border-default p-3">
            <p className="text-xs text-fg-tertiary">{s.label}</p>
            <p className="text-lg font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="mt-6">
        <h2 className="text-sm font-medium mb-2">Tags</h2>
        <div className="flex flex-wrap gap-2 items-center">
          {customer.customerTags.map((t: any) => (
            <RemoveTagButton key={t.id} userId={customer.id} tag={t.tag} />
          ))}
          <AddTagForm userId={customer.id} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* Notes */}
        <div>
          <h2 className="text-sm font-medium mb-2">Internal Notes</h2>
          <AddNoteForm userId={customer.id} />
          <div className="mt-3 space-y-2 max-h-96 overflow-y-auto">
            {customer.customerNotes.length === 0 && (
              <p className="text-sm text-fg-tertiary py-4">No notes yet</p>
            )}
            {customer.customerNotes.map((n: any) => (
              <div key={n.id} className="border border-border-default rounded-md p-3">
                <p className="text-sm">{n.body}</p>
                <p className="text-xs text-fg-tertiary mt-1">
                  {n.createdAt.toLocaleString()} · by {n.createdBy === admin.id ? "you" : n.createdBy}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order history */}
        <div>
          <h2 className="text-sm font-medium mb-2">Recent Orders</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {customer.orders.length === 0 && (
              <p className="text-sm text-fg-tertiary py-4">No orders yet</p>
            )}
            {customer.orders.map((o: any) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="block border border-border-default rounded-md p-3 hover:bg-bg-secondary/50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {o.orderNumber ?? o.id.slice(0, 8)}
                  </span>
                  <Badge
                    variant={
                      o.status === "DELIVERED" ? "success" :
                      o.status === "CANCELLED" ? "error" : "default"
                    }
                  >
                    {o.status}
                  </Badge>
                </div>
                <div className="flex justify-between mt-1 text-xs text-fg-tertiary">
                  <span>{o.items.length} item{o.items.length !== 1 ? "s" : ""}</span>
                  <span>{formatPrice(o.totalAmount?.toNumber?.() ?? Number(o.totalAmount) ?? 0)}</span>
                </div>
                <p className="text-xs text-fg-tertiary mt-0.5">
                  {o.createdAt.toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Marketing preferences */}
      <div className="mt-6 p-4 border border-border-default rounded-lg">
        <h2 className="text-sm font-medium">Preferences</h2>
        <div className="flex gap-6 mt-2 text-sm">
          <span>
            Marketing opt-in:{" "}
            <strong>{customer.marketingOptIn ? "Yes ✓" : "No ✗"}</strong>
          </span>
          <span>
            Email verified:{" "}
            <strong>{customer.emailVerified ? "Yes ✓" : "No ✗"}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
