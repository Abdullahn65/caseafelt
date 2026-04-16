import Link from "next/link";
import { getInventoryForAdmin } from "@/lib/data/queries";
import { Badge } from "@/components/ui/badge";

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const filter = params.filter; // "low" | "out" | undefined
  const page = Number(params.page ?? "1");

  const { variants, total } = await getInventoryForAdmin({
    status: filter as "low" | "out" | undefined,
    page,
    pageSize: 50,
  });

  const totalPages = Math.ceil(total / 50);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Inventory</h1>

      {/* Filters */}
      <div className="mt-4 flex items-center gap-2">
        {[
          { key: undefined, label: "All" },
          { key: "low", label: "Low stock" },
          { key: "out", label: "Out of stock" },
        ].map((f) => (
          <Link
            key={f.label}
            href={`/admin/inventory${f.key ? `?filter=${f.key}` : ""}`}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              filter === f.key || (!filter && !f.key)
                ? "bg-fg-primary text-bg-primary border-fg-primary"
                : "border-border-default text-fg-secondary hover:border-border-strong"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border-default overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default bg-bg-secondary text-left">
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Device</th>
              <th className="px-4 py-3 font-medium">Colour</th>
              <th className="px-4 py-3 font-medium text-right">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {variants.map((v: any) => {
              const stockStatus =
                v.inventoryCount === 0
                  ? "out"
                  : v.inventoryCount <= v.lowStockThreshold
                  ? "low"
                  : "ok";
              return (
                <tr key={v.id} className="hover:bg-bg-secondary/50">
                  <td className="px-4 py-3 font-mono text-xs">{v.sku}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${v.product?.id}`}
                      className="font-medium hover:underline"
                    >
                      {v.product?.name ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-fg-secondary">
                    {v.deviceModel?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-fg-secondary">
                    {v.color ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{v.inventoryCount}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        stockStatus === "out"
                          ? "error"
                          : stockStatus === "low"
                          ? "warning"
                          : "success"
                      }
                    >
                      {stockStatus === "out"
                        ? "Out of stock"
                        : stockStatus === "low"
                        ? "Low stock"
                        : "In stock"}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-fg-tertiary">
            Page {page} of {totalPages} · {total} variants
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/inventory?page=${page - 1}${filter ? `&filter=${filter}` : ""}`}
                className="px-3 py-1.5 rounded border border-border-default hover:bg-bg-secondary"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/inventory?page=${page + 1}${filter ? `&filter=${filter}` : ""}`}
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
