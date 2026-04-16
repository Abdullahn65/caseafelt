import { db } from "@/lib/db";

// ─────────────────────────────────────────────────────────────
// Customer Queries — Admin Customer Ops Panel
// ─────────────────────────────────────────────────────────────

/** Get customers list for admin */
export async function getCustomersForAdmin(options?: {
  search?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
  orderBy?: "spent" | "orders" | "recent";
}) {
  const { search, tag, page = 1, pageSize = 20, orderBy = "recent" } = options ?? {};

  const where: Record<string, unknown> = {
    role: "CUSTOMER",
    deletedAt: null,
  };

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }

  if (tag) {
    where.customerTags = {
      some: { tag },
    };
  }

  const customers = await db.user.findMany({
    where,
    include: {
      _count: { select: { orders: true } },
      customerTags: { select: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await db.user.count({ where });

  // For "total spent" and "last order" we need aggregation per customer.
  // Prisma doesn't support nested aggregation in findMany, so we compute
  // these separately for the current page of customers.
  const customerIds = customers.map((c) => c.id);

  const orderStats = await db.order.groupBy({
    by: ["userId"],
    where: {
      userId: { in: customerIds },
      status: { notIn: ["CANCELLED", "REFUNDED"] },
    },
    _sum: { total: true },
    _max: { createdAt: true },
    _count: { id: true },
  });

  const statsMap = new Map(
    orderStats.map((s) => [
      s.userId,
      {
        totalSpent: s._sum.total ?? 0,
        lastOrderAt: s._max.createdAt,
        orderCount: s._count.id,
      },
    ])
  );

  const enriched = customers.map((c) => ({
    ...c,
    stats: statsMap.get(c.id) ?? { totalSpent: 0, lastOrderAt: null, orderCount: 0 },
  }));

  // Sort by the requested field
  if (orderBy === "spent") {
    enriched.sort((a, b) => b.stats.totalSpent - a.stats.totalSpent);
  } else if (orderBy === "orders") {
    enriched.sort((a, b) => b.stats.orderCount - a.stats.orderCount);
  }
  // "recent" is already sorted by createdAt desc

  return {
    customers: enriched,
    total,
    totalPages: Math.ceil(total / pageSize),
    page,
  };
}

/** Get a single customer detail for admin */
export async function getCustomerForAdmin(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    include: {
      addresses: { orderBy: { isDefault: "desc" } },
      orders: {
        include: {
          items: {
            take: 1,
            select: { productName: true, imageUrl: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      supportTickets: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          subject: true,
          status: true,
          createdAt: true,
        },
      },
      customerNotes: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          body: true,
          createdBy: true,
          createdAt: true,
        },
      },
      customerTags: {
        select: { id: true, tag: true },
      },
    },
  });
}

// ─────────────────────────────────────────────────────────────
// Account Queries — for the logged-in customer
// ─────────────────────────────────────────────────────────────

/** Get user addresses */
export async function getAddressesByUserId(userId: string) {
  return db.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

// ─────────────────────────────────────────────────────────────
// Support Queries
// ─────────────────────────────────────────────────────────────

/** Get tickets for a customer */
export async function getTicketsByUserId(userId: string) {
  return db.supportTicket.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { messages: true } },
    },
  });
}

