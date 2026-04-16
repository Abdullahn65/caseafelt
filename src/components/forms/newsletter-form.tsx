"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { newsletterSchema } from "@/lib/validations/newsletter";

/**
 * NewsletterForm — Phase 3 spec.
 * Email input + submit button. Inline success/error messaging.
 */

interface NewsletterFormProps {
  source?: string;
  className?: string;
}

function NewsletterForm({ source = "footer", className }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = newsletterSchema.safeParse({ email, source });
    if (!result.success) {
      setStatus("error");
      setMessage(result.error.errors[0]?.message ?? "Invalid email");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("You're in. Welcome to CaseaFelt.");
        setEmail("");
      } else {
        const data = await res.json();
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className={cn("text-center", className)}>
        <p className="text-sm text-success font-medium">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex gap-3", className)}>
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={status === "error" ? message : undefined}
        disabled={status === "loading"}
        required
        aria-label="Email for newsletter"
      />
      <Button
        type="submit"
        variant="primary"
        loading={status === "loading"}
        className="shrink-0"
      >
        Subscribe
      </Button>
    </form>
  );
}

export { NewsletterForm };
export type { NewsletterFormProps };
