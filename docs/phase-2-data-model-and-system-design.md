# Phase 2: Data Model and System Design

## CaseaFelt — Database Architecture

**Document version:** 1.0  
**Date:** April 14, 2026  
**Status:** Complete — Ready for Phase 3  
**Schema file:** `prisma/schema.prisma`

---

## Table of Contents

1. [Schema Overview](#1-schema-overview)
2. [Entity Relationship Map](#2-entity-relationship-map)
3. [Table Inventory](#3-table-inventory)
4. [Enum Reference](#4-enum-reference)
5. [Key Design Decisions and Tradeoffs](#5-key-design-decisions-and-tradeoffs)
6. [Data Flow Diagrams](#6-data-flow-diagrams)
7. [Indexing Strategy](#7-indexing-strategy)
8. [Seed Data Strategy](#8-seed-data-strategy)
9. [Migration Strategy](#9-migration-strategy)
10. [What Is Intentionally Deferred from the Schema at Launch](#10-what-is-intentionally-deferred-from-the-schema-at-launch)

---

## 1. Schema Overview

The schema contains **27 models** organized into 10 domains:

| Domain | Models | Purpose |
|---|---|---|
| **Users & Auth** | User, Address | Customer and admin accounts, synced from Clerk |
| **Catalog** | Product, ProductVariant, DeviceModel, Material, ProductMaterial | Product data, device compatibility, materials |
| **Collections** | Collection, CollectionProduct | Aesthetic groupings of products |
| **Media** | ProductImage, VariantImage | Image assets for products and variants |
| **Cart** | Cart, CartItem | Shopping carts (guest + authenticated) |
| **Orders** | Order, OrderItem, Payment, Refund | Transactions, line items, payments |
| **Discounts** | DiscountCode | Promotional codes |
| **Reviews** | Review | Customer product reviews (moderated) |
| **Wishlist** | WishlistItem | Saved products |
| **Support** | SupportTicket, TicketMessage, ContactSubmission | Customer support and inquiries |
| **Newsletter** | NewsletterSubscriber | Email capture and subscription management |
| **Customer Ops** | CustomerNote, CustomerTag | Internal admin notes and tags on customers |
| **Audit** | AuditLog | Immutable log of admin actions |
| **Content** | ContentBlock | Lightweight CMS content blocks |
| **Email** | EmailEvent | Transactional email tracking |

### Model count by launch tier

| Tier | Models included | Count |
|---|---|---|
| **Tier 0 (launch-critical)** | User, Address, Product, ProductVariant, DeviceModel, Material, ProductMaterial, Collection, CollectionProduct, ProductImage, VariantImage, Cart, CartItem, Order, OrderItem, Payment, ContentBlock, NewsletterSubscriber, ContactSubmission, AuditLog, EmailEvent | 21 |
| **Tier 1 (month 1–2)** | SupportTicket, TicketMessage, CustomerNote, CustomerTag, Review, WishlistItem, DiscountCode, Refund | 8 |

All 27 models are defined in the schema from day one. Tier 1 tables simply won't have application code writing to them until those features are built. Empty tables cost nothing in Postgres.

---

## 2. Entity Relationship Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER DOMAIN                                 │
│                                                                     │
│  User ─┬─< Address                                                  │
│        ├─< Order                                                    │
│        ├── Cart (1:1)                                               │
│        ├─< Review                                                   │
│        ├─< WishlistItem                                             │
│        ├─< SupportTicket                                            │
│        ├─< CustomerNote                                             │
│        └─< CustomerTag                                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        CATALOG DOMAIN                               │
│                                                                     │
│  Product ─┬─< ProductVariant ──> DeviceModel                        │
│           │         └──> Material (optional)                        │
│           ├─<> Collection  (via CollectionProduct)                   │
│           ├─<> Material    (via ProductMaterial)                     │
│           ├─< ProductImage                                          │
│           └─< Review                                                │
│                                                                     │
│  ProductVariant ─┬─< VariantImage                                   │
│                  ├─< CartItem                                       │
│                  ├─< OrderItem                                      │
│                  └─< WishlistItem                                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        ORDER DOMAIN                                 │
│                                                                     │
│  Order ─┬─< OrderItem                                               │
│         ├── Payment (1:1)                                           │
│         ├─< Refund                                                  │
│         └──> DiscountCode (optional)                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       SUPPORT DOMAIN                                │
│                                                                     │
│  SupportTicket ─< TicketMessage                                     │
│  ContactSubmission (standalone)                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     INDEPENDENT TABLES                               │
│                                                                     │
│  AuditLog          (append-only, no FK to entities)                 │
│  EmailEvent        (append-only, weak entity references)            │
│  ContentBlock      (key-value content blocks)                       │
│  NewsletterSubscriber (standalone)                                  │
└─────────────────────────────────────────────────────────────────────┘

Legend:
  ──>  = belongs to (FK)
  ─<   = has many
  ─<>  = many-to-many (via join table)
  ──   = has one (1:1)
```

---

## 3. Table Inventory

### Users & Auth

| Table | Columns | Purpose | Key relationships |
|---|---|---|---|
| **User** | id, clerkId, email, firstName, lastName, phone, avatarUrl, role, emailVerified, marketingOptIn, createdAt, updatedAt, deletedAt | All customers and admins | Has many: addresses, orders, reviews, wishlist items, tickets, notes, tags. Has one: cart |
| **Address** | id, userId, label, firstName, lastName, company, line1, line2, city, state, postalCode, country, phone, isDefault, createdAt, updatedAt | Saved shipping/billing addresses | Belongs to: User |

### Catalog

| Table | Columns | Purpose | Key relationships |
|---|---|---|---|
| **Product** | id, name, slug, shortDescription, description, basePrice, compareAtPrice, status, featured, sortOrder, seoTitle, seoDescription, createdAt, updatedAt | Core product record | Has many: variants, images, reviews. Many-to-many: collections, materials |
| **ProductVariant** | id, productId, name, sku, color, colorHex, deviceModelId, materialId, price, compareAtPrice, inventoryCount, lowStockThreshold, trackInventory, weight, isActive, createdAt, updatedAt | Purchasable unit (device + color/material) | Belongs to: Product, DeviceModel. Optional: Material. Has many: images, cart items, order items, wishlist items |
| **DeviceModel** | id, brand, name, slug, family, isActive, sortOrder, createdAt, updatedAt | Phone models for compatibility | Has many: variants |
| **Material** | id, name, slug, description, careInstructions, createdAt, updatedAt | Material types with brand narrative | Many-to-many: products. Has many: variants |
| **ProductMaterial** | productId, materialId | Join table: product ↔ material | Composite PK |

### Collections

| Table | Columns | Purpose | Key relationships |
|---|---|---|---|
| **Collection** | id, name, slug, description, headline, imageUrl, accentColor, seoTitle, seoDescription, status, sortOrder, createdAt, updatedAt | Aesthetic product groupings | Many-to-many: products |
| **CollectionProduct** | collectionId, productId, sortOrder | Join table with sort order | Composite PK |

### Media

| Table | Columns | Purpose | Key relationships |
|---|---|---|---|
| **ProductImage** | id, productId, url, publicId, altText, sortOrder, isPrimary, createdAt | Product gallery images | Belongs to: Product |
| **VariantImage** | id, variantId, url, publicId, altText, sortOrder, isPrimary, createdAt | Variant-specific images | Belongs to: ProductVariant |

### Cart

| Table | Columns | Purpose | Key relationships |
|---|---|---|---|
| **Cart** | id, userId, sessionId, lastActivityAt, isAbandoned, abandonedEmailSentAt, createdAt, updatedAt | Shopping cart (guest or authenticated) | Belongs to: User (optional). Has many: items |
| **CartItem** | id, cartId, variantId, quantity, addedAt | Line item in a cart | Belongs to: Cart, ProductVariant. Unique on [cartId, variantId] |

### Orders

| Table | Columns | Purpose | Key relationships |
|---|---|---|---|
| **Order** | id, orderNumber, userId, email, status, subtotal, discount, shipping, tax, total, shippingAddress (JSON), billingAddress (JSON), shippingMethod, trackingNumber, trackingUrl, shippedAt, deliveredAt, discountCodeId, stripeSessionId, stripePaymentIntentId, customerNote, createdAt, updatedAt | The purchase transaction | Belongs to: User (optional), DiscountCode (optional). Has many: items, refunds. Has one: payment |
| **OrderItem** | id, orderId, variantId, productName, variantName, sku, deviceModel, unitPrice, quantity, totalPrice, imageUrl, createdAt | Snapshot of purchased item | Belongs to: Order. Weak ref to variant |
| **Payment** | id, orderId, stripePaymentIntentId, stripeChargeId, amount, currency, status, cardBrand, cardLast4, paidAt, createdAt, updatedAt | Stripe payment record | 1:1 with Order |
| **Refund** | id, orderId, stripeRefundId, amount, reason, notes, processedAt, processedBy, createdAt | Refund against an order | Belongs to: Order |

### Discounts

| Table | Columns | Purpose | Key relationships |
|---|---|---|---|
| **DiscountCode** | id, code, type, value, minOrderAmount, maxUses, maxUsesPerUser, currentUses, expiresAt, isActive, createdAt, updatedAt | Promotional discount codes | Has many: orders |

### Reviews & Wishlist

| Table | Columns | Purpose | Key relationships |
|---|---|---|---|
| **Review** | id, productId, userId, rating, title, body, isVerifiedPurchase, orderId, isApproved, approvedAt, approvedBy, authorName, createdAt, updatedAt | Moderated product reviews | Belongs to: Product, User (optional) |
| **WishlistItem** | id, userId, variantId, createdAt | Saved/favorited variants | Belongs to: User, ProductVariant |

### Support

| Table | Columns | Purpose | Key relationships |
|---|---|---|---|
| **SupportTicket** | id, userId, email, subject, status, priority, orderId, assignedTo, closedAt, resolvedAt, createdAt, updatedAt | Customer support tickets | Belongs to: User (optional). Has many: messages |
| **TicketMessage** | id, ticketId, body, isAdmin, authorId, createdAt | Message in a ticket thread | Belongs to: SupportTicket |
| **ContactSubmission** | id, type, name, email, phone, subject, message, isRead, readAt, readBy, notes, convertedToTicketId, createdAt | Contact form submissions | Standalone (no FK to tickets by design) |

### Newsletter

| Table | Columns | Purpose | Key relationships |
|---|---|---|---|
| **NewsletterSubscriber** | id, email, source, isActive, subscribedAt, unsubscribedAt | Email list management | Standalone |

### Customer Ops (Internal)

| Table | Columns | Purpose | Key relationships |
|---|---|---|---|
| **CustomerNote** | id, userId, body, createdBy, createdAt, updatedAt | Internal admin notes on customers | Belongs to: User |
| **CustomerTag** | id, userId, tag, createdAt | Lightweight customer segmentation | Belongs to: User. Unique on [userId, tag] |

### System

| Table | Columns | Purpose | Key relationships |
|---|---|---|---|
| **AuditLog** | id, action, entityType, entityId, userId, metadata (JSON), ipAddress, userAgent, createdAt | Immutable admin action log | No FKs (by design) |
| **ContentBlock** | id, key, title, body, imageUrl, linkUrl, linkText, status, createdAt, updatedAt | CMS content blocks | Standalone |
| **EmailEvent** | id, to, subject, template, resendId, status, errorMessage, entityType, entityId, sentAt, deliveredAt, bouncedAt | Transactional email tracking | Weak entity references |

---

## 4. Enum Reference

| Enum | Values | Used by |
|---|---|---|
| **UserRole** | CUSTOMER, ADMIN, SUPER_ADMIN | User.role |
| **ProductStatus** | DRAFT, ACTIVE, ARCHIVED | Product.status |
| **OrderStatus** | PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURN_REQUESTED, RETURN_APPROVED, RETURN_DENIED, REFUNDED | Order.status |
| **PaymentStatus** | PENDING, SUCCEEDED, FAILED, REFUNDED, PARTIALLY_REFUNDED | Payment.status |
| **TicketStatus** | OPEN, IN_PROGRESS, AWAITING_CUSTOMER, RESOLVED, CLOSED | SupportTicket.status |
| **TicketPriority** | LOW, MEDIUM, HIGH, URGENT | SupportTicket.priority |
| **ContactType** | GENERAL, SUPPORT, CUSTOM_INQUIRY, PRESS, WHOLESALE | ContactSubmission.type |
| **DiscountType** | PERCENTAGE, FIXED_AMOUNT | DiscountCode.type |
| **ContentStatus** | DRAFT, PUBLISHED, ARCHIVED | Collection.status, ContentBlock.status |
| **AuditAction** | CREATE, UPDATE, DELETE, STATUS_CHANGE, LOGIN, LOGOUT, EXPORT, REFUND, PERMISSION_CHANGE | AuditLog.action |

### Valid State Transitions

**OrderStatus:**
```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
                                          └→ RETURN_REQUESTED → RETURN_APPROVED → REFUNDED
                                                             └→ RETURN_DENIED
PENDING → CANCELLED (before shipment only)
```

**TicketStatus:**
```
OPEN → IN_PROGRESS → AWAITING_CUSTOMER → RESOLVED → CLOSED
                  └→ RESOLVED (direct)
AWAITING_CUSTOMER → OPEN (customer replies, reopens)
RESOLVED → OPEN (customer reopens)
```

**PaymentStatus:**
```
PENDING → SUCCEEDED → REFUNDED
                   └→ PARTIALLY_REFUNDED → REFUNDED
PENDING → FAILED
```

State transition enforcement happens in **application logic** (service layer), not in the database. Prisma/Postgres enums constrain the valid values; the app constrains the valid transitions.

---

## 5. Key Design Decisions and Tradeoffs

### Decision 1: Cents for all monetary values (Int, not Decimal/Float)

**Chosen:** Store all money as `Int` in cents (e.g., $45.00 = 4500).

**Why:**
- Floating point arithmetic is famously unreliable for money (`0.1 + 0.2 ≠ 0.3`)
- Prisma's `Decimal` type adds complexity (serialization, JSON handling)
- Stripe uses cents natively — no conversion needed
- Display formatting ($45.00) happens in the UI layer only

**Tradeoff:** Requires dividing by 100 in every display context. Accepted — this is a universal e-commerce pattern.

### Decision 2: JSON for order addresses (not FK)

**Chosen:** `Order.shippingAddress` and `Order.billingAddress` are `Json` fields, not foreign keys to the `Address` table.

**Why:**
- A customer may update or delete their address after placing an order
- The order must always reflect the address it was shipped to
- This is the standard e-commerce pattern (Shopify, Stripe, Amazon all do this)

**Tradeoff:** Cannot query orders by address fields efficiently. Not a real concern — you rarely need to "find all orders shipped to ZIP 10001."

**Alternative considered:** Address versioning (keep all versions, never update). Rejected — adds complexity with no practical benefit for a phone case brand.

### Decision 3: Separate image tables (not polymorphic)

**Chosen:** `ProductImage` and `VariantImage` are separate tables.

**Why:**
- Prisma doesn't support polymorphic relations
- Type-safe queries are more valuable than DRY tables
- Product images and variant images have different usage patterns (gallery vs. swatch)

**Alternative considered:** Single `Image` table with `entityType` + `entityId` string fields. Rejected — loses type safety and FK constraints.

### Decision 4: Variant-level inventory (not separate Inventory table)

**Chosen:** `inventoryCount` lives directly on `ProductVariant`.

**Why:**
- At launch, inventory is a simple counter per variant
- No warehouse locations, no batch tracking, no serial numbers
- A separate `Inventory` table adds a join to every product query with zero benefit

**Tradeoff:** Cannot track inventory movements (history of stock changes). Accepted — inventory movement history is a Tier 2 feature. When needed, add an `InventoryMovement` audit table.

**When to change:** If the business adds multiple warehouses or needs inventory movement tracking (e.g., "who adjusted stock and why?"), extract inventory into its own table.

### Decision 5: Flat AuditLog (no FKs)

**Chosen:** `AuditLog.entityType` and `AuditLog.entityId` are strings, not foreign keys.

**Why:**
- Audit logs must survive entity deletion (if a product is deleted, its audit trail must remain)
- Foreign keys would either prevent deletion or cascade-delete the audit trail
- The log is append-only and queried by time range, not by relationship traversal

**Tradeoff:** Cannot join AuditLog to entities in a single query. Accepted — audit log queries are admin-only and tolerate slightly more complex lookups.

### Decision 6: Cart in DB (not cookie-only)

**Chosen:** Carts are always stored in the database, even for guests (identified by `sessionId` cookie).

**Why:**
- Enables abandoned cart tracking (a conversion lever)
- Admin can see cart state in customer ops panel
- Cart items have FK constraints to real variants (prevents invalid carts)
- Persists across devices for logged-in users

**Tradeoff:** Every add-to-cart is a DB write. At this scale (<10k carts), this is negligible.

### Decision 7: Order number format

**Chosen:** `orderNumber` is a human-readable string like `CF-20260414-0001`.

**Why:**
- Customers and support need a reference that isn't a CUID
- Format: `CF-{YYYYMMDD}-{sequential_number}`
- Generated in application logic (not auto-increment — auto-increment leaks volume data)

**Implementation note:** Use a sequence or counter in the application layer, not Postgres sequences, to maintain the formatted pattern.

### Decision 8: Soft deletes for Users only

**Chosen:** Only `User` has `deletedAt` (soft delete). All other entities use hard deletes or status-based archiving.

**Why:**
- Users with orders cannot be hard-deleted (referential integrity + legal/accounting)
- Products use `status: ARCHIVED` instead of deletion
- Collections use `status: ARCHIVED`
- Order data is never deleted (legal/accounting requirement)
- Cart items, wishlist items, etc. can be hard-deleted safely

**Tradeoff:** Must remember to filter `deletedAt IS NULL` on user queries. Prisma middleware can handle this automatically.

### Decision 9: ReviewAR (reviews on product, not variant)

**Chosen:** Reviews belong to `Product`, not `ProductVariant`.

**Why:**
- Customers review the product design/quality, not a specific device model
- Aggregating reviews per product gives better social proof (more reviews per page)
- "This felt case is amazing" applies regardless of whether it's iPhone 16 or iPhone 16 Pro

**Tradeoff:** Can't see variant-specific feedback (e.g., "the iPhone 16 Pro Max version fits loose"). Accepted — this level of granularity is unnecessary at launch. If variant-specific quality issues emerge, the support ticket system captures them.

---

## 6. Data Flow Diagrams

### Checkout Flow (Data Perspective)

```
1. Customer clicks "Checkout"
   └→ App reads Cart + CartItems from DB
   └→ App validates: all variants active, in stock, prices correct
   └→ App creates Stripe Checkout Session (with line items, shipping options)
   └→ App stores stripeSessionId on a PENDING Order record
   └→ Redirect customer to Stripe

2. Customer pays on Stripe
   └→ Stripe fires webhook: checkout.session.completed
   └→ Webhook handler (idempotent):
       a. Look up Order by stripeSessionId
       b. Update Order.status → CONFIRMED
       c. Create Payment record
       d. Create OrderItems (snapshot from CartItems)
       e. Decrement ProductVariant.inventoryCount for each item
       f. Delete Cart and CartItems
       g. Send confirmation email via Resend
       h. Create EmailEvent record
       i. Create AuditLog entry
       j. Fire PostHog "purchase" event

3. Customer sees /order/[orderNumber]/confirmation
   └→ App reads Order + OrderItems from DB
```

### Guest Cart → Account Merge Flow

```
1. Guest browses, adds items to cart (identified by sessionId cookie)
   └→ Cart record: userId=null, sessionId="abc123"

2. Guest creates account or logs in
   └→ Clerk webhook creates/finds User record in our DB
   └→ App checks: does a Cart with this sessionId exist?
   └→ App checks: does the User already have a Cart?
   
   If user has no cart:
     └→ Update guest cart: set userId, clear sessionId
   
   If user has existing cart:
     └→ Merge items: add guest cart items to user cart (sum quantities for duplicates)
     └→ Delete guest cart
```

### Review Submission Flow

```
1. Customer goes to /products/[slug], clicks "Write a Review"
   └→ Must be logged in (Clerk)
   └→ App checks: does this user have a delivered order with this product?
   └→ If yes: isVerifiedPurchase = true

2. Customer submits review (rating, title, body)
   └→ Review created with isApproved = false
   └→ Email notification sent to admin

3. Admin reviews in /admin → approves or rejects
   └→ Review.isApproved = true, approvedAt, approvedBy set
   └→ AuditLog entry created
   └→ Review now visible on product page
```

---

## 7. Indexing Strategy

### Primary indexes (all defined in schema)

Every foreign key has an index. Additionally:

| Table | Index | Reasoning |
|---|---|---|
| User | `clerkId` (unique) | Auth lookup on every request |
| User | `email` (unique) | Login, order lookup, newsletter dedup |
| User | `role` | Admin queries filtering by role |
| Product | `slug` (unique) | URL routing: /products/[slug] |
| Product | `status` | Storefront queries: only show ACTIVE |
| ProductVariant | `sku` (unique) | Order processing, inventory lookup |
| Collection | `slug` (unique) | URL routing: /collections/[slug] |
| Order | `orderNumber` (unique) | Customer support lookup |
| Order | `email` | Guest order lookup |
| Order | `status` | Admin filtering by status |
| Order | `createdAt` | Date-range queries (dashboard, reports) |
| Cart | `isAbandoned` | Abandoned cart queries |
| Cart | `lastActivityAt` | Abandoned cart detection (find carts with no activity > 1hr) |
| AuditLog | `createdAt` | Time-range queries |
| AuditLog | `[entityType, entityId]` | Find all actions on a specific entity |

### Indexes NOT added (and why)

| Potential index | Why deferred |
|---|---|
| Full-text search on Product.name/description | Use Postgres `tsvector` or external search (Algolia) when catalog exceeds 100 products |
| Composite index on Order (userId + status) | Query planner can combine individual indexes at this scale |
| Index on Review.rating | Aggregations are infrequent and tolerate a full scan on <10k reviews |

---

## 8. Seed Data Strategy

A seed script (`prisma/seed.ts`) will be created in Phase 4. It will populate:

### Required seed data (for a functional dev environment)

```
DeviceModels:
  - iPhone 16, iPhone 16 Plus, iPhone 16 Pro, iPhone 16 Pro Max
  - iPhone 15, iPhone 15 Plus, iPhone 15 Pro, iPhone 15 Pro Max
  - Samsung Galaxy S25, S25+, S25 Ultra
  - Google Pixel 9, Pixel 9 Pro

Materials:
  - Merino Felt, Pressed Wool, Cork Blend, Waxed Canvas, Recycled Felt

Collections:
  - Field, Studio, Soft Form, Earth, Structure

Products (3–5 per collection, each with variants per device):
  - Example: "Alpine" in Earth collection
    - Variants: Alpine — iPhone 16 Pro — Moss, Alpine — iPhone 16 Pro — Sand, etc.

ContentBlocks:
  - homepage-hero, announcement-bar, about-intro, shipping-banner

Admin user:
  - SUPER_ADMIN role, linked to a Clerk test account
```

### Seed data NOT included

- Orders (test orders should be created through the actual checkout flow)
- Reviews (test reviews should be created through the review submission flow)
- Support tickets (same reasoning)

This ensures the seed script gives a functioning catalog without fake transactional data that masks bugs.

---

## 9. Migration Strategy

### Development

```bash
# Generate migration from schema changes
npx prisma migrate dev --name <descriptive_name>

# Apply migrations + generate client
npx prisma migrate dev

# Reset database (destructive — dev only)
npx prisma migrate reset
```

### Production

```bash
# Apply pending migrations (non-destructive)
npx prisma migrate deploy
```

### Migration naming convention

```
YYYYMMDD_descriptive_name

Examples:
  20260414_initial_schema
  20260420_add_review_system
  20260501_add_discount_per_collection
```

### Rules

1. **Never edit a deployed migration.** Create a new migration to fix issues.
2. **Never drop columns in production.** Mark as deprecated, add new column, migrate data, then drop in a later release.
3. **Test all migrations against a Neon branch** before deploying to production.
4. **Back up production DB** before running any migration.

---

## 10. What Is Intentionally Deferred from the Schema at Launch

These features were considered and explicitly excluded. Each has a clear trigger for when to add it.

| Feature | Why deferred | Schema change needed | When to add |
|---|---|---|---|
| **Gift cards** | Adds payment complexity. Gift cards are essentially a second payment method. | New `GiftCard` table, `GiftCardTransaction` table, payment model changes | Month 3–6, when AOV data suggests gifting demand |
| **Inventory movement history** | Simple counter is sufficient at launch. Movement tracking is warehouse-level ops. | New `InventoryMovement` table (variantId, quantity, type, reason, createdBy, createdAt) | When stock discrepancies become a problem or when adding multiple warehouses |
| **Per-collection discounts** | Requires a junction table and more complex validation logic. One code = one discount at launch. | New `DiscountCollection` join table, logic changes in checkout | When marketing needs collection-specific promotions |
| **Stackable discounts** | Complex rule engine. One discount code per order is sufficient at launch. | Changes to Order (multiple discount references), new `AppliedDiscount` table | Rarely needed — most brands never stack |
| **Automatic discounts** | Triggered-by-rule discounts (e.g., "10% off orders over $100" without a code) add significant checkout complexity. | New `AutomaticDiscount` table with rule definitions | When conversion optimization requires it |
| **Product tags / attributes** | Products are organized by collections and materials. Free-form tags add filter complexity without clear UX value at <100 SKUs. | New `ProductTag` table or flexible `attributes` JSON field | When catalog exceeds 100 products and filtering by more dimensions is needed |
| **Multi-currency / localized pricing** | US-first launch. Stripe handles basic currency conversion. Localized pricing (different prices per region) is a different feature. | New `PriceOverride` table (variantId, currency, amount) | When international revenue exceeds 20% of total |
| **Subscriptions / memberships** | No recurring product. Phone cases are one-time purchases. | New `Subscription`, `SubscriptionPlan` tables, recurring payment logic | Only if a clear recurring model emerges (e.g., seasonal drops membership) |
| **Sessions table** | Clerk manages sessions externally. No need to store sessions in our DB. | New `Session` table | Only if migrating away from Clerk to self-hosted auth |
| **Blog / articles table** | Blog content will be managed by Payload CMS in its own schema. We don't duplicate it in Prisma. | None — Payload manages its own tables | Phase 4 (Payload integration) |
| **Media assets table** | Cloudinary manages the media library. We store URLs on product/variant images. A centralized media table is unnecessary when Cloudinary IS the media library. | New `MediaAsset` table if we self-host media | Only if moving away from Cloudinary |
| **Email campaign / sequence tables** | No email automation at launch. Transactional emails only. Campaign data belongs in a dedicated email tool (Resend Audiences, Mailchimp, etc.) | New `EmailCampaign`, `EmailSequence`, `EmailSubscriberSegment` tables | When investing in email marketing (month 3+) |
| **Coupon/promotion analytics** | Track discount usage via the existing `DiscountCode.currentUses` and `Order.discountCodeId`. Detailed analytics (conversion lift, revenue impact) belong in PostHog. | No schema change — analytics tool handles this | Never (use PostHog) |
| **Return/RMA table** | Returns are handled via order status transitions + refund records + support tickets. A dedicated RMA table is overkill for <50 returns/month. | New `ReturnRequest` table with line-item-level return tracking | When return volume exceeds 50/month or when partial returns (some items in an order) become common |
| **Shipping rates / zones table** | Use Stripe's shipping rate configuration or hardcoded rates at launch. Dynamic shipping calculation requires carrier API integration. | New `ShippingZone`, `ShippingRate` tables | When offering multiple shipping options or international shipping with variable rates |

### Philosophy

**Every table in the schema exists because it serves a launched feature or is trivially cheap to have ready.** Empty tables in Postgres cost zero performance. But application code for unused tables costs maintenance, test coverage, and cognitive load.

The deferred features list is not a "nice to have" list — it's a **prioritized roadmap** with specific triggers for each addition.

---

## Schema Statistics

| Metric | Count |
|---|---|
| Models | 27 |
| Enums | 10 |
| Many-to-many relationships | 2 (Product↔Collection, Product↔Material) |
| One-to-one relationships | 2 (User↔Cart, Order↔Payment) |
| Indexes (explicit) | 42 |
| JSON fields | 2 (Order.shippingAddress, Order.billingAddress) + 1 (AuditLog.metadata) |
| Soft-delete fields | 1 (User.deletedAt) |

---

## Next Steps

**Phase 2 complete. Ready for Phase 3: UX/UI System.**

Phase 3 will deliver:
- Brand style guide (design tokens)
- Typography system
- Color palette (design tokens for Tailwind)
- Spacing system
- UI component inventory
- Page wireframes (homepage, collection, product, about, contact, support, account, admin)
