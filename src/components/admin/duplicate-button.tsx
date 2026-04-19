"use client";

import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { useState } from "react";

export function DuplicateButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDuplicate() {
    if (!confirm("Duplicate this product with all variants and settings?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/duplicate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to duplicate");
      const { product } = await res.json();
      router.push(`/admin/products/${product.id}`);
      router.refresh();
    } catch {
      alert("Failed to duplicate product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDuplicate}
      disabled={loading}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-border-default hover:bg-bg-secondary disabled:opacity-50"
      title="Duplicate product"
    >
      <Copy className="w-3 h-3" />
      {loading ? "…" : "Duplicate"}
    </button>
  );
}
