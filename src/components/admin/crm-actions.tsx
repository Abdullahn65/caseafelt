"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddNoteForm({ userId }: { userId: string }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    await fetch("/api/admin/crm/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, body }),
    });
    setBody("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a note about this customer..."
        className="flex-1 rounded-md border border-border-default bg-bg-primary px-3 py-1.5 text-sm"
      />
      <button
        type="submit"
        disabled={loading || !body.trim()}
        className="rounded-md bg-fg-primary text-bg-primary px-3 py-1.5 text-sm disabled:opacity-50"
      >
        {loading ? "..." : "Add Note"}
      </button>
    </form>
  );
}

export function AddTagForm({ userId }: { userId: string }) {
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tag.trim()) return;
    setLoading(true);
    await fetch("/api/admin/crm/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, tag }),
    });
    setTag("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Add tag (e.g. vip, wholesale)..."
        className="rounded-md border border-border-default bg-bg-primary px-3 py-1.5 text-sm w-48"
      />
      <button
        type="submit"
        disabled={loading || !tag.trim()}
        className="rounded-md bg-fg-primary text-bg-primary px-3 py-1.5 text-sm disabled:opacity-50"
      >
        +
      </button>
    </form>
  );
}

export function RemoveTagButton({ userId, tag }: { userId: string; tag: string }) {
  const router = useRouter();

  async function handleRemove() {
    await fetch("/api/admin/crm/tags", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, tag }),
    });
    router.refresh();
  }

  return (
    <button
      onClick={handleRemove}
      className="text-xs bg-bg-secondary px-2 py-0.5 rounded-full group hover:bg-red-100 transition-colors"
    >
      {tag} <span className="text-fg-tertiary group-hover:text-red-500">×</span>
    </button>
  );
}

export function RoleChanger({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true);
    const res = await fetch("/api/admin/crm/role", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: e.target.value }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to change role");
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      value={currentRole}
      onChange={handleChange}
      disabled={loading}
      className="rounded-md border border-border-default bg-bg-primary px-2 py-1 text-sm"
    >
      <option value="CUSTOMER">CUSTOMER</option>
      <option value="ADMIN">ADMIN</option>
      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
    </select>
  );
}
