import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, ShoppingBag, TrendingUp } from "lucide-react";

export const metadata = { title: "CRM" };

export default async function CRMPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; tag?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const tagFilter = params.tag ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const pageSize = 20;

  // Build where clause
  const where: any = { deletedAt: null };
  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }
  if (tagFilter) {
    where.customerTags = { some: { tag: tagFilter } };
  }

  const [customers, total, allTags, metrics] = await Promise.all([
    db.user.findMany({
      where,
      include: {
        customerTags: true,
        _count: { select: { orders: true, customerNotes: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.user.count({ where }),
    db.customerTag.findMany({
      select: { tag: true },
      distinct: ["tag"],
      orderBy: { tag: "asc" },
    }),
    Promise.all([
      db.user.count({ where: { deletedAt: null } }),
      db.user.count({ where: { deletedAt: null, role: { in: ["ADMIN", "SUPER_ADMIN"] } } }),
      db.order.count(),
      db.order.aggregate({ _sum: { total: true } }),
    ]),
  ]);

  const [totalCustomers, totalAdmins, totalOrders, revenue] = metrics;
  const totalPages = Math.ceil(total / pageSize);

  const cards = [
    { label: "Total Customers", value: totalCustomers, icon: Users },
    { label: "Team Members", value: totalAdmins, icon: UserCheck },
    { label: "Total Orders", value: totalOrders, icon: ShoppingBag },
    { label: "Total Revenue", value: formatPrice(revenue._sum.total ?? 0), icon: TrendingUp },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">CRM</h1>
      <p className="text-sm text-fg-secondary mt-1">
        Customer relationships, notes, tags & team management
      </p>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-border-default bg-bg-primary p-4">
            <div className="flex items-center gap-2 text-fg-tertiary">
              <c.icon className="w-4 h-4" />
              <span className="text-xs">{c.label}</span>
            </div>
            <p className="text-xl font-semibold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Tag filter */}
      <div className="flex flex-wrap gap-3 mt-6">
        <form action="/admin/crm" className="flex gap-2">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by name or email..."
            className="rounded-md border border-border-default bg-bg-primary px-3 py-1.5 text-sm w-64"
          />
          {tagFilter && <input type="hidden" name="tag" value={tagFilter} />}
          <button type="submit" className="rounded-md bg-fg-primary text-bg-primary px-3 py-1.5 text-sm">
            Search
          </button>
        </form>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center">
            <span className="text-xs text-fg-tertiary mr-1">Tags:</span>
            <Link
              href="/admin/crm"
              className={`text-xs px-2 py-0.5 rounded-full border ${!tagFilter ? "bg-fg-primary text-bg-primary" : "border-border-default"}`}
            >
              All
            </Link>
            {allTags.map((t: { tag: string }) => (
              <Link
                key={t.tag}
                href={`/admin/crm?tag=${t.tag}${search ? `&search=${search}` : ""}`}
                className={`text-xs px-2 py-0.5 rounded-full border ${tagFilter === t.tag ? "bg-fg-primary text-bg-primary" : "border-border-default"}`}
              >
                {t.tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Customer table */}
      <div className="mt-4 border border-border-default rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-secondary text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Customer</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Tags</th>
              <th className="px-4 py-2 font-medium text-right">Orders</th>
              <th className="px-4 py-2 font-medium text-right">Notes</th>
              <th className="px-4 py-2 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {customers.map((c: any) => (
              <tr key={c.id} className="hover:bg-bg-secondary/50">
                <td className="px-4 py-2">
                  <Link href={`/admin/crm/${c.id}`} className="hover:underline font-medium">
                    {c.firstName ?? ""} {c.lastName ?? ""}
                  </Link>
                  <p className="text-xs text-fg-tertiary">{c.email}</p>
                </td>
                <td className="px-4 py-2">
                  <Badge variant={c.role === "CUSTOMER" ? "default" : "success"}>
                    {c.role}
                  </Badge>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {c.customerTags.map((t: any) => (
                      <span key={t.id} className="text-xs bg-bg-secondary px-1.5 py-0.5 rounded">
                        {t.tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2 text-right">{c._count.orders}</td>
                <td className="px-4 py-2 text-right">{c._count.customerNotes}</td>
                <td className="px-4 py-2 text-xs text-fg-tertiary">
                  {c.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-fg-tertiary">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-4">
          {page > 1 && (
            <Link href={`/admin/crm?page=${page - 1}${search ? `&search=${search}` : ""}${tagFilter ? `&tag=${tagFilter}` : ""}`} className="text-sm underline">
              ← Previous
            </Link>
          )}
          <span className="text-sm text-fg-tertiary">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={`/admin/crm?page=${page + 1}${search ? `&search=${search}` : ""}${tagFilter ? `&tag=${tagFilter}` : ""}`} className="text-sm underline">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
