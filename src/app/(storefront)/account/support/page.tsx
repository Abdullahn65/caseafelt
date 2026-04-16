import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "My Support Tickets",
};

const statusVariant: Record<string, "default" | "success" | "warning" | "error"> = {
  OPEN: "warning",
  IN_PROGRESS: "default",
  RESOLVED: "success",
  CLOSED: "default",
};

export default async function AccountSupportPage() {
  const user = await requireAuth();

  const tickets = await db.supportTicket.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { messages: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Support Tickets</h2>
        <Link
          href="/contact"
          className="text-sm text-accent-olive hover:underline font-medium"
        >
          New request
        </Link>
      </div>

      {tickets.length === 0 ? (
        <p className="mt-4 text-sm text-fg-secondary">
          You don&apos;t have any support tickets.{" "}
          <Link href="/contact" className="text-accent-olive hover:underline">
            Contact us
          </Link>{" "}
          if you need help.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {tickets.map((ticket: any) => (
            <Link
              key={ticket.id}
              href={`/account/support/${ticket.id}`}
              className="block rounded-lg border border-border-default p-4 hover:border-border-strong transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{ticket.subject}</p>
                  <p className="text-xs text-fg-tertiary mt-0.5">
                    #{ticket.id.slice(-6)} · {ticket._count.messages}{" "}
                    {ticket._count.messages === 1 ? "message" : "messages"}
                  </p>
                </div>
                <Badge variant={statusVariant[ticket.status] ?? "default"}>
                  {ticket.status.toLowerCase().replace("_", " ")}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
