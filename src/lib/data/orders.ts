import { db } from "@/lib/db";

// ─────────────────────────────────────────────────────────────
// Orders — Customer Queries
// ─────────────────────────────────────────────────────────────

/** Get all orders for a user */
export async function getOrdersByUserId(userId: string) {
  return db.order.findMany({
    where: { userId },
    include: {
      items: {
        take: 1, // Just first item for preview thumbnail
        select: {
          productName: true,
          variantName: true,
          imageUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/** Get a single order by ID (for customer view) */
export async function getOrderByIdForUser(orderId: string, userId: string) {
  return db.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: true,
      payment: {
        select: {
          cardBrand: true,
          cardLast4: true,
          status: true,
          paidAt: true,
        },
      },
      refunds: {
        select: {
          amount: true,
          reason: true,
          processedAt: true,
        },
      },
    },
  });
}

// ─────────────────────────────────────────────────────────────
// Orders — Admin Queries
// ─────────────────────────────────────────────────────────────

/** Get orders for admin list view with filters */
export async function getOrdersForAdmin(options?: {
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const { status, search, page = 1, pageSize = 20 } = options ?? {};

  const where: Record<string, unknown> = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.order.count({ where }),
  ]);

  return {
    orders,
    total,
    totalPages: Math.ceil(total / pageSize),
    page,
  };
}

/** Get a single order for admin view (full detail) */
export async function getOrderForAdmin(orderId: string) {
  return db.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      payment: true,
      refunds: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      discountCode: {
        select: { code: true, type: true, value: true },
      },
    },
  });
}

// ─────────────────────────────────────────────────────────────
// Dashboard Metrics
// ─────────────────────────────────────────────────────────────

/** Get today's order stats for admin dashboard */
export async function getDashboardMetrics() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    todaysOrders,
    todaysRevenue,
    pendingOrders,
    lowStockVariants,
    openTickets,
    unreadContacts,
    pendingReviews,
  ] = await Promise.all([
    db.order.count({
      where: { createdAt: { gte: todayStart } },
    }),
    db.order.aggregate({
      where: { createdAt: { gte: todayStart }, status: { not: "CANCELLED" } },
      _sum: { total: true },
    }),
    db.order.count({
      where: { status: "CONFIRMED" },
    }),
    db.productVariant.count({
      where: {
        trackInventory: true,
        isActive: true,
        // Raw SQL would be better here, but Prisma doesn't support
        // column-to-column comparison in where. We'll filter in JS.
      },
    }),
    db.supportTicket.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    db.contactSubmission.count({
      where: { isRead: false },
    }),
    db.review.count({
      where: { isApproved: false },
    }),
  ]);

  // For low stock, we need to check inventoryCount <= lowStockThreshold
  // Prisma can't do column comparison, so query and filter
  const lowStockCount = await db.productVariant.count({
    where: {
      trackInventory: true,
      isActive: true,
      inventoryCount: { lte: 5 }, // Use default threshold as approximation
    },
  });

  return {
    todaysOrders,
    todaysRevenue: todaysRevenue._sum.total ?? 0,
    pendingOrders,
    lowStockCount,
    openTickets,
    unreadContacts,
    pendingReviews,
  };
}

/** Get recent orders for dashboard (last 10) */
export async function getRecentOrders(limit = 10) {
  return db.order.findMany({
    include: {
      user: { select: { email: true, firstName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
