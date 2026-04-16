import { z } from "zod";

/**
 * Cart operations — add item, update quantity.
 */
export const addToCartSchema = z.object({
  variantId: z.string().min(1, "Variant is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(10, "Maximum 10 per item"),
});

export const updateCartItemSchema = z.object({
  cartItemId: z.string().min(1, "Cart item is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(10, "Maximum 10 per item"),
});

export const removeCartItemSchema = z.object({
  cartItemId: z.string().min(1, "Cart item is required"),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>;
