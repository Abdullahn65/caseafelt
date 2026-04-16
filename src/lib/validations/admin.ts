import { z } from "zod";

/**
 * Product create/edit — maps to Product model.
 * Used in admin product form.
 */
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200).regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase with hyphens only"
  ),
  shortDescription: z.string().max(160, "Keep under 160 characters for cards").optional().or(z.literal("")),
  description: z.string().min(1, "Description is required"),
  basePrice: z.number().int().min(1, "Price must be at least 1 cent"),
  compareAtPrice: z.number().int().min(1).optional().nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  seoTitle: z.string().max(70, "SEO title should be under 70 characters").optional().or(z.literal("")),
  seoDescription: z.string().max(160, "SEO description should be under 160 characters").optional().or(z.literal("")),
  collectionIds: z.array(z.string()).default([]),
  materialIds: z.array(z.string()).default([]),
});

export type ProductInput = z.infer<typeof productSchema>;

/**
 * Product variant create/edit — maps to ProductVariant model.
 */
export const productVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required").max(200),
  sku: z.string().min(1, "SKU is required").max(50),
  color: z.string().max(50).optional().or(z.literal("")),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color").optional().or(z.literal("")),
  deviceModelId: z.string().min(1, "Device model is required"),
  materialId: z.string().optional().nullable(),
  price: z.number().int().min(1).optional().nullable(),
  compareAtPrice: z.number().int().min(1).optional().nullable(),
  inventoryCount: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  trackInventory: z.boolean().default(true),
  weight: z.number().min(0).optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;

/**
 * Collection create/edit — maps to Collection model.
 */
export const collectionSchema = z.object({
  name: z.string().min(1, "Collection name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100).regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase with hyphens only"
  ),
  description: z.string().optional().or(z.literal("")),
  headline: z.string().max(200).optional().or(z.literal("")),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color").optional().or(z.literal("")),
  seoTitle: z.string().max(70).optional().or(z.literal("")),
  seoDescription: z.string().max(160).optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  sortOrder: z.number().int().default(0),
});

export type CollectionInput = z.infer<typeof collectionSchema>;

/**
 * Content block create/edit — maps to ContentBlock model.
 */
export const contentBlockSchema = z.object({
  key: z.string().min(1, "Key is required").max(100).regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Key must be lowercase with hyphens only"
  ),
  title: z.string().max(200).optional().or(z.literal("")),
  body: z.string().optional().or(z.literal("")),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkText: z.string().max(100).optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export type ContentBlockInput = z.infer<typeof contentBlockSchema>;

/**
 * Order status update — admin action.
 */
export const orderStatusUpdateSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURN_REQUESTED",
    "RETURN_APPROVED",
    "RETURN_DENIED",
    "REFUNDED",
  ]),
  trackingNumber: z.string().max(100).optional().or(z.literal("")),
  trackingUrl: z.string().url().optional().or(z.literal("")),
});

export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;

/**
 * Inventory update — inline edit in admin inventory view.
 */
export const inventoryUpdateSchema = z.object({
  variantId: z.string().min(1),
  inventoryCount: z.number().int().min(0, "Stock cannot be negative"),
});

export type InventoryUpdateInput = z.infer<typeof inventoryUpdateSchema>;

/**
 * Customer note — admin writes a note about a customer.
 */
export const customerNoteSchema = z.object({
  body: z.string().min(1, "Note cannot be empty").max(2000),
});

export type CustomerNoteInput = z.infer<typeof customerNoteSchema>;

/**
 * Customer tag — admin adds a tag to a customer.
 */
export const customerTagSchema = z.object({
  tag: z
    .string()
    .min(1, "Tag is required")
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Tag must be lowercase with hyphens"),
});

export type CustomerTagInput = z.infer<typeof customerTagSchema>;
