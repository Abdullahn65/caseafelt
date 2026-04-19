import Link from "next/link";
import { getProductsForAdmin } from "@/lib/data/queries";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DuplicateButton } from "@/components/admin/duplicate-button";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");

  const { products, total } = await getProductsForAdmin({ page, pageSize: 25 });

  const totalPages = Math.ceil(total / 25);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/new">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add product
          </Button>
        </Link>
      </div>

      <div className="mt-6 rounded-lg border border-border-default overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default bg-bg-secondary text-left">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Variants</th>
              <th className="px-4 py-3 font-medium text-right">Base Price</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {products.map((product: any) => (
              <tr key={product.id} className="hover:bg-bg-secondary/50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="font-medium hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-fg-tertiary mt-0.5">
                    {product.slug}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      product.status === "ACTIVE"
                        ? "success"
                        : product.status === "DRAFT"
                        ? "default"
                        : "warning"
                    }
                  >
                    {product.status.toLowerCase()}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-fg-secondary">
                  {product._count?.variants ?? product.variants?.length ?? 0}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatPrice(product.basePrice)}
                </td>
                <td className="px-4 py-3 text-right">
                  <DuplicateButton productId={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-fg-tertiary">
            Page {page} of {totalPages} · {total} products
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/products?page=${page - 1}`}
                className="px-3 py-1.5 rounded border border-border-default hover:bg-bg-secondary"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/products?page=${page + 1}`}
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
