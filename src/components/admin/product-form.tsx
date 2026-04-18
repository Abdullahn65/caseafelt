"use client";

import { useState, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Collection {
  id: string;
  name: string;
}

interface Material {
  id: string;
  name: string;
}

interface DeviceModel {
  id: string;
  brand: string;
  name: string;
}

interface VariantInput {
  name: string;
  color: string;
  colorHex: string;
  deviceModelId: string;
  inventoryCount: string;
  price: string;
}

interface ProductFormProps {
  mode: "create" | "edit";
  product?: any;
  collections: Collection[];
  materials: Material[];
  deviceModels: DeviceModel[];
}

export default function ProductForm({
  mode,
  product,
  collections,
  materials,
  deviceModels,
}: ProductFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  // Form state
  const [name, setName] = useState(product?.name ?? "");
  const [shortDescription, setShortDescription] = useState(
    product?.shortDescription ?? ""
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [basePrice, setBasePrice] = useState(
    product ? (product.basePrice / 100).toFixed(2) : ""
  );
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compareAtPrice ? (product.compareAtPrice / 100).toFixed(2) : ""
  );
  const [status, setStatus] = useState(product?.status ?? "DRAFT");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    product?.collections?.map((c: any) => c.collectionId) ?? []
  );
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
    product?.materials?.map((m: any) => m.materialId) ?? []
  );

  // Image state
  const [imageUrl, setImageUrl] = useState(
    product?.images?.find((i: any) => i.isPrimary)?.url ?? ""
  );
  const [imagePreview, setImagePreview] = useState(imageUrl);
  const [uploading, setUploading] = useState(false);

  // Variants state (for new products)
  const [variants, setVariants] = useState<VariantInput[]>(
    mode === "edit" && product?.variants
      ? product.variants.map((v: any) => ({
          name: v.name,
          color: v.color ?? "",
          colorHex: v.colorHex ?? "",
          deviceModelId: v.deviceModelId,
          inventoryCount: String(v.inventoryCount),
          price: v.price ? (v.price / 100).toFixed(2) : "",
        }))
      : []
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── Image upload ───────────────────────────────────────────
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      setImageUrl(data.url);
      setImagePreview(data.url);
    } catch (err: any) {
      setError(err.message);
      setImagePreview(imageUrl); // revert
    } finally {
      setUploading(false);
    }
  }

  // ── Variant management ─────────────────────────────────────
  function addVariant() {
    setVariants([
      ...variants,
      {
        name: "",
        color: "",
        colorHex: "",
        deviceModelId: deviceModels[0]?.id ?? "",
        inventoryCount: "25",
        price: "",
      },
    ]);
  }

  function updateVariant(index: number, field: string, value: string) {
    const updated = [...variants];
    (updated[index] as any)[field] = value;
    setVariants(updated);
  }

  function removeVariant(index: number) {
    setVariants(variants.filter((_, i) => i !== index));
  }

  // ── Submit ─────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: Record<string, any> = {
        name,
        shortDescription,
        description,
        basePrice,
        compareAtPrice: compareAtPrice || null,
        status,
        featured,
        collectionIds: selectedCollections,
        materialIds: selectedMaterials,
        imageUrl: imageUrl || null,
      };

      if (mode === "create") {
        // Include variants for new products
        payload.variants = variants
          .filter((v) => v.name && v.deviceModelId)
          .map((v) => ({
            name: v.name,
            color: v.color || null,
            colorHex: v.colorHex || null,
            deviceModelId: v.deviceModelId,
            inventoryCount: v.inventoryCount,
            price: v.price || null,
          }));
      }

      const url =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${product.id}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      setSuccess(mode === "create" ? "Product created!" : "Product updated!");

      if (mode === "create") {
        const data = await res.json();
        setTimeout(() => {
          router.push(`/admin/products/${data.product.id}`);
        }, 1000);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Collection / Material toggles ─────────────────────────
  function toggleCollection(id: string) {
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function toggleMaterial(id: string) {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-md hover:bg-bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-semibold">
            {mode === "create" ? "New Product" : `Edit: ${product?.name}`}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 rounded-md border border-border-default bg-white px-3 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <Button type="submit" variant="primary" size="sm" loading={saving}>
            <Save className="w-4 h-4 mr-1" />
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      {/* Feedback */}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <div className="rounded-lg border border-border-default p-6 space-y-4">
            <h2 className="font-medium">Basic Information</h2>

            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alpine Felt Case"
                required
              />
            </div>

            <div>
              <Label htmlFor="shortDesc">Short Description</Label>
              <Input
                id="shortDesc"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief description for product cards"
              />
            </div>

            <div>
              <Label htmlFor="desc">Full Description *</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed product description…"
                rows={6}
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-lg border border-border-default p-6 space-y-4">
            <h2 className="font-medium">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Base Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="45.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="compare">Compare-at Price (USD)</Label>
                <Input
                  id="compare"
                  type="number"
                  step="0.01"
                  min="0"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="55.00"
                />
                <p className="text-xs text-fg-tertiary mt-1">
                  Shows a strikethrough original price
                </p>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="rounded-lg border border-border-default p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Variants</h2>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addVariant}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Variant
              </Button>
            </div>

            {variants.length === 0 && (
              <p className="text-sm text-fg-tertiary">
                No variants yet. Add a variant with a device model and color to
                make this product purchasable.
              </p>
            )}

            {variants.map((variant, i) => (
              <div
                key={i}
                className="rounded-md border border-border-default p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Variant {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="text-fg-tertiary hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Variant Name *</Label>
                    <Input
                      value={variant.name}
                      onChange={(e) =>
                        updateVariant(i, "name", e.target.value)
                      }
                      placeholder="e.g. Moss, Charcoal"
                    />
                  </div>
                  <div>
                    <Label>Device Model *</Label>
                    <select
                      value={variant.deviceModelId}
                      onChange={(e) =>
                        updateVariant(i, "deviceModelId", e.target.value)
                      }
                      className="flex h-11 w-full rounded-md border border-border-default bg-white px-4 text-base"
                    >
                      {deviceModels.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.brand} {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Color Name</Label>
                    <Input
                      value={variant.color}
                      onChange={(e) =>
                        updateVariant(i, "color", e.target.value)
                      }
                      placeholder="Moss"
                    />
                  </div>
                  <div>
                    <Label>Color Hex</Label>
                    <div className="flex gap-2">
                      <Input
                        value={variant.colorHex}
                        onChange={(e) =>
                          updateVariant(i, "colorHex", e.target.value)
                        }
                        placeholder="#5C6B4F"
                      />
                      {variant.colorHex && (
                        <div
                          className="w-11 h-11 rounded-md border border-border-default shrink-0"
                          style={{ backgroundColor: variant.colorHex }}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Stock Count</Label>
                    <Input
                      type="number"
                      min="0"
                      value={variant.inventoryCount}
                      onChange={(e) =>
                        updateVariant(i, "inventoryCount", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Override Price (USD)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={variant.price}
                      onChange={(e) =>
                        updateVariant(i, "price", e.target.value)
                      }
                      placeholder="Leave blank to use base price"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Image */}
          <div className="rounded-lg border border-border-default p-6 space-y-4">
            <h2 className="font-medium">Product Image</h2>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative aspect-square rounded-lg border-2 border-dashed border-border-default hover:border-fg-tertiary cursor-pointer transition-colors overflow-hidden bg-bg-secondary flex items-center justify-center"
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Product"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-fg-tertiary mx-auto" />
                  <p className="text-sm text-fg-tertiary mt-2">
                    Click to upload
                  </p>
                  <p className="text-xs text-fg-tertiary">
                    JPEG, PNG, WebP · Max 10MB
                  </p>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <p className="text-sm font-medium">Uploading…</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
            {imageUrl && (
              <p className="text-xs text-fg-tertiary truncate">{imageUrl}</p>
            )}
          </div>

          {/* Featured */}
          <div className="rounded-lg border border-border-default p-6 space-y-3">
            <h2 className="font-medium">Visibility</h2>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-border-default accent-accent-olive"
              />
              Show on homepage (featured)
            </label>
          </div>

          {/* Collections */}
          <div className="rounded-lg border border-border-default p-6 space-y-3">
            <h2 className="font-medium">Collections</h2>
            {collections.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCollections.includes(c.id)}
                  onChange={() => toggleCollection(c.id)}
                  className="w-4 h-4 rounded border-border-default accent-accent-olive"
                />
                {c.name}
              </label>
            ))}
            {collections.length === 0 && (
              <p className="text-xs text-fg-tertiary">No collections found</p>
            )}
          </div>

          {/* Materials */}
          <div className="rounded-lg border border-border-default p-6 space-y-3">
            <h2 className="font-medium">Materials</h2>
            {materials.map((m) => (
              <label
                key={m.id}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(m.id)}
                  onChange={() => toggleMaterial(m.id)}
                  className="w-4 h-4 rounded border-border-default accent-accent-olive"
                />
                {m.name}
              </label>
            ))}
            {materials.length === 0 && (
              <p className="text-xs text-fg-tertiary">No materials found</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
