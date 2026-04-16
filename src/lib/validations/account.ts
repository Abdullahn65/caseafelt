import { z } from "zod";

/**
 * Address CRUD — maps to Address model.
 */
export const addressSchema = z.object({
  label: z.string().max(50).optional().or(z.literal("")),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  company: z.string().max(100).optional().or(z.literal("")),
  line1: z.string().min(1, "Address line 1 is required").max(200),
  line2: z.string().max(200).optional().or(z.literal("")),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  postalCode: z.string().min(1, "Postal code is required").max(20),
  country: z.string().min(1, "Country is required").max(2).default("US"),
  phone: z.string().max(20).optional().or(z.literal("")),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;

/**
 * User settings update — partial profile fields.
 */
export const userSettingsSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().max(20).optional().or(z.literal("")),
  marketingOptIn: z.boolean().optional(),
});

export type UserSettingsInput = z.infer<typeof userSettingsSchema>;
