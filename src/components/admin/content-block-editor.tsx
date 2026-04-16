"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContentBlock {
  id: string;
  key: string;
  title: string | null;
  body: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  linkText: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

interface ContentBlockEditorProps {
  block: ContentBlock;
}

export function ContentBlockEditor({ block }: ContentBlockEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string || null,
      body: formData.get("body") as string || null,
      imageUrl: formData.get("imageUrl") as string || null,
      linkUrl: formData.get("linkUrl") as string || null,
      linkText: formData.get("linkText") as string || null,
      status: formData.get("status") as string || "DRAFT",
    };

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/content/${block.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          setMessage("Saved");
        } else {
          setMessage("Failed to save");
        }
      } catch {
        setMessage("Something went wrong");
      }
    });
  }

  return (
    <div className="rounded-lg border border-border-default">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div>
          <p className="text-sm font-medium">{block.key}</p>
          {block.title && (
            <p className="text-xs text-fg-tertiary mt-0.5">{block.title}</p>
          )}
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            block.status === "PUBLISHED"
              ? "bg-functional-success/10 text-functional-success"
              : block.status === "ARCHIVED"
                ? "bg-functional-error/10 text-functional-error"
                : "bg-bg-secondary text-fg-tertiary"
          }`}
        >
          {block.status.charAt(0) + block.status.slice(1).toLowerCase()}
        </span>
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="p-4 pt-0 space-y-4 border-t border-border-default">
          <div className="space-y-2">
            <Label htmlFor={`title-${block.id}`}>Title</Label>
            <Input
              id={`title-${block.id}`}
              name="title"
              defaultValue={block.title ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`body-${block.id}`}>Body</Label>
            <Textarea
              id={`body-${block.id}`}
              name="body"
              rows={4}
              defaultValue={block.body ?? ""}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`imageUrl-${block.id}`}>Image URL</Label>
              <Input
                id={`imageUrl-${block.id}`}
                name="imageUrl"
                defaultValue={block.imageUrl ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`linkUrl-${block.id}`}>Link URL</Label>
              <Input
                id={`linkUrl-${block.id}`}
                name="linkUrl"
                defaultValue={block.linkUrl ?? ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`linkText-${block.id}`}>Link Label</Label>
            <Input
              id={`linkText-${block.id}`}
              name="linkText"
              defaultValue={block.linkText ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`status-${block.id}`}>Status</Label>
            <select
              id={`status-${block.id}`}
              name="status"
              defaultValue={block.status}
              className="flex h-9 w-full rounded-md border border-border-default bg-bg-primary px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-olive/40"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" size="sm" loading={isPending}>
              Save changes
            </Button>
            {message && <span className="text-xs text-fg-secondary">{message}</span>}
          </div>
        </form>
      )}
    </div>
  );
}
