import type { Metadata } from "next";
import { getProducts } from "@/lib/data";
import { ProductCard } from "@/components/storefront/product-card";
import { BreadcrumbNav } from "@/components/storefront/breadcrumb-nav";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse all CaseaFelt phone cases — premium felt, cork, and leather cases for iPhone, Samsung Galaxy, and Google Pixel.",
};

export default async function ProductsPage() {
  const products = await getProducts({ orderBy: "newest" });

  return (
    <div className="container-page section-padding">
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "All Products" },
        ]}
      />

      <div className="mt-6">
        <h1 className="text-3xl font-semibold">All Products</h1>
        <p className="mt-2 text-fg-secondary">
          Every case we make — crafted from felt, cork, and leather.
        </p>
      </div>

      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-lg text-fg-secondary">
            No products available yet. Check back soon.
          </p>
        </div>
      )}
    </div>
  );
}
