import { z } from "zod";

/**
 * Support ticket creation — maps to SupportTicket + initial TicketMessage.
 */
export const createTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  orderId: z.string().optional().or(z.literal("")),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

/**
 * Ticket reply — adds a TicketMessage to an existing ticket.
 */
export const ticketReplySchema = z.object({
  ticketId: z.string().min(1),
  message: z.string().min(1, "Reply cannot be empty").max(5000),
});

export type TicketReplyInput = z.infer<typeof ticketReplySchema>;

/**
 * Admin ticket status/priority update.
 */
export const ticketUpdateSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "AWAITING_CUSTOMER", "RESOLVED", "CLOSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assignedTo: z.string().optional().nullable(),
});

export type TicketUpdateInput = z.infer<typeof ticketUpdateSchema>;
