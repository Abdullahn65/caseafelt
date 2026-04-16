import { z } from "zod";

/**
 * Contact form — maps to ContactSubmission model.
 * ContactType enum: GENERAL, SUPPORT, CUSTOM_INQUIRY, PRESS, WHOLESALE
 */
export const contactSchema = z.object({
  type: z.enum(["GENERAL", "SUPPORT", "CUSTOM_INQUIRY", "PRESS", "WHOLESALE"], {
    required_error: "Please select an inquiry type",
  }),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .max(20, "Phone must be under 20 characters")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must be under 200 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be under 5000 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;
