import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProductForm from "@/components/admin/product-form";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, collections, materials, deviceModels] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: {
          include: { deviceModel: true, material: true },
          orderBy: { createdAt: "asc" },
        },
        collections: { include: { collection: true } },
        materials: { include: { material: true } },
      },
    }),
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

  if (!product) notFound();

  return (
    <ProductForm
      mode="edit"
      product={product}
      collections={collections}
      materials={materials}
      deviceModels={deviceModels}
    />
  );
}
