"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";

const contactTypes = [
  { value: "ORDER", label: "Order inquiry" },
  { value: "PRODUCT", label: "Product question" },
  { value: "RETURN", label: "Return / exchange" },
  { value: "GENERAL", label: "General question" },
  { value: "WHOLESALE", label: "Wholesale" },
  { value: "PRESS", label: "Press" },
] as const;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);

    const formData = new FormData(e.currentTarget);
    const data: ContactInput = {
      type: formData.get("type") as ContactInput["type"],
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    const result = contactSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) {
        const body = await res.json();
        setGlobalError(body.error ?? "Failed to send message");
        return;
      }
      setSuccess(true);
    } catch {
      setGlobalError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border border-border-default p-8 text-center">
        <h3 className="text-lg font-semibold">Message sent</h3>
        <p className="mt-2 text-fg-secondary">
          Thank you for reaching out. We&apos;ll get back to you within 24
          hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {globalError && (
        <p className="text-sm text-functional-error">{globalError}</p>
      )}

      <div className="space-y-2">
        <Label htmlFor="type">Inquiry type</Label>
        <select
          id="type"
          name="type"
          required
          className="flex h-11 w-full rounded-md border border-border-default bg-bg-primary px-3 text-sm ring-offset-bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-olive/40 focus-visible:border-accent-olive"
        >
          <option value="">Select a type…</option>
          {contactTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="text-sm text-functional-error">{errors.type}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Your name"
            error={errors.name}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            error={errors.email}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          required
          placeholder="What's this about?"
          error={errors.subject}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell us more…"
          error={errors.message}
        />
      </div>

      <Button type="submit" variant="primary" loading={isSubmitting}>
        Send message
      </Button>
    </form>
  );
}
