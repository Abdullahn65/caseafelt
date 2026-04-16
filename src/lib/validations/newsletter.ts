import { z } from "zod";

/**
 * Newsletter signup — maps to NewsletterSubscriber model.
 */
export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  source: z
    .string()
    .optional()
    .default("footer"),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
