import Link from "next/link";
import { getTicketsForAdmin, getContactSubmissionsForAdmin } from "@/lib/data/queries";
import { Badge } from "@/components/ui/badge";

const ticketStatusVariant: Record<string, "default" | "success" | "warning" | "error"> = {
  OPEN: "warning",
  IN_PROGRESS: "default",
  RESOLVED: "success",
  CLOSED: "default",
};

export default async function AdminSupportPage() {
  const [ticketsResult, contactsResult] = await Promise.all([
    getTicketsForAdmin({ pageSize: 20 }),
    getContactSubmissionsForAdmin({ pageSize: 10 }),
  ]);

  return (
    <div className="space-y-10">
      {/* Tickets */}
      <section>
        <h1 className="text-2xl font-semibold">Support</h1>

        <h2 className="mt-6 text-lg font-medium">Recent Tickets</h2>
        <div className="mt-3 rounded-lg border border-border-default overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-secondary text-left">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {ticketsResult.tickets.map((ticket: any) => (
                <tr key={ticket.id} className="hover:bg-bg-secondary/50">
                  <td className="px-4 py-3 text-fg-tertiary text-xs">
                    {ticket.ticketNumber}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/support/${ticket.id}`}
                      className="font-medium hover:underline"
                    >
                      {ticket.subject}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-fg-secondary">
                    {ticket.user?.name ?? ticket.user?.email ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={ticketStatusVariant[ticket.status] ?? "default"}>
                      {ticket.status.toLowerCase().replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-fg-tertiary text-xs">
                    {new Date(ticket.updatedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Contact submissions */}
      <section>
        <h2 className="text-lg font-medium">Recent Contact Submissions</h2>
        <div className="mt-3 rounded-lg border border-border-default overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-secondary text-left">
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">From</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {contactsResult.submissions.map((sub: any) => (
                <tr key={sub.id} className="hover:bg-bg-secondary/50">
                  <td className="px-4 py-3">
                    <Badge variant="default">{sub.type.toLowerCase()}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium">{sub.subject}</td>
                  <td className="px-4 py-3 text-fg-secondary">
                    {sub.name} ({sub.email})
                  </td>
                  <td className="px-4 py-3 text-fg-tertiary text-xs">
                    {new Date(sub.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={sub.isRead ? "default" : "warning"}>
                      {sub.isRead ? "read" : "unread"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
