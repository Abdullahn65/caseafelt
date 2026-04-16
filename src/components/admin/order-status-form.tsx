"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

const statuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

interface OrderStatusFormProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusForm({ orderId, currentStatus }: OrderStatusFormProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === currentStatus) return;

    setMessage(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        if (res.ok) {
          setMessage("Status updated");
        } else {
          const data = await res.json();
          setMessage(data.error ?? "Failed to update");
        }
      } catch {
        setMessage("Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="flex h-9 w-full rounded-md border border-border-default bg-bg-primary px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-olive/40"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
      <Button
        type="submit"
        variant="primary"
        size="sm"
        loading={isPending}
        disabled={status === currentStatus}
      >
        Update status
      </Button>
      {message && (
        <p className="text-xs text-fg-secondary">{message}</p>
      )}
    </form>
  );
}
