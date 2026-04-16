"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addressSchema, type AddressInput } from "@/lib/validations/account";

interface Address {
  id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressManagerProps {
  addresses: Address[];
}

export function AddressManager({ addresses: initialAddresses }: AddressManagerProps) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data: AddressInput = {
      label: (formData.get("label") as string) || "",
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      company: (formData.get("company") as string) || "",
      line1: formData.get("line1") as string,
      line2: (formData.get("line2") as string) || "",
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postalCode: formData.get("postalCode") as string,
      country: formData.get("country") as string,
      phone: (formData.get("phone") as string) || "",
      isDefault: formData.get("isDefault") === "on",
    };

    const result = addressSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) return;
      const newAddr = await res.json();
      setAddresses((prev) => [...prev, newAddr]);
      setShowForm(false);
      (e.target as HTMLFormElement).reset();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    }
  }

  return (
    <div className="space-y-4">
      {addresses.length === 0 && !showForm && (
        <p className="text-sm text-fg-tertiary">No saved addresses.</p>
      )}

      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="flex items-start justify-between rounded-lg border border-border-default p-4"
        >
          <div className="text-sm">
            {addr.label && (
              <p className="font-medium">
                {addr.label}
                {addr.isDefault && (
                  <span className="ml-2 text-xs text-accent-olive">(Default)</span>
                )}
              </p>
            )}
            <p className="text-fg-secondary">
              {addr.line1}
              {addr.line2 && `, ${addr.line2}`}
              <br />
              {addr.city}
              {addr.state && `, ${addr.state}`} {addr.postalCode}
              <br />
              {addr.country}
            </p>
          </div>
          <button
            onClick={() => handleDelete(addr.id)}
            className="text-fg-tertiary hover:text-functional-error transition-colors"
            aria-label="Delete address"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border-default p-4">
          <div className="space-y-2">
            <Label htmlFor="label">Label (optional)</Label>
            <Input id="label" name="label" placeholder="Home, Office…" error={errors.label} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" required error={errors.firstName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" required error={errors.lastName} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company (optional)</Label>
            <Input id="company" name="company" error={errors.company} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="line1">Address line 1</Label>
            <Input id="line1" name="line1" required error={errors.line1} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="line2">Address line 2 (optional)</Label>
            <Input id="line2" name="line2" error={errors.line2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" required error={errors.city} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State / Province</Label>
              <Input id="state" name="state" required error={errors.state} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal code</Label>
              <Input id="postalCode" name="postalCode" required error={errors.postalCode} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" required error={errors.country} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" name="phone" error={errors.phone} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isDefault" className="rounded" />
            Set as default
          </label>
          <div className="flex gap-2">
            <Button type="submit" variant="primary" size="sm" loading={isSubmitting}>
              Save address
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add address
        </Button>
      )}
    </div>
  );
}
