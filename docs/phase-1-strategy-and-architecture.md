# Phase 1: Strategy and Architecture

## CaseaFelt — Premium Tactile Phone Case Brand

**Document version:** 1.1  
**Date:** April 14, 2026  
**Status:** Approved with revisions — Proceeding to Phase 2

---

## Table of Contents

1. [Brand Positioning](#1-brand-positioning)
2. [Target Customer Segments](#2-target-customer-segments)
3. [Value Proposition](#3-value-proposition)
4. [Visual Identity Direction](#4-visual-identity-direction)
5. [Site Map](#5-site-map)
6. [Information Architecture](#6-information-architecture)
7. [User Journeys](#7-user-journeys)
8. [Business Workflows](#8-business-workflows)
9. [Tech Stack Recommendation](#9-tech-stack-recommendation)
10. [Build vs Buy Decisions](#10-build-vs-buy-decisions)
11. [Risks and Tradeoffs](#11-risks-and-tradeoffs)
12. [Launch-Readiness Checklist](#12-launch-readiness-checklist)

---

## 1. Brand Positioning

### Positioning Statement

CaseaFelt is a design-forward phone case brand that treats everyday protection as an opportunity for material expression. Every case is built around tactile craft — real felt, deliberate texture, and minimal form — for people who care about how things feel, not just how they look.

### Market Position

| Axis | CaseaFelt Position |
|---|---|
| Price | Premium ($39–$69 per case) |
| Design language | Minimal, editorial, texture-driven |
| Material story | Felt-forward, tactile-first |
| Target aesthetic | Gender-neutral, design-conscious |
| Competitive space | Between Casetify (loud/custom) and Apple cases (plain/safe) |

### Competitive Landscape

| Brand | Strength | Weakness | CaseaFelt Differentiation |
|---|---|---|---|
| Casetify | Customization, social proof | Loud, trend-chasing, plastic feel | Material craft, restraint |
| Apple/Samsung OEM | Trust, fit | Boring, no personality | Design identity, warmth |
| Nomad | Premium materials (leather) | Masculine, utilitarian | Gender-neutral, softer aesthetic |
| dbrand | Tech audience, skins | Cold, aggressive branding | Warmth, tactile softness |
| Peak Design | Functional system (mounts) | Function-first, not fashion | Fashion-first, texture-first |

### Brand Pillars

1. **Tactile craft** — You feel the difference before you see it
2. **Quiet design** — No logos screaming, no trends chasing
3. **Material honesty** — Real textures, not printed patterns
4. **Everyday elevation** — A small upgrade that changes how your phone feels in hand

---

## 2. Target Customer Segments

### Primary Segments

#### Segment A: "The Design-Conscious Professional" (30–45)

- Works in creative, tech, or knowledge work
- Buys Muji, Aesop, Reigning Champ
- Values quality over quantity
- Notices material and finish
- Likely owns iPhone Pro or Samsung flagship
- Willing to pay $45–65 for a phone case if the design justifies it

#### Segment B: "The Intentional Minimalist" (24–35)

- Curates a deliberate aesthetic
- Active on Pinterest, reads Monocle or Kinfolk
- Prefers neutral palettes
- Buys fewer, better things
- Price range: $35–55

#### Segment C: "The Gift Buyer"

- Shopping for someone design-conscious
- Needs clear product photography and easy navigation
- Values packaging and unboxing
- Price range: $39–69 (gift sets possible later)

### Anti-Personas (Do NOT design for)

- Hypebeasts wanting loud drops
- Bargain hunters comparing $5 Amazon cases
- People who want licensed sports/band logos
- Anyone looking for "rugged" or "military-grade" language

---

## 3. Value Proposition

### Brand Copy (Customer-Facing Tagline)

> Phone cases designed to be felt, not just seen.

*This is brand copy — a headline for the homepage and marketing. It is not the strategic value proposition.*

### Strategic Value Proposition

CaseaFelt occupies the white space between mass-market phone accessories and luxury fashion goods. The strategic value is:

1. **Material differentiation in a commoditized category.** Phone cases are a $20B+ market dominated by plastic. Felt and tactile materials create a sensory distinction that cannot be replicated in product photos alone — driving word-of-mouth and repeat purchase.
2. **Design identity as a moat.** Collections are curated around aesthetic themes, not device generations. This decouples the brand from the Apple/Samsung release cycle and builds a recognizable visual language.
3. **Premium pricing justified by craft, not brand tax.** The price premium ($39–$69 vs. $10–$25 commodity) is anchored in real material cost and design labor, not influencer endorsement or logo markup.

### Expanded Brand Narrative

CaseaFelt makes premium phone cases from real felt and tactile materials, designed with editorial minimalism. Each collection is inspired by textures and environments — not trends — so your phone feels intentional, warm, and unmistakably yours.

### Key Purchase Drivers

| Driver | How CaseaFelt Delivers |
|---|---|
| Tactile experience | Real felt, stitched edges, texture variety |
| Design credibility | Editorial photography, curated collections |
| Trust | Clear policies, reviews, real materials |
| Compatibility clarity | Device-specific pages, fit guarantees |
| Giftworthiness | Premium packaging, clean presentation |

---

## 4. Visual Identity Direction

### Theme

**Tactile editorial minimalism with a lifestyle focus**

### Color Palette

| Role | Color | Hex | Usage |
|---|---|---|---|
| Background primary | Warm white | `#FAF8F5` | Page backgrounds |
| Background secondary | Cream | `#F2EDE7` | Section alternation, cards |
| Text primary | Charcoal | `#2C2C2C` | Headlines, body |
| Text secondary | Warm gray | `#7A756E` | Captions, metadata |
| Accent 1 | Olive | `#5C6B4F` | CTAs, collection "Earth" |
| Accent 2 | Sand | `#C4B49A` | Tags, subtle highlights |
| Accent 3 | Burgundy | `#6B3A3A` | Sale, alerts, "Studio" accent |
| Accent 4 | Slate | `#4A4E54` | "Structure" collection, footers |
| Border | Light warm | `#E8E3DC` | Dividers, card borders |

### Typography Direction

| Role | Recommendation | Style |
|---|---|---|
| Headlines | Inter Display or similar geometric sans | Medium/Semibold, tight tracking |
| Body | Inter or system sans | Regular, generous line height (1.6) |
| Accent/Labels | Same family, all-caps small | Spaced tracking, uppercase |
| Monospace (admin) | JetBrains Mono or Fira Code | For admin dashboard data |

**Reasoning:** Inter is free, highly legible, has excellent variable font support, and looks premium without licensing cost. A startup should not spend on typeface licensing at launch. If revenue supports it later, upgrade to a distinctive serif or custom typeface.

### Photography Direction

- Macro shots of felt texture, stitching, edges
- Warm, diffused natural light
- Hands holding cases in lifestyle contexts (coffee shop, desk, transit)
- Flat-lay editorial compositions
- Muted, desaturated color grading
- No harsh studio lighting, no floating 3D renders

### Layout Principles

- Strong horizontal whitespace (min 80px vertical section spacing)
- Max content width: 1280px
- Product grids: 2-col mobile, 3-col tablet, 4-col desktop
- Editorial story sections on homepage and collection pages
- No sidebars on storefront pages

---

## 5. Site Map

```
CaseaFelt.com
│
├── / (Homepage)
│   ├── Hero with featured collection
│   ├── Material story section
│   ├── Featured products grid
│   ├── Collection previews
│   ├── Testimonials/reviews
│   ├── Newsletter signup
│   └── Footer
│
├── /collections
│   ├── /collections/field
│   ├── /collections/studio
│   ├── /collections/soft-form
│   ├── /collections/earth
│   ├── /collections/structure
│   └── /collections/all
│
├── /products
│   └── /products/[slug] (Product Detail Page)
│
├── /about
├── /contact
├── /custom-inquiry (Custom design requests)
├── /support
│   ├── /support/tickets (Authenticated)
│   └── /support/faq
│
├── /account (Authenticated)
│   ├── /account/orders
│   ├── /account/wishlist
│   ├── /account/addresses
│   ├── /account/settings
│   └── /account/tickets
│
├── /cart
├── /checkout (Stripe-hosted or embedded)
│
├── /blog
│   └── /blog/[slug]
│
├── /privacy-policy
├── /terms-of-service
├── /return-policy
├── /shipping-policy
│
├── /admin (Authenticated + Role-gated)
│   ├── /admin/dashboard
│   ├── /admin/products
│   ├── /admin/orders
│   ├── /admin/customers (Customer Ops)
│   ├── /admin/inventory
│   ├── /admin/discounts
│   ├── /admin/support
│   ├── /admin/content
│   ├── /admin/analytics
│   ├── /admin/settings
│   └── /admin/audit-log
│
└── /api (Backend routes)
    ├── /api/products
    ├── /api/collections
    ├── /api/cart
    ├── /api/checkout
    ├── /api/orders
    ├── /api/auth
    ├── /api/reviews
    ├── /api/support
    ├── /api/newsletter
    ├── /api/contact
    ├── /api/inquiry
    ├── /api/admin/*
    └── /api/webhooks (Stripe, email, etc.)
```

---

## 6. Information Architecture

### Content Hierarchy

```
Brand
└── Collections (aesthetic groupings)
    └── Products
        └── Variants (device + color/material combos)
            └── Inventory (stock per variant)

Customers
├── Account
│   ├── Orders
│   ├── Wishlist
│   ├── Addresses
│   └── Support Tickets
└── Guest (can checkout without account)

Admin
├── Catalog Management
├── Order Management
├── Customer Operations
├── Support
├── Content
├── Analytics
└── Settings
```

### Product Data Model (Conceptual)

```
Product
├── name, slug, description, short_description
├── base_price, compare_at_price
├── collection (many-to-many)
├── materials (many-to-many)
├── images[] (ordered, with alt text)
├── features[]
├── seo_title, seo_description
├── status (draft / active / archived)
└── Variants[]
    ├── device_model (e.g., "iPhone 16 Pro")
    ├── color/material variant name
    ├── sku
    ├── price (override or inherit)
    ├── inventory_count
    ├── weight
    └── images[] (variant-specific)
```

### Navigation Structure

**Primary Nav:**
- Shop (dropdown → collections + "All")
- About
- Contact
- Cart icon + count

**Footer Nav:**
- Shop (all collections)
- About
- Contact
- Support / FAQ
- Blog
- Privacy Policy
- Terms of Service
- Return Policy
- Shipping Policy

**Account Nav (authenticated):**
- Orders
- Wishlist
- Addresses
- Settings
- Support Tickets
- Logout

---

## 7. User Journeys

### Journey 1: First-Time Buyer (Organic/Social Discovery)

```
1. Lands on homepage (via Instagram or search)
2. Sees hero → understands brand in 3 seconds
3. Scrolls → material story captures interest
4. Clicks "Shop Earth Collection"
5. Browses collection grid (3–8 products)
6. Clicks product → sees macro photos, selects device
7. Adds to cart
8. Views cart → sees total, shipping estimate
9. Proceeds to checkout (guest or account)
10. Pays via Stripe
11. Receives confirmation email
12. Receives shipping notification
13. Receives post-delivery follow-up (review request)
```

### Journey 2: Return Visitor (Newsletter Subscriber)

```
1. Receives email: "New Collection: Studio"
2. Clicks → lands on /collections/studio
3. Browses → adds to wishlist (logged in)
4. Returns 2 days later from wishlist
5. Purchases
```

### Journey 3: Gift Buyer

```
1. Searches "premium phone case gift"
2. Lands on product page (SEO)
3. Checks device compatibility
4. Reads reviews
5. Adds to cart
6. Checks return policy (linked from product page)
7. Purchases with gift note (future feature — mark as V2)
```

### Journey 4: Support Request

```
1. Customer receives case, has quality concern
2. Goes to /support → submits ticket
3. Receives email confirmation
4. Admin sees ticket in /admin/support
5. Admin responds → customer gets email
6. Resolution → refund/replacement processed
```

### Journey 5: Admin Daily Operations

```
1. Logs in → /admin/dashboard
2. Sees: new orders (count), pending support tickets, low stock alerts
3. Clicks orders → processes fulfillment
4. Checks customer ops panel → reviews abandoned carts
5. Reviews analytics → conversion rate, top products
```

---

## 8. Business Workflows

### Order Lifecycle

```
PLACED → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
                                         └→ RETURN_REQUESTED → RETURN_APPROVED → REFUNDED
                                                            └→ RETURN_DENIED
```

### Support Ticket Lifecycle

```
OPEN → IN_PROGRESS → AWAITING_CUSTOMER → RESOLVED → CLOSED
                                      └→ REOPENED → IN_PROGRESS
```

### Inventory Workflow

```
Product Variant created → stock_count set
Order placed → stock_count decremented (on payment confirmation)
Order cancelled/refunded → stock_count incremented
Low stock threshold → admin notification
Out of stock → variant marked unavailable, product page shows "Sold Out"
```

### Abandoned Cart Workflow

```
Cart created → timestamp tracked
If no checkout after 1 hour → flag as abandoned
If customer has email → send reminder at 1hr, 24hr, 72hr
Admin can view abandoned carts in customer ops panel
```

**Launch note:** Abandoned cart emails are a V2 feature. At launch, track abandoned carts in the database only. Send emails manually or integrate automated emails in the first month post-launch.

### Discount Code Workflow

```
Admin creates discount code:
  - type: percentage or fixed amount
  - conditions: min order, specific collections, single-use, expiry
Customer applies at checkout
System validates → applies discount → stores on order
```

### Review Workflow

```
Order delivered → wait 7 days → send review request email
Customer submits review (1–5 stars + text)
Review stored as "pending"
Admin approves or rejects in /admin
Approved reviews shown on product page
```

---

## 9. Tech Stack Recommendation

### Core Stack

| Layer | Technology | Reasoning |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Full-stack React, SSR/SSG for SEO, API routes, middleware, image optimization. Industry standard. |
| **Language** | TypeScript | Type safety across full stack. Non-negotiable for production. |
| **Styling** | Tailwind CSS 4 | Utility-first, fast iteration, excellent with component libraries. No runtime CSS cost. |
| **Database** | PostgreSQL (via Neon or Supabase) | Relational data (products, orders, users) is inherently relational. Postgres is battle-tested. |
| **ORM** | Prisma | Type-safe DB access, excellent migration system, schema-as-documentation. |
| **Auth** | Clerk | Managed auth with prebuilt UI, social login, session management, RBAC. Saves 2–4 weeks of auth work. |
| **Payments** | Stripe | Industry standard. Checkout, subscriptions, refunds, webhooks. No alternative at this stage. |
| **Email** | Resend | Modern email API, React Email for templates, generous free tier (3k/month). Simpler than Postmark for a startup. |
| **CMS** | Payload CMS (self-hosted) | Headless CMS built on Next.js + Postgres. Shares the same stack. No external service dependency. Content blocks, media, blog — all in one DB. |
| **Media/CDN** | Cloudinary | Image optimization, transformation, CDN delivery. Free tier is sufficient for launch (25k transformations/month). |
| **Analytics** | PostHog (primary) + GA4 (secondary) | PostHog: product analytics, funnels, session replay, feature flags. GA4: SEO/acquisition data. PostHog's free tier (1M events/month) is very generous for a startup. |
| **Hosting** | Vercel | Native Next.js host. Edge functions, preview deployments, analytics. Hobby plan is free; Pro at $20/mo when needed. |
| **Database hosting** | Neon | Serverless Postgres. Free tier with autoscaling. Branches for dev/staging. Better DX than Supabase for a Prisma-first stack. |

### Supporting Tools

| Tool | Purpose | Cost at Launch |
|---|---|---|
| GitHub | Source control, CI/CD | Free |
| Vercel | Hosting, deployments | Free → $20/mo |
| Neon | Postgres hosting | Free tier |
| Clerk | Auth | Free (up to 10k MAU) |
| Stripe | Payments | Pay-per-transaction (2.9% + 30¢) |
| Resend | Transactional email | Free (3k/mo) |
| Cloudinary | Image hosting/CDN | Free (25k transforms/mo) |
| PostHog | Analytics | Free (1M events/mo) |
| Sentry | Error monitoring | Free (5k events/mo) |
| Upstash | Rate limiting (Redis) | Free (10k requests/day) |

### Total Monthly Infrastructure Cost

| Phase | Estimated Monthly Cost | Notes |
|---|---|---|
| **Pre-launch / development** | $0 | All services on free tiers. Sufficient for dev and staging. |
| **Launch (month 1–2, <500 orders/mo)** | $20–$50/mo | Vercel Pro ($20), Neon may stay free, Clerk free tier likely sufficient. Stripe is per-transaction. |
| **Growth (month 3–6, 500–2000 orders/mo)** | $80–$200/mo | Neon paid ($19+), Clerk may need paid tier ($25+), Cloudinary paid tier if image volume grows, Resend paid if exceeding 3k emails/mo. |
| **Scale (2000+ orders/mo)** | $200–$500/mo | All services on paid tiers. PostHog may need paid tier. Consider reserved capacity. |

Free tiers are real and useful for launch, but budget for paid tiers within 2–3 months of real traffic. Stripe transaction fees (2.9% + 30¢) are separate and scale linearly with revenue — at $50 AOV and 1000 orders/mo, that's ~$1,750/mo in processing fees.

---

## 10. Build vs Buy Decisions

| Capability | Decision | Tool/Approach | Reasoning |
|---|---|---|---|
| **Authentication** | **Buy** | Clerk | Auth is complex (sessions, MFA, social login, security). Clerk handles it properly. Building auth is a known time sink with high security risk. |
| **Payments** | **Buy** | Stripe | PCI compliance alone makes this non-negotiable. Stripe handles checkout, refunds, disputes, and tax. |
| **Email sending** | **Buy** | Resend | Deliverability requires IP reputation, SPF/DKIM/DMARC. Resend handles this. We build email templates. |
| **Image hosting** | **Buy** | Cloudinary | On-the-fly resizing, format conversion (WebP/AVIF), CDN. Building this is a waste of time. |
| **Analytics** | **Buy** | PostHog + GA4 | PostHog gives product analytics + session replay. GA4 gives acquisition data. Building analytics from scratch is absurd. |
| **Error monitoring** | **Buy** | Sentry | Stack traces, performance monitoring, alerting. No reason to build this. |
| **Rate limiting** | **Buy** | Upstash Redis | Serverless Redis for rate limiting API routes. Simple, cheap, reliable. |
| **CMS / Content** | **Build (with Payload)** | Payload CMS | Payload runs on our stack (Next.js + Postgres). No external CMS dependency. Content lives in our DB. Full control. |
| **Product catalog** | **Build** | Custom | Core business logic. Must be fully controlled. Product/variant/collection model is specific to our needs. |
| **Cart system** | **Build** | Custom | Cart is core to conversion. Must be fast, reliable, and tightly integrated with our product model. |
| **Checkout flow** | **Hybrid** | Custom UI + Stripe | We own the UX. Stripe handles the payment processing via embedded checkout or Payment Intents. |
| **Order management** | **Build** | Custom | Core operations. Must integrate with our CRM, support, and inventory systems. |
| **Customer operations** | **Build** | Custom (lean internal panel) | At launch, this is NOT a CRM platform. It is a lightweight internal operations panel with CRM-like capabilities: customer profiles (auto-populated from orders), order history, internal notes, and tags. No lead scoring, no email sequences, no pipeline management. Integrate a real CRM (HubSpot, Attio) when customer volume exceeds 5k or when marketing automation is needed. |
| **Support tickets** | **Build** | Custom | Simple ticket system (create, reply, status). No need for Zendesk at this scale. Integrate later if needed. |
| **Admin dashboard** | **Build** | Custom | Must be tightly integrated with all systems. Off-the-shelf admin tools (Retool, AdminJS) add complexity without saving meaningful time for our specific needs. |
| **Reviews** | **Build** | Custom | Simple review system (star + text + moderation). No need for Yotpo or Judge.me at launch. |
| **SEO** | **Build** | Next.js built-in | Next.js has excellent SEO support (metadata API, sitemap generation, structured data). No plugins needed. |
| **Newsletter** | **Hybrid** | Custom capture + Resend | Capture emails in our DB. Send via Resend. No need for Mailchimp at launch. Integrate later for campaigns. |
| **Inventory** | **Build** | Custom | Simple stock counting. No need for a warehouse management system at launch. |
| **Abandoned cart** | **Build** | Custom (tracking only at launch) | Track in DB. Automated emails are V2. |

### What NOT to build at launch

| Feature | Reasoning | When to Add |
|---|---|---|
| Gift cards | Adds payment complexity. Focus on direct sales. | Month 3–6 |
| Subscription/membership | No recurring product model yet. | Only if retention data justifies it |
| Multi-currency | Stripe handles basic currency. Full multi-currency (localized pricing) is complex. | When international revenue exceeds 20% |
| Multi-language | Not needed for US/English-first launch. | When expanding to non-English markets |
| Live chat | Support volume won't justify it at launch. Use email/ticket system. | When ticket volume exceeds 20/day |
| Referral program | Premature optimization. Focus on product-market fit. | Month 6+ |
| Loyalty points | Complex, low-impact at low volume. | Year 2 |
| App (mobile) | PWA + responsive web is sufficient. Native app is a massive investment. | Only with proven demand |

---

## 11. Risks and Tradeoffs

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Clerk dependency (auth vendor lock-in) | Medium | High | Clerk stores user data but we store all business data. Migration path exists to Auth.js if needed. Keep business user profile in our DB, not Clerk's metadata. |
| Neon free tier limitations | Low | Medium | Neon's free tier is generous (0.5 GB storage, 190 compute hours). Paid tier starts at $19/mo. Monitor usage. |
| Vercel cold starts | Low | Low | Use ISR (Incremental Static Regeneration) for product/collection pages. Only API routes have cold starts, and they're fast on Vercel. |
| Stripe integration complexity | Medium | Medium | Use Stripe's embedded checkout to reduce PCI scope. Webhook handling requires careful idempotency. Test thoroughly. |
| Image performance | Medium | Medium | Cloudinary + Next.js Image component handles optimization. Define image size presets to avoid serving oversized images. |
| Payload CMS learning curve | Medium | Low | Payload is well-documented and built on our stack. Investment pays off because content is self-hosted. |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Low initial traffic | High | High | SEO foundation from day 1. Allocate budget for targeted social ads. Content marketing via blog. |
| High return rate (phone case fit) | Medium | High | Extremely clear device compatibility on product pages. Fit guarantee messaging. |
| Premium pricing resistance | Medium | Medium | Material story + photography must justify price. Show texture, craft, detail. Consider a "starter" collection at $35. |
| Inventory management at scale | Low (at launch) | Medium | Simple stock counting is sufficient for <100 SKUs. Re-evaluate at 500+ SKUs. |

### Architecture Tradeoffs

| Decision | Tradeoff | Why It's Acceptable |
|---|---|---|
| Monorepo (single Next.js app) | Admin and storefront share a codebase | Simplicity. Separate when team grows beyond 3 engineers. |
| Prisma (vs raw SQL) | Slight performance overhead | DX gains (type safety, migrations) far outweigh the ~5ms overhead per query at this scale. |
| Payload CMS in same app | Adds weight to the main app | Payload 3.0 is designed to embed in Next.js. Avoids running a separate service. |
| Custom CRM (vs HubSpot) | Less powerful CRM features | This is NOT a CRM build — it's a lean customer operations panel. At <1000 customers, profile + notes + tags is sufficient and fully integrated. Migrate to HubSpot/Attio when automation or lead scoring is needed. |
| Server components (React) | Learning curve for team | This is the future of React. Investment in RSC pays off in performance and DX. |

---

## 12. Launch-Readiness Checklist

### Tier 0: Launch-Critical MVP (Must ship before accepting real orders)

These are non-negotiable for a functioning store. Without any one of these, the business cannot operate.

- [ ] Homepage with hero, featured products, newsletter signup
- [ ] Collection pages with basic filtering (by collection)
- [ ] Product detail pages with variant selection (device model)
- [ ] Cart (persistent via cookie for guests, DB-backed for logged-in users)
- [ ] Checkout via Stripe (hosted checkout — simplest, most secure)
- [ ] Guest checkout (do NOT require account creation to purchase)
- [ ] User account creation and login (Clerk)
- [ ] Order confirmation email (Resend)
- [ ] Order history in customer account
- [ ] Admin: product CRUD (create, edit, archive products and variants)
- [ ] Admin: order list with status management
- [ ] Admin: basic dashboard (today's orders, revenue, pending actions)
- [ ] Contact form (stores submissions, sends notification email to team)
- [ ] Newsletter email capture (stores in DB)
- [ ] Legal pages: privacy policy, terms of service, return policy, shipping policy
- [ ] SEO: metadata on all pages, sitemap.xml, robots.txt
- [ ] Mobile responsive (all storefront pages)
- [ ] Error monitoring (Sentry)
- [ ] Rate limiting on all public API routes (Upstash)
- [ ] Secure headers and environment variable protection

### Tier 1: Post-Launch (Month 1–2, adds operational depth)

These improve operations and conversion but are NOT required for day-one sales.

- [ ] Support ticket submission (customer-facing form + admin view)
- [ ] Admin: customer profiles (auto-populated from orders)
- [ ] Admin: internal notes on customers
- [ ] Review system (submit + moderate + display)
- [ ] Wishlist (save products to account)
- [ ] Discount codes (admin creates, customer applies at checkout)
- [ ] Abandoned cart tracking (flag in DB, no automated emails yet)
- [ ] Admin: inventory low-stock alerts
- [ ] Blog/content pages (via Payload CMS)

### Tier 2: Growth Features (Month 3–6, adds scale and sophistication)

- [ ] Abandoned cart recovery emails (automated via Resend)
- [ ] Customer tags and segments in admin
- [ ] Custom design inquiry flow (structured form + admin queue)
- [ ] Advanced analytics dashboards (PostHog funnels, cohorts)
- [ ] Admin: audit log viewer
- [ ] Admin: role and permission management UI
- [ ] Gift cards
- [ ] Enhanced email campaigns (new collection announcements, etc.)

---

## Architecture Diagram (Conceptual)

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENTS                          │
│  Browser (Storefront)    Browser (Admin)    Mobile (PWA)│
└───────────────┬─────────────────┬───────────────────────┘
                │                 │
                ▼                 ▼
┌─────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                  │
│  CDN / Static Assets / Edge Middleware (auth, geo, rate)│
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│               NEXT.JS APPLICATION                       │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Storefront   │  │  Admin Panel  │  │  API Routes   │ │
│  │  (RSC + SSR)  │  │  (Client)     │  │  (REST)       │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │  Payload CMS  │  │  Middleware   │                    │
│  │  (embedded)   │  │  (auth/rate)  │                    │
│  └──────────────┘  └──────────────┘                     │
└───────────┬───────────────┬─────────────────────────────┘
            │               │
            ▼               ▼
┌───────────────┐  ┌──────────────────┐
│  PostgreSQL   │  │  External APIs    │
│  (Neon)       │  │                   │
│               │  │  • Clerk (auth)   │
│  All tables:  │  │  • Stripe (pay)   │
│  users,       │  │  • Resend (email) │
│  products,    │  │  • Cloudinary     │
│  orders,      │  │  • PostHog        │
│  CRM, etc.    │  │  • Sentry         │
│               │  │  • Upstash Redis  │
└───────────────┘  └──────────────────┘
```

### Data Flow: Checkout

```
1. Customer adds to cart → Cart stored in DB (or cookie for guests)
2. Customer clicks "Checkout" → API creates Stripe Checkout Session
3. Stripe redirects to hosted checkout (or embedded)
4. Customer pays → Stripe fires webhook: checkout.session.completed
5. Webhook handler:
   a. Creates Order record in DB
   b. Decrements inventory
   c. Sends confirmation email via Resend
   d. Tracks "purchase" event in PostHog
6. Customer redirected to /order/[id]/confirmation
```

### Data Flow: Auth

```
1. Customer clicks "Sign In" → Clerk modal opens
2. Customer authenticates (email/password or social)
3. Clerk issues session token (JWT)
4. Next.js middleware validates token on protected routes
5. On first login, webhook from Clerk creates/updates user record in our DB
6. All business data (orders, addresses, etc.) linked to our DB user record, not Clerk's
```

---

## Project Structure (Planned)

```
caseafelt/
├── docs/                        # Documentation
├── prisma/
│   └── schema.prisma            # Database schema
├── public/
│   ├── images/                  # Static images (logo, icons)
│   └── fonts/                   # Self-hosted fonts
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (storefront)/        # Route group: public pages
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── collections/
│   │   │   ├── products/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── support/
│   │   │   ├── blog/
│   │   │   ├── cart/
│   │   │   └── checkout/
│   │   ├── (account)/           # Route group: authenticated
│   │   │   └── account/
│   │   ├── (admin)/             # Route group: admin
│   │   │   └── admin/
│   │   ├── (legal)/             # Route group: policies
│   │   ├── api/                 # API routes
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── orders/
│   │   │   ├── reviews/
│   │   │   ├── support/
│   │   │   ├── newsletter/
│   │   │   ├── contact/
│   │   │   ├── admin/
│   │   │   └── webhooks/
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── ui/                  # Primitive UI components
│   │   ├── storefront/          # Storefront-specific
│   │   ├── admin/               # Admin-specific
│   │   ├── forms/               # Form components
│   │   └── layout/              # Layout components
│   ├── lib/
│   │   ├── db.ts                # Prisma client
│   │   ├── stripe.ts            # Stripe client
│   │   ├── email.ts             # Resend client
│   │   ├── analytics.ts         # PostHog client
│   │   ├── cloudinary.ts        # Cloudinary config
│   │   ├── auth.ts              # Clerk helpers
│   │   ├── utils.ts             # Utility functions
│   │   └── validations/         # Zod schemas
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript types
│   ├── constants/               # App constants
│   └── emails/                  # React Email templates
├── .env.example                 # Environment variables template
├── .env.local                   # Local environment variables (git ignored)
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── package.json
└── README.md
```

---

## Key Architectural Decisions (ADRs)

### ADR-001: Monorepo over separate services

**Context:** Should storefront and admin be separate apps?  
**Decision:** Single Next.js app with route groups.  
**Reasoning:** At startup scale (1–3 engineers), a monorepo reduces deployment complexity, shares code (types, DB client, utils), and avoids cross-service communication overhead. Separate when the team exceeds 5 engineers or when admin and storefront have different scaling requirements.

### ADR-002: Payload CMS embedded in Next.js

**Context:** Should CMS be a separate service (Sanity, Contentful) or embedded?  
**Decision:** Payload CMS 3.0 embedded in the Next.js app.  
**Reasoning:** Payload 3.0 is built for Next.js. It uses the same Postgres database, same deploy. No external CMS cost, no API latency for content fetches, full control over content schema. Trade-off: slightly heavier app, but eliminated operational complexity of a separate CMS.

### ADR-003: Clerk over Auth.js

**Context:** Build auth or buy?  
**Decision:** Clerk (managed auth service).  
**Reasoning:** Auth.js (NextAuth) is powerful but requires significant work for session management, email verification, social login, MFA, and security hardening. Clerk provides all of this out of the box with a generous free tier (10k MAU). The trade-off is vendor dependency, which we mitigate by storing all business data in our DB and only using Clerk for authentication/session management.

### ADR-004: Lean customer operations panel over external CRM

**Context:** Should we integrate HubSpot CRM or build a full CRM?  
**Decision:** Build a lean internal customer operations panel with CRM-like capabilities.  
**Reasoning:** At launch, we do not need a CRM platform. We need an internal admin view that shows customer profiles (auto-populated from orders and signups), order history, internal notes, tags, and linked support tickets. This is an operations tool, not a sales/marketing tool. There is no lead scoring, no automated email sequences, no deal pipeline. Migrate to HubSpot or Attio when the business requires marketing automation or when the customer base exceeds 5,000.

### ADR-005: Neon over Supabase for Postgres

**Context:** Where to host Postgres?  
**Decision:** Neon serverless Postgres.  
**Reasoning:** We're using Prisma as our ORM, not Supabase's client libraries. Neon offers serverless Postgres with connection pooling, branching (for dev/staging), and a generous free tier. Supabase's value is in its client libraries and auth — which we don't need (we have Prisma and Clerk). Neon is a better fit for a Prisma-first architecture.

---

## Summary

This architecture is:

- **Lean**: ~$0–$50/month at launch, scaling predictably with revenue
- **Integrated**: One codebase, one database, one deployment
- **Type-safe**: TypeScript + Prisma + Zod end-to-end
- **Scalable**: Can handle 10,000+ orders/month without re-architecture
- **Operable**: Admin dashboard for daily operations from day 1
- **Maintainable**: Clear separation of concerns, documented decisions
- **Secure**: Managed auth, managed payments, server-side validation, rate limiting

---

## Next Steps

**Phase 1 approved with revisions. Proceeding to Phase 2: Data Model and System Design.**

Phase 2 delivers:
- Complete Prisma schema with all tables and relationships
- Enum and status modeling
- Schema tradeoff explanations
- Deferred features section
- Seed data strategy