/** Get a single ticket with messages (customer view) */
export async function getTicketByIdForUser(ticketId: string, userId: string) {
  return db.supportTicket.findFirst({
    where: { id: ticketId, userId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
}

/** Get tickets for admin */
export async function getTicketsForAdmin(options?: {
  status?: string;
  priority?: string;
  page?: number;
  pageSize?: number;
}) {
  const { status, priority, page = 1, pageSize = 20 } = options ?? {};

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (priority) where.priority = priority;

  const [tickets, total] = await Promise.all([
    db.supportTicket.findMany({
      where,
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.supportTicket.count({ where }),
  ]);

  return {
    tickets,
    total,
    totalPages: Math.ceil(total / pageSize),
    page,
  };
}

/** Get a single ticket for admin (full detail) */
export async function getTicketForAdmin(ticketId: string) {
  return db.supportTicket.findUnique({
    where: { id: ticketId },
    include: {
      user: {
        select: { id: true, email: true, firstName: true, lastName: true },
      },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
}

/** Get contact submissions for admin */
export async function getContactSubmissionsForAdmin(options?: {
  isRead?: boolean;
  type?: string;
  page?: number;
  pageSize?: number;
}) {
  const { isRead, type, page = 1, pageSize = 20 } = options ?? {};

  const where: Record<string, unknown> = {};
  if (isRead !== undefined) where.isRead = isRead;
  if (type) where.type = type;

  const [submissions, total] = await Promise.all([
    db.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.contactSubmission.count({ where }),
  ]);

  return {
    submissions,
    total,
    totalPages: Math.ceil(total / pageSize),
    page,
  };
}

// ─────────────────────────────────────────────────────────────
// Admin — Products & Inventory
// ─────────────────────────────────────────────────────────────

/** Get products for admin list */
export async function getProductsForAdmin(options?: {
  status?: string;
  search?: string;
  collectionId?: string;
  page?: number;
  pageSize?: number;
}) {
  const { status, search, collectionId, page = 1, pageSize = 20 } = options ?? {};

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }
  if (collectionId) {
    where.collections = { some: { collectionId } };
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        _count: { select: { variants: true } },
        collections: {
          include: { collection: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.product.count({ where }),
  ]);

  return {
    products,
    total,
    totalPages: Math.ceil(total / pageSize),
    page,
  };
}

/** Get product for admin edit */
export async function getProductForAdmin(productId: string) {
  return db.product.findUnique({
    where: { id: productId },
    include: {
      images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
      variants: {
        include: {
          deviceModel: true,
          material: true,
          images: true,
        },
        orderBy: { createdAt: "asc" },
      },
      collections: {
        include: { collection: { select: { id: true, name: true } } },
      },
      materials: {
        include: { material: { select: { id: true, name: true } } },
      },
    },
  });
}

/** Get inventory view — all variants with stock info */
export async function getInventoryForAdmin(options?: {
  status?: "low" | "out" | "all";
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const { status = "all", search, page = 1, pageSize = 50 } = options ?? {};

  const where: Record<string, unknown> = {
    isActive: true,
    trackInventory: true,
  };

  if (status === "out") {
    where.inventoryCount = 0;
  } else if (status === "low") {
    where.inventoryCount = { gt: 0, lte: 5 }; // Default threshold
  }

  if (search) {
    where.OR = [
      { sku: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { product: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [variants, total] = await Promise.all([
    db.productVariant.findMany({
      where,
      include: {
        product: { select: { id: true, name: true, slug: true } },
        deviceModel: { select: { name: true } },
      },
      orderBy: { inventoryCount: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.productVariant.count({ where }),
  ]);

  return {
    variants,
    total,
    totalPages: Math.ceil(total / pageSize),
    page,
  };
}

// ─────────────────────────────────────────────────────────────
// Admin — Collections & Content
// ─────────────────────────────────────────────────────────────

/** Get all collections for admin */
export async function getCollectionsForAdmin() {
  return db.collection.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });
}

/** Get all content blocks for admin */
export async function getContentBlocksForAdmin() {
  return db.contentBlock.findMany({
    orderBy: { key: "asc" },
  });
}

/** Get a content block for admin edit */
export async function getContentBlockForAdmin(blockId: string) {
  return db.contentBlock.findUnique({
    where: { id: blockId },
  });
}

// ─────────────────────────────────────────────────────────────
// Newsletter
// ─────────────────────────────────────────────────────────────

/** Check if email is subscribed */
export async function isEmailSubscribed(email: string): Promise<boolean> {
  const subscriber = await db.newsletterSubscriber.findUnique({
    where: { email },
    select: { isActive: true },
  });
  return subscriber?.isActive ?? false;
}
