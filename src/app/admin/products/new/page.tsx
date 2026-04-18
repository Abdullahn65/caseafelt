import { db } from "@/lib/db";
import ProductForm from "@/components/admin/product-form";

export default async function AdminNewProductPage() {
  // Fetch reference data for dropdowns
  const [collections, materials, deviceModels] = await Promise.all([
    db.collection.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, name: true },
      orderBy: { sortOrder: "asc" },
    }),
    db.material.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    db.deviceModel.findMany({
      where: { isActive: true },
      select: { id: true, brand: true, name: true },
      orderBy: [{ brand: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  return (
    <ProductForm
      mode="create"
      collections={collections}
      materials={materials}
      deviceModels={deviceModels}
    />
  );
}
