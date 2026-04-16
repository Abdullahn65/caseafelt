import type { Metadata } from "next";
import { getCollections } from "@/lib/data";
import { CollectionCard } from "@/components/storefront/collection-card";
import { BreadcrumbNav } from "@/components/storefront/breadcrumb-nav";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse all CaseaFelt collections — tactile phone cases organized by aesthetic and material.",
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="container-page">
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Collections" },
        ]}
      />

      <section className="section-padding">
        <h1 className="text-3xl font-semibold mb-8">Collections</h1>
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <p className="text-fg-secondary">Collections coming soon.</p>
        )}
      </section>
    </div>
  );
}
