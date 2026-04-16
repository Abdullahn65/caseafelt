import Link from "next/link";
import { getCustomersForAdmin } from "@/lib/data/queries";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const search = params.search;
  const page = Number(params.page ?? "1");

  const { customers, total } = await getCustomersForAdmin({
    search,
    page,
    pageSize: 25,
  });

  const totalPages = Math.ceil(total / 25);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Customers</h1>

      {/* Search */}
      <form className="mt-4" action="/admin/customers">
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Search by name or email…"
          className="h-9 w-full max-w-sm rounded-md border border-border-default bg-bg-primary px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-olive/40"
        />
      </form>

      <div className="mt-6 rounded-lg border border-border-default overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default bg-bg-secondary text-left">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium text-right">Total Spent</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {customers.map((customer: any) => (
              <tr key={customer.id} className="hover:bg-bg-secondary/50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="font-medium hover:underline"
                  >
                    {customer.name ?? "—"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-fg-secondary">
                  {customer.email}
                </td>
                <td className="px-4 py-3 text-fg-secondary">
                  {customer._count?.orders ?? 0}
                </td>
                <td className="px-4 py-3 text-right text-fg-secondary">
                  {customer.totalSpent ? `€${(customer.totalSpent / 100).toFixed(2)}` : "€0.00"}
                </td>
                <td className="px-4 py-3 text-fg-tertiary text-xs">
                  {new Date(customer.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-fg-tertiary">
            Page {page} of {totalPages} · {total} customers
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/customers?page=${page - 1}${search ? `&search=${search}` : ""}`}
                className="px-3 py-1.5 rounded border border-border-default hover:bg-bg-secondary"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/customers?page=${page + 1}${search ? `&search=${search}` : ""}`}
                className="px-3 py-1.5 rounded border border-border-default hover:bg-bg-secondary"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
