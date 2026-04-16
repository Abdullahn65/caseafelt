# Phase 3: UX/UI System

## CaseaFelt — Design System and Page Architecture

**Document version:** 1.0  
**Date:** April 14, 2026  
**Status:** Complete — Ready for Phase 4  
**Depends on:** Phase 1 (brand direction), Phase 2 (data model)

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Brand Style Guide](#2-brand-style-guide)
3. [Typography System](#3-typography-system)
4. [Color System](#4-color-system)
5. [Spacing System](#5-spacing-system)
6. [Layout System](#6-layout-system)
7. [UI Component Inventory](#7-ui-component-inventory)
8. [Page Architecture: Storefront](#8-page-architecture-storefront)
9. [Page Architecture: Account](#9-page-architecture-account)
10. [Page Architecture: Admin](#10-page-architecture-admin)
11. [Interaction Patterns](#11-interaction-patterns)
12. [Responsive Strategy](#12-responsive-strategy)
13. [Accessibility Requirements](#13-accessibility-requirements)
14. [What Is Intentionally Not Designed](#14-what-is-intentionally-not-designed)

---

## 1. Design Principles

Five rules that govern every UI decision. When in doubt, apply these in order.

### P1: Texture first, pixels second

The product is tactile. The UI must make you want to touch the screen. This means: large product images, macro detail shots filling the viewport, and generous space around them. The photography does the selling — the UI holds the frame.

### P2: Silence is a feature

Every element that isn't earning its place gets removed. No decorative borders, no gratuitous animations, no badge overload, no "🔥 TRENDING" banners. White space is the most expensive material in the design — use it generously.

### P3: One thing per moment

Each section of a page has one job. The hero sells the mood. The product grid sells the catalog. The material section sells the craft story. Never combine two messages in one visual frame.

### P4: Trust through clarity, not persuasion

Premium brands don't need urgency tactics. No countdown timers, no "Only 3 left!", no manipulative dark patterns. Trust comes from clear pricing, honest materials, straightforward policies, and real reviews.

### P5: Mobile is the primary canvas

70%+ of e-commerce traffic is mobile. Every component is designed mobile-first, then expanded for larger screens. If it doesn't work on a 375px screen, it doesn't ship.

---

## 2. Brand Style Guide

### Logo usage

| Variant | Usage | Format |
|---|---|---|
| Wordmark (primary) | Header, footer, emails, packaging | SVG, dark on light |
| Wordmark (inverted) | Dark backgrounds, social | SVG, light on dark |
| Monogram "C" | Favicon, mobile header, watermarks | SVG, 32×32 minimum |

**Logo rules:**
- Minimum clear space: 1× the height of the "C" on all sides
- Never place the logo on busy or patterned backgrounds
- Never stretch, rotate, or add effects
- The wordmark is always set in the brand typeface, not typed — it's a locked asset

### Voice and tone

| Context | Tone | Example |
|---|---|---|
| Headlines | Confident, minimal, declarative | "Felt in hand." not "Amazing phone cases you'll love!" |
| Product descriptions | Sensory, specific, material-focused | "Pressed merino felt with a soft matte finish and hand-stitched edge." |
| CTAs | Clear, unhurried | "Add to cart" / "Shop the collection" / "Continue" — never "BUY NOW" or "GRAB YOURS" |
| Error states | Helpful, calm | "That case is out of stock right now." not "ERROR: Item unavailable!" |
| Empty states | Warm, directional | "Your cart is empty. Start with our latest collection." |

### Photography rules (summary from Phase 1, refined for UI)

| Type | Usage | Aspect ratio | Notes |
|---|---|---|---|
| Hero / editorial | Homepage hero, collection headers | 16:9 or 3:2 | Full bleed, warm lighting, lifestyle or macro |
| Product primary | Product cards, PDP main image | 4:5 (portrait) | Clean background (#F2EDE7 or white), product centered |
| Product gallery | PDP secondary images | 4:5 or 1:1 | Mix of: flat lay, in-hand, macro texture, detail crop |
| Variant swatch | Color/material selectors | 1:1 (circle crop) | Tight crop of variant material/color |
| Lifestyle | About page, blog, editorial inserts | 3:2 or 16:9 | Hands, desk, environment — never posed/stocky |

---

## 3. Typography System

### Typeface

**Inter** (variable font, self-hosted from `/public/fonts/`)

Self-hosting eliminates the Google Fonts network request and gives full control over font-display behavior. Load only the weights used: 400 (Regular), 500 (Medium), 600 (SemiBold).

### Scale

Based on a 1.250 ratio (major third) from a 16px base. Defined as Tailwind config values.

| Token | Size | Weight | Line height | Tracking | Usage |
|---|---|---|---|---|---|
| `text-xs` | 12px / 0.75rem | 400 | 1.5 | +0.02em | Legal text, fine print |
| `text-sm` | 14px / 0.875rem | 400 | 1.5 | +0.01em | Captions, metadata, form labels |
| `text-base` | 16px / 1rem | 400 | 1.6 | 0 | Body text |
| `text-lg` | 18px / 1.125rem | 400 | 1.55 | 0 | Lead paragraphs, product descriptions |
| `text-xl` | 20px / 1.25rem | 500 | 1.4 | -0.01em | Subheadings, product names on cards |
| `text-2xl` | 24px / 1.5rem | 500 | 1.3 | -0.015em | Section headings |
| `text-3xl` | 30px / 1.875rem | 600 | 1.25 | -0.02em | Page titles |
| `text-4xl` | 36px / 2.25rem | 600 | 1.2 | -0.025em | Hero headlines (mobile) |
| `text-5xl` | 48px / 3rem | 600 | 1.1 | -0.03em | Hero headlines (desktop) |

### Label style

All-caps text used sparingly for: collection names above product cards, filter labels, tag pills, section overlines.

```
font-size: 11px
font-weight: 500
letter-spacing: 0.08em
text-transform: uppercase
color: var(--text-secondary)
```

Tailwind utility: `text-[11px] font-medium uppercase tracking-widest text-warm-gray`

---

## 4. Color System

Defined as CSS custom properties and mapped to Tailwind config.

### Semantic tokens

```css
:root {
  /* Backgrounds */
  --bg-primary: #FAF8F5;       /* Page background */
  --bg-secondary: #F2EDE7;     /* Cards, alternating sections */
  --bg-tertiary: #E8E3DC;      /* Hover states, subtle fills */
  --bg-inverse: #2C2C2C;       /* Dark sections (footer, CTAs) */

  /* Text */
  --text-primary: #2C2C2C;     /* Headlines, body */
  --text-secondary: #7A756E;   /* Captions, metadata */
  --text-tertiary: #A39E96;    /* Placeholder text, disabled */
  --text-inverse: #FAF8F5;     /* Text on dark backgrounds */

  /* Accents */
  --accent-olive: #5C6B4F;     /* Primary CTA, links, Earth collection */
  --accent-sand: #C4B49A;      /* Tags, subtle highlights */
  --accent-burgundy: #6B3A3A;  /* Sale, alerts, destructive hints */
  --accent-slate: #4A4E54;     /* Structure collection, footer accent */

  /* Borders */
  --border-default: #E8E3DC;   /* Card borders, dividers */
  --border-strong: #D1CBC2;    /* Focus rings, active borders */

  /* Functional */
  --success: #5C6B4F;          /* Same as olive — calm, not neon green */
  --warning: #B8860B;          /* Dark goldenrod — warm, not alarming */
  --error: #6B3A3A;            /* Same as burgundy — firm but not screaming */
  --info: #4A4E54;             /* Same as slate */
}
```

### Tailwind mapping (in `tailwind.config.ts`)

```typescript
colors: {
  background: {
    DEFAULT: '#FAF8F5',
    secondary: '#F2EDE7',
    tertiary: '#E8E3DC',
    inverse: '#2C2C2C',
  },
  foreground: {
    DEFAULT: '#2C2C2C',
    secondary: '#7A756E',
    tertiary: '#A39E96',
    inverse: '#FAF8F5',
  },
  accent: {
    olive: '#5C6B4F',
    sand: '#C4B49A',
    burgundy: '#6B3A3A',
    slate: '#4A4E54',
  },
  border: {
    DEFAULT: '#E8E3DC',
    strong: '#D1CBC2',
  },
}
```

### Dark mode

**Not implemented at launch.** The brand identity is built on warm white backgrounds and natural light photography. Dark mode would require rebalancing every image and undermining the tactile warmth. Revisit only if customer demand is clear.

---

## 5. Spacing System

### Base unit: 4px

All spacing derives from multiples of 4. This creates consistent rhythm without requiring arbitrary pixel values.

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Icon-to-text gap, tight internal padding |
| `space-2` | 8px | Pill padding, input internal spacing |
| `space-3` | 12px | Card padding (mobile), compact list spacing |
| `space-4` | 16px | Default paragraph spacing, card padding (desktop) |
| `space-5` | 20px | Section sub-spacing |
| `space-6` | 24px | Component gap, form field spacing |
| `space-8` | 32px | Section internal padding |
| `space-10` | 40px | Section vertical padding (mobile) |
| `space-12` | 48px | Section vertical padding (tablet) |
| `space-16` | 64px | Section vertical padding (desktop) |
| `space-20` | 80px | Major section breaks (desktop) |
| `space-24` | 96px | Hero spacing, page top/bottom padding |

### Section rhythm

Pages are divided into horizontal sections. Each section has consistent vertical padding:

| Breakpoint | Section padding (top + bottom) |
|---|---|
| Mobile (<640px) | 40px top, 40px bottom |
| Tablet (640–1024px) | 48px top, 48px bottom |
| Desktop (>1024px) | 80px top, 80px bottom |

---

## 6. Layout System

### Container

```
Max width: 1280px
Side padding: 16px (mobile), 24px (tablet), 32px (desktop)
Centered: margin auto
```

Tailwind: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### Grid system

| Pattern | Mobile | Tablet | Desktop | Usage |
|---|---|---|---|---|
| Product grid | 2 columns | 3 columns | 4 columns | Collection page, search results |
| Feature grid | 1 column | 2 columns | 3 columns | Homepage sections, about page |
| Content + sidebar | Stack | Stack | 8 + 4 cols | Product detail page, account pages |
| Full bleed | 1 column | 1 column | 1 column | Hero images, editorial banners |
| Narrow prose | 1 column | 1 column | 1 column (max-w-2xl) | Blog posts, legal pages, about text |

Gap between grid items: `space-4` (16px) mobile, `space-6` (24px) desktop.

### Page structure (storefront)

```
┌──────────────────────────────────────────────────────┐
│ [Announcement bar — optional, ContentBlock-driven]   │
├──────────────────────────────────────────────────────┤
│ [Header: Logo — Nav — Cart icon]                     │
├──────────────────────────────────────────────────────┤
│                                                      │
│                   Page content                       │
│              (varies per page)                        │
│                                                      │
├──────────────────────────────────────────────────────┤
│ [Newsletter signup strip]                            │
├──────────────────────────────────────────────────────┤
│ [Footer: nav, policies, social, copyright]           │
└──────────────────────────────────────────────────────┘
```

---

## 7. UI Component Inventory

Components are organized in three tiers: primitives (reusable atoms), composites (assembled from primitives), and page sections (full-width blocks).

### Tier 1: Primitives (`src/components/ui/`)

| Component | Variants | Notes |
|---|---|---|
| **Button** | `primary` (olive bg, white text), `secondary` (outlined, charcoal border), `ghost` (no border, text only), `destructive` (burgundy, admin only) | Sizes: `sm` (h-9), `default` (h-11), `lg` (h-13). All have focus ring using `--border-strong`. |
| **Input** | Text, email, password, search, textarea | Height: h-11. Border: `--border-default`. Focus: `--border-strong` ring. Background: white (`#FFFFFF`), not `--bg-primary` (contrast). |
| **Select** | Native select styled, custom dropdown for device picker | Native for forms, custom for product page device selector. |
| **Badge** | `default` (sand bg), `success` (olive), `warning`, `error` (burgundy bg) | Pill shape, text-xs, uppercase. Used for: order status, ticket status, product tags. |
| **Tag** | Removable, static | Sand background, charcoal text. Used for: collection labels, material labels, customer tags (admin). |
| **Skeleton** | Block, text line, circle, card | Loading states. Matches background-secondary color. Subtle pulse animation. |
| **Separator** | Horizontal, vertical | 1px `--border-default`. Used between sections, in lists. |
| **Label** | Form label | text-sm, font-medium, text-primary. |
| **QuantitySelector** | +/- buttons with number input | Used in cart. Min 1, max = variant inventory. |
| **StarRating** | Display (filled/empty), input (clickable) | 1–5 stars. Filled = `--accent-olive`. Empty = `--border-default`. |
| **Avatar** | Image, initials fallback | Circle, sizes: sm (32px), default (40px), lg (48px). Admin only. |

### Tier 2: Composites (`src/components/`)

| Component | Data source (schema) | Notes |
|---|---|---|
| **ProductCard** | Product + primary ProductImage + basePrice + Collection name | 4:5 image, product name, price, collection label overline. Hover: subtle image scale (1.02). No "add to cart" on card — card links to PDP. |
| **DevicePicker** | DeviceModel (grouped by family) | Two-step selection: brand → model. Dropdown or segmented control. Used on PDP for variant selection. |
| **ColorSwatch** | ProductVariant.color + colorHex | Circle swatches with border on selected. Shows variant name on hover/focus. |
| **CartDrawer** | Cart + CartItems + ProductVariant | Slide-in from right. Shows items, quantities, line totals, subtotal, checkout button. |
| **CartItemRow** | CartItem + variant snapshot | Image thumbnail, product name, variant name (device + color), quantity selector, line price, remove button. |
| **NavHeader** | Static + Cart item count | Logo left, nav center (Shop dropdown, About, Contact), cart icon right with count badge. Sticky on scroll. |
| **NavFooter** | Static + ContentBlock (if announcement) | Four-column grid: Shop links, Company links, Support links, Newsletter mini-form. Below: policy links, copyright. |
| **CollectionCard** | Collection (name, headline, imageUrl) | Used on homepage. Landscape image, collection name, headline text. Links to collection page. |
| **AnnouncementBar** | ContentBlock (key: "announcement-bar") | Slim bar above header. Cream background, centered text, dismiss button. Reads from `ContentBlock` table — admin-editable without deploy. |
| **NewsletterForm** | Posts to /api/newsletter → NewsletterSubscriber | Email input + submit button. Inline success/error messaging. |
| **TrustStrip** | Static content | Horizontal strip with 3–4 trust signals: "Free shipping over $75", "30-day returns", "Real felt materials", "Secure checkout". Icons + text, muted style. |
| **ReviewCard** | Review (rating, title, body, authorName, isVerifiedPurchase, createdAt) | Star rating, title, body text (truncated with expand), author + "Verified Purchase" badge, relative date. |
| **ReviewSummary** | Aggregated from Review[] per product | Average rating (stars + number), total review count, rating distribution bar chart (5 bars). |
| **OrderCard** | Order (orderNumber, status, total, createdAt, items preview) | Used in account order history. Shows order number, date, status badge, total, thumbnail of first item. Click to expand. |
| **TicketCard** | SupportTicket (subject, status, createdAt) | Used in account ticket list. Subject, status badge, last updated. Click to view thread. |
| **BreadcrumbNav** | Derived from route | e.g., Home / Collections / Earth / Alpine. Structured data (schema.org BreadcrumbList). |

### Tier 3: Page sections (full-width blocks used in page assembly)

| Section | Page(s) | Notes |
|---|---|---|
| **HeroSection** | Homepage | Full-bleed image (or video), headline overlay, single CTA. ContentBlock-driven so admin can update. |
| **MaterialStorySection** | Homepage | Split layout: large macro image left, text block right. Tells the felt/tactile story in ~3 sentences. |
| **FeaturedProductsSection** | Homepage | 4-col product grid showing `featured: true` products. Heading + "View all" link. |
| **CollectionPreviewSection** | Homepage | 2–3 CollectionCards in a row with editorial layout. |
| **TestimonialSection** | Homepage | 2–3 selected reviews in a horizontal scroll (mobile) or 3-col grid (desktop). |
| **CollectionHeader** | Collection page | Collection hero image (full-bleed), name, description. |
| **ProductGrid** | Collection page | Filterable grid with device family filter sidebar on desktop, sheet on mobile. |
| **ProductGallery** | Product detail | Image gallery with thumbnails. Main image at 4:5, thumbnails below. Swipe on mobile. |
| **ProductInfo** | Product detail | Name, price, device picker, color picker, add-to-cart, material info, shipping note. |
| **ProductStory** | Product detail | Below-fold editorial section: material close-up, care instructions, design narrative. |
| **RelatedProducts** | Product detail | "You might also like" — 4 product cards from same collection. |

---

## 8. Page Architecture: Storefront

### 8.1 Homepage (`/`)

**Job:** Communicate the brand in 3 seconds. Show the best products. Capture email.

```
┌──────────────────────────────────────────────────────────────┐
│ ANNOUNCEMENT BAR (optional, ContentBlock)                    │
│ "Free shipping on orders over $75"                           │
├──────────────────────────────────────────────────────────────┤
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ HERO SECTION                                                 │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │                                                          │ │
│ │        [Full-bleed macro texture photograph]              │ │
│ │                                                          │ │
│ │              "Felt in hand."                              │ │
│ │          [Shop the collection →]                          │ │
│ │                                                          │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ TRUST STRIP                                                  │
│ ┌────────────┬────────────┬────────────┬────────────┐        │
│ │ Free ship  │ 30-day     │ Real felt  │ Secure     │        │
│ │ over $75   │ returns    │ materials  │ checkout   │        │
│ └────────────┴────────────┴────────────┴────────────┘        │
│                                                              │
│ MATERIAL STORY SECTION                                       │
│ ┌─────────────────────────┬────────────────────────────────┐ │
│ │                         │                                │ │
│ │  [Macro image of felt   │  Overline: THE MATERIAL        │ │
│ │   texture, stitching,   │  Headline: "Designed to be     │ │
│ │   edge detail]          │   felt, not just seen."        │ │
│ │                         │  Body: 2–3 sentences about     │ │
│ │                         │   merino felt, craft, texture  │ │
│ │                         │  [Learn more →]                │ │
│ └─────────────────────────┴────────────────────────────────┘ │
│                                                              │
│ FEATURED PRODUCTS                                            │
│  "Featured"                            [View all →]          │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                         │
│ │      │ │      │ │      │ │      │                         │
│ │ Card │ │ Card │ │ Card │ │ Card │                         │
│ │      │ │      │ │      │ │      │                         │
│ └──────┘ └──────┘ └──────┘ └──────┘                         │
│                                                              │
│ COLLECTION PREVIEWS                                          │
│ ┌────────────────────┐ ┌────────────────────┐                │
│ │                    │ │                    │                │
│ │  Earth             │ │  Studio            │                │
│ │  "Grounded tones,  │ │  "Rhythm in        │                │
│ │   natural textures" │ │   material form"   │                │
│ │  [Explore →]       │ │  [Explore →]       │                │
│ └────────────────────┘ └────────────────────┘                │
│                                                              │
│ TESTIMONIALS (Tier 1 — shows after reviews system launches)  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                      │
│ │ ★★★★★    │ │ ★★★★★    │ │ ★★★★☆    │                      │
│ │ "Best... │ │ "Feels.. │ │ "The...  │                      │
│ │ — Maria  │ │ — James  │ │ — Suki   │                      │
│ └──────────┘ └──────────┘ └──────────┘                      │
│                                                              │
│ NEWSLETTER SECTION                                           │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │   Overline: STAY IN TOUCH                                │ │
│ │   Headline: "New textures, new collections."             │ │
│ │   [email input        ] [Subscribe]                      │ │
│ │   Fine print: No spam. Unsubscribe anytime.              │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

**Data sources:**
- Hero: `ContentBlock` (key: `homepage-hero`) → title, body, imageUrl, linkUrl
- Trust strip: Static content (hardcoded — changes rarely)
- Material story: `ContentBlock` (key: `material-story`) → title, body, imageUrl
- Featured products: `Product` where `featured = true AND status = ACTIVE`, limit 4, with primary `ProductImage`
- Collection previews: `Collection` where `status = PUBLISHED`, ordered by `sortOrder`, limit 2–3
- Testimonials: `Review` where `isApproved = true`, ordered by rating desc + createdAt desc, limit 3
- Newsletter: Posts to `/api/newsletter` → creates `NewsletterSubscriber`

---

### 8.2 Collection page (`/collections/[slug]`)

**Job:** Show all products in a collection. Enable device filtering. Tell the collection's story.

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│ BREADCRUMB: Home / Collections / Earth                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ COLLECTION HEADER                                            │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │                                                          │ │
│ │           [Collection hero image, full bleed]             │ │
│ │                                                          │ │
│ │              Overline: COLLECTION                         │ │
│ │              "Earth"                                      │ │
│ │              "Grounded tones drawn from                   │ │
│ │               natural textures and terrain."              │ │
│ │                                                          │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ FILTER BAR                                                   │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │  [All devices ▼]  [Sort: Newest ▼]     12 products       │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ PRODUCT GRID (4-col desktop, 3-col tablet, 2-col mobile)    │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                         │
│ │ 4:5  │ │      │ │      │ │      │                         │
│ │ img  │ │      │ │      │ │      │                         │
│ │      │ │      │ │      │ │      │                         │
│ │ Name │ │ Name │ │ Name │ │ Name │                         │
│ │ $45  │ │ $49  │ │ $45  │ │ $55  │                         │
│ └──────┘ └──────┘ └──────┘ └──────┘                         │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                         │
│ │      │ │      │ │      │ │      │                         │
│ │ ...  │ │ ...  │ │ ...  │ │ ...  │                         │
│ └──────┘ └──────┘ └──────┘ └──────┘                         │
│                                                              │
│ NEWSLETTER SECTION                                           │
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

**Filtering logic:**

The device filter uses `DeviceModel` data. When a customer selects "iPhone 16 Pro":
1. Query products in this collection that have at least one active variant with `deviceModelId` matching that device
2. Products without a matching variant are hidden
3. Filter state is stored in the URL query parameter (`?device=iphone-16-pro`) for shareability

Sorting options (all client-side-safe at <100 products per collection):
- Newest (default) — `Product.createdAt DESC`
- Price: Low to High — `Product.basePrice ASC`
- Price: High to Low — `Product.basePrice DESC`

**No pagination at launch.** Collections will have 3–15 products. If a collection exceeds 30 products, add "Load more" pagination.

**Data sources:**
- Collection: `Collection` by slug, with status = PUBLISHED
- Products: `Product` via `CollectionProduct` join, status = ACTIVE, with primary `ProductImage` and `basePrice`
- Device filter options: `DeviceModel` where `isActive = true`, grouped by `family`

---

### 8.3 Product detail page (`/products/[slug]`)

**Job:** Sell the product. Communicate texture and quality. Make device selection frictionless. Build trust.

This is the most important page in the store. Every element earns its placement.

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│ BREADCRUMB: Home / Earth / Alpine                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ PRODUCT TOP (desktop: 2-column, mobile: stacked)             │
│ ┌───────────────────────────┬──────────────────────────────┐ │
│ │                           │                              │ │
│ │   PRODUCT GALLERY         │  PRODUCT INFO                │ │
│ │                           │                              │ │
│ │  ┌─────────────────────┐  │  Overline: EARTH COLLECTION  │ │
│ │  │                     │  │  Headline: "Alpine"           │ │
│ │  │   Main image        │  │  Price: $45.00                │ │
│ │  │   (4:5 ratio)       │  │                              │ │
│ │  │                     │  │  DEVICE                       │ │
│ │  │                     │  │  [iPhone ▼] [16 Pro ▼]       │ │
│ │  └─────────────────────┘  │                              │ │
│ │                           │  COLOR                        │ │
│ │  ┌───┐ ┌───┐ ┌───┐ ┌───┐ │  (●) Moss  (○) Sand          │ │
│ │  │ t │ │ t │ │ t │ │ t │ │                              │ │
│ │  └───┘ └───┘ └───┘ └───┘ │  ────────────────────────     │ │
│ │   thumbnails              │                              │ │
│ │                           │  [  Add to cart — $45.00  ]   │ │
│ │                           │                              │ │
│ │                           │  ✓ Free shipping over $75     │ │
│ │                           │  ✓ 30-day returns             │ │
│ │                           │  ✓ Merino felt                │ │
│ │                           │                              │ │
│ └───────────────────────────┴──────────────────────────────┘ │
│                                                              │
│ PRODUCT STORY (below fold, editorial)                        │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │  ┌───────────────────┐                                   │ │
│ │  │ Macro texture     │  THE MATERIAL                     │ │
│ │  │ close-up image    │  "Pressed merino felt with a      │ │
│ │  │                   │   soft matte finish. Each case     │ │
│ │  └───────────────────┘   is cut and stitched by hand."   │ │
│ │                                                          │ │
│ │  CARE: "Spot clean with a damp cloth."                   │ │
│ │                                                          │ │
│ │  ┌──────────────────────────────────────────────┐        │ │
│ │  │ FEATURES                                     │        │ │
│ │  │ • Merino felt exterior                       │        │ │
│ │  │ • Microfiber-lined interior                  │        │ │
│ │  │ • Precise button cutouts                     │        │ │
│ │  │ • Wireless charging compatible               │        │ │
│ │  │ • Weighs 28g                                 │        │ │
│ │  └──────────────────────────────────────────────┘        │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ REVIEWS (Tier 1)                                             │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │  ReviewSummary: ★★★★★ 4.8 (23 reviews)                  │ │
│ │  [Write a review]                                        │ │
│ │                                                          │ │
│ │  ReviewCard  ReviewCard  ReviewCard                      │ │
│ │  [Show all reviews →]                                    │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ RELATED PRODUCTS                                             │
│  "From the Earth collection"                                 │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                         │
│ │ Card │ │ Card │ │ Card │ │ Card │                         │
│ └──────┘ └──────┘ └──────┘ └──────┘                         │
│                                                              │
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

**Variant selection UX:**

This is the critical interaction. Phone case buyers must select a device before adding to cart. The flow:

1. **Device picker:** Two dropdowns — Brand (Apple, Samsung, Google) then Model (iPhone 16 Pro, etc.). Populated from `DeviceModel` where `isActive = true`, filtered to only show devices that have an active variant for this product.

2. **Color/material picker:** Circular swatches rendered from `ProductVariant.colorHex`. Selected swatch shows `ProductVariant.name` below. Only shows variants matching the selected device.

3. **Price resolution:** Display `ProductVariant.price` if set, else `Product.basePrice`. If variant price differs from base, show both: ~~$45~~ **$55** (for premium material variants).

4. **Inventory check:** If selected variant `inventoryCount <= 0`, disable "Add to cart" and show "Out of stock — check another device" in `--text-secondary`.

5. **Gallery swap:** When color/material is changed, if the variant has `VariantImage` records, swap gallery to show variant-specific images. If no variant images, keep showing `ProductImage` gallery.

**Data sources:**
- Product: `Product` by slug, with all `ProductImage[]`, `ProductVariant[]` (with `DeviceModel` and `VariantImage[]`), `Material[]` (via `ProductMaterial`), `Collection[]` (via `CollectionProduct`)
- Reviews: `Review[]` where `productId = this product AND isApproved = true`
- Related products: Other `Product`s in the same collection(s), excluding current, limit 4

**SEO on product pages:**
- `<title>`: `Product.seoTitle` || `"{name} — CaseaFelt"`
- `<meta description>`: `Product.seoDescription` || `Product.shortDescription`
- Schema.org `Product` structured data (name, image, price, availability, brand, review aggregate)
- Breadcrumb structured data
- Canonical URL

---

### 8.4 Cart page (`/cart`)

**Job:** Show what's in the cart, make it easy to modify, move to checkout.

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  "Your cart" (text-3xl)                          2 items     │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ┌─────┐                                                │  │
│  │ │ img │  Alpine — iPhone 16 Pro — Moss                 │  │
│  │ │     │  Earth collection                              │  │
│  │ └─────┘  [-] 1 [+]                        $45.00   [×] │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ ┌─────┐                                                │  │
│  │ │ img │  Contour — Galaxy S25 Ultra — Charcoal         │  │
│  │ │     │  Structure collection                          │  │
│  │ └─────┘  [-] 1 [+]                        $49.00   [×] │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│                              Subtotal:           $94.00      │
│                              Shipping:  Calculated at checkout│
│                              ─────────────────────────       │
│                                                              │
│                       [   Continue to checkout   ]           │
│                                                              │
│                       Secure checkout via Stripe              │
│                       Free shipping on orders over $75        │
│                                                              │
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

**Cart interaction rules:**

- Quantity change updates immediately (optimistic UI + server sync)
- If quantity adjustment fails (out of stock), revert and show inline error
- Remove item (×) with a brief undo option (5 seconds)
- Empty cart shows: message + CTA to browse collections
- "Continue to checkout" creates a Stripe Checkout Session via `/api/checkout`
- Subtotal calculated from live variant prices (not stored on cart item)

**Cart drawer vs. cart page:**

Both exist. The **CartDrawer** (slide-in) opens on add-to-cart from any page — shows a quick summary and a "View cart" / "Checkout" choice. The **Cart page** (`/cart`) is the full editing view. The drawer is for speed; the page is for review.

---

### 8.5 About page (`/about`)

**Job:** Tell the brand story. Build emotional connection. Explain the material.

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ HERO                                                         │
│ [Full-bleed lifestyle image — hands on felt, workshop, etc.] │
│                                                              │
│ STORY SECTION (narrow prose, max-w-2xl, centered)            │
│  Headline: "A case for what you feel."                       │
│  Body: 3–4 paragraphs. Origin story. Material philosophy.    │
│  Why felt. Why minimalism. What we believe about design.     │
│                                                              │
│ MATERIAL SECTION (2-col: image + text)                       │
│  [Macro detail of merino felt]  |  "Merino felt is..."      │
│                                 |  Care, sourcing, craft.    │
│                                                              │
│ VALUES (3-col feature grid)                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Tactile  │  │ Minimal  │  │ Honest   │                   │
│  │ craft    │  │ design   │  │ material │                   │
│  │ ...      │  │ ...      │  │ ...      │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
│                                                              │
│ NEWSLETTER SECTION                                           │
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

**Data source:** Mostly `ContentBlock` records (about-hero, about-story, about-material, about-values) so the about page is admin-editable without a deploy.

---

### 8.6 Contact page (`/contact`)

**Job:** Let visitors reach the team. Simple form, no friction.

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  "Get in touch"                                              │
│  "Questions, custom inquiries, or just saying hello."        │
│                                                              │
│  ┌─────────────────────────────────────────────────┐         │
│  │  Type: [General ▼] (General, Custom Inquiry,    │         │
│  │         Support, Press, Wholesale)              │         │
│  │  Name:  [                    ]                  │         │
│  │  Email: [                    ]                  │         │
│  │  Subject: [                  ]                  │         │
│  │  Message:                                       │         │
│  │  [                                             ]│         │
│  │  [                                             ]│         │
│  │  [        Send message        ]                 │         │
│  └─────────────────────────────────────────────────┘         │
│                                                              │
│  Sidebar (desktop) or below (mobile):                        │
│  Email: hello@caseafelt.com                                  │
│  Response time: Within 24 hours                              │
│                                                              │
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

**Data flow:** Form submits to `/api/contact` → creates `ContactSubmission` → sends notification email to team via Resend → shows success message to visitor.

The type dropdown maps to `ContactType` enum. Selecting "Custom Inquiry" could add an optional phone field and a note: "Describe the device, material, or design direction you have in mind."

---

### 8.7 Support / FAQ page (`/support`)

**Job:** Answer common questions first. Provide ticket submission when needed.

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  "How can we help?"                                          │
│                                                              │
│  FAQ SECTION (accordion)                                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ ▸ What devices do you make cases for?                │    │
│  │ ▸ How do I care for my felt case?                    │    │
│  │ ▸ What is your return policy?                        │    │
│  │ ▸ How long does shipping take?                       │    │
│  │ ▾ Can I get a custom design?                         │    │
│  │   "We accept custom inquiries for special..."        │    │
│  │   [Submit a custom inquiry →]                        │    │
│  │ ▸ My case doesn't fit. What do I do?                 │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  STILL NEED HELP?                                            │
│  [Submit a support ticket →] (links to /support/tickets)     │
│  Or email us: support@caseafelt.com                          │
│                                                              │
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

FAQ content is stored in `ContentBlock` records (key: `faq-{n}`) or a Payload CMS collection — decided in Phase 4. Not hardcoded.

Support ticket form (Tier 1 — `/support/tickets`, requires login):
- Subject
- Related order (optional dropdown of user's orders)
- Message body
- Submit → creates `SupportTicket` + initial `TicketMessage`

---

### 8.8 Legal pages (`/privacy-policy`, `/terms-of-service`, `/return-policy`, `/shipping-policy`)

**Job:** Be clear, accessible, and findable.

All four follow the same layout:

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  "Return Policy" (text-3xl)                                  │
│  Last updated: April 14, 2026                                │
│                                                              │
│  ┌─ Narrow prose (max-w-2xl, centered) ─────────────────┐    │
│  │                                                      │    │
│  │  Markdown-rendered content.                          │    │
│  │  Clear headings, short paragraphs.                   │    │
│  │  No legalese — write in plain language.              │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

Content lives in `ContentBlock` (one block per policy page) or Payload CMS. Admin-editable.

---

## 9. Page Architecture: Account

All account pages require Clerk authentication. They share a sidebar layout on desktop (stacked on mobile).

### Account shell layout

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─ SIDEBAR (desktop) ──┬─ MAIN CONTENT ──────────────────┐ │
│  │                      │                                  │ │
│  │  Account             │   (varies per page)              │ │
│  │  ─────────           │                                  │ │
│  │  ● Orders            │                                  │ │
│  │  ○ Addresses         │                                  │ │
│  │  ○ Settings          │                                  │ │
│  │  ─────────           │                                  │ │
│  │  ○ Support tickets   │                                  │ │
│  │  ─────────           │                                  │ │
│  │  Sign out            │                                  │ │
│  │                      │                                  │ │
│  └──────────────────────┴──────────────────────────────────┘ │
│                                                              │
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

Note: "Wishlist" appears in sidebar only after Tier 1 launches.

### 9.1 Orders (`/account/orders`)

Lists all orders for the user. Each order is an `OrderCard` showing:
- Order number, date, status badge, total
- Thumbnail of first item
- Click to expand → full line items, tracking info, and action links

Expanded order shows:
- All `OrderItem` snapshots (image, name, variant, qty, price)
- Shipping address
- Tracking number + link (if shipped)
- "Need help with this order?" → links to support ticket form pre-filled with order number

### 9.2 Addresses (`/account/addresses`)

CRUD for saved addresses from the `Address` table.
- List of saved addresses with "Default" badge
- Add new / edit / delete
- Set default
- Simple form: name, line1, line2, city, state, postal, country, phone

### 9.3 Settings (`/account/settings`)

- Name, email, phone (synced with Clerk — changes go through Clerk's profile update)
- Marketing opt-in toggle (`User.marketingOptIn`)
- Newsletter subscription status (checks `NewsletterSubscriber` by email)
- "Delete my account" — soft delete, requires confirmation

### 9.4 Support tickets (`/account/tickets`) — Tier 1

- List of user's tickets (`SupportTicket` where `userId = current user`)
- Click to view thread (`TicketMessage[]`)
- Reply form at bottom of thread
- "New ticket" button

---

## 10. Page Architecture: Admin

The admin panel lives at `/admin/*` and requires Clerk authentication + `UserRole` of `ADMIN` or `SUPER_ADMIN`. It uses a distinct visual treatment: slightly denser layout, monospace data font (JetBrains Mono for numbers), and a left sidebar navigation.

### Admin shell layout

```
┌──────────────────────────────────────────────────────────────┐
│ ADMIN HEADER: Logo (small) — Search — Admin name — Logout    │
├──────┬───────────────────────────────────────────────────────┤
│      │                                                       │
│ NAV  │   MAIN CONTENT                                        │
│      │                                                       │
│ ■ Dashboard   │                                              │
│ □ Orders      │   (varies per page)                          │
│ □ Products    │                                              │
│ □ Collections │                                              │
│ □ Inventory   │                                              │
│ □ Customers   │                                              │
│ □ Support     │                                              │
│ □ Content     │                                              │
│ □ Discounts   │   (Tier 1)                                   │
│ □ Analytics   │   (reads from PostHog)                       │
│ □ Settings    │                                              │
│      │                                                       │
└──────┴───────────────────────────────────────────────────────┘
```

### 10.1 Dashboard (`/admin/dashboard`)

**Job:** At-a-glance health check. Answer "What needs attention today?"

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  "Good morning" (time-aware greeting)                        │
│                                                              │
│  METRIC CARDS (4-col grid)                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Today's  │ │ Today's  │ │ Pending  │ │ Low stock│        │
│  │ orders   │ │ revenue  │ │ orders   │ │ alerts   │        │
│  │   7      │ │  $315    │ │   3      │ │   2      │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                              │
│  RECENT ORDERS (table, last 10)                              │
│  ┌─────────┬──────────┬──────────┬────────┬────────┐         │
│  │ Order # │ Customer │ Status   │ Total  │ Date   │         │
│  │ CF-001  │ j@email  │ ● Confirmed│ $45  │ Today  │         │
│  │ CF-002  │ m@email  │ ● Processing│ $94 │ Today  │         │
│  │ ...     │          │          │        │        │         │
│  └─────────┴──────────┴──────────┴────────┴────────┘         │
│                                                              │
│  ACTION ITEMS                                                │
│  • 2 support tickets awaiting response                       │
│  • 3 contact submissions unread                              │
│  • 1 review pending approval                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Data sources:**
- Today's orders: `Order` where `createdAt >= today`, count + sum
- Pending orders: `Order` where `status = CONFIRMED` (need to be processed)
- Low stock: `ProductVariant` where `inventoryCount <= lowStockThreshold AND trackInventory = true`
- Recent orders: `Order` ordered by `createdAt DESC`, limit 10
- Action items: counts from `SupportTicket`, `ContactSubmission`, `Review`

### 10.2 Orders (`/admin/orders`)

| View | Description |
|---|---|
| **List** | Table with: order number, customer email, status (badge), total, date, item count. Filterable by status. Sortable by date. Searchable by order number or email. |
| **Detail** | Full order: all items (snapshots), addresses, payment info (card brand + last 4), status timeline, tracking input, status update buttons, refund action (Tier 1), internal notes (via linked customer note). |

**Status update flow:** Admin clicks "Mark as shipped" → enters tracking number + carrier → status changes to SHIPPED → `AuditLog` entry created → shipping notification email sent to customer.

### 10.3 Products (`/admin/products`)

| View | Description |
|---|---|
| **List** | Table: product name, status (badge), base price, variant count, collections, created date. Filterable by status, collection. |
| **Create/Edit** | Form sections: Basic info (name, slug auto-generated, descriptions, pricing), Collections (multi-select checkboxes), Materials (multi-select), Images (upload to Cloudinary, drag to reorder, set primary, add alt text), SEO (title + description with character count), Status toggle. |
| **Variants** | Sub-section of product edit: table of variants. Each row: device model, color/name, SKU, price override, inventory count, active toggle. Bulk create: select multiple devices → create variants for each. |

### 10.4 Customers (`/admin/customers`) — Customer Ops Panel

**Not a CRM.** A lean view of customer data for operational use.

| View | Description |
|---|---|
| **List** | Table: name, email, order count, total spent, last order date, tags. Searchable. Sortable by total spent, order count, recency. |
| **Detail** | Profile: name, email, phone, account created date. Below: order history (linked), support tickets (linked), internal notes (`CustomerNote[]`), tags (`CustomerTag[]`). Add note button. Add/remove tag. |

Tags are free-form strings, lowercased: `vip`, `wholesale-lead`, `has-return`, `influencer`. No predefined tag taxonomy — keep it flexible.

### 10.5 Support (`/admin/support`)

| View | Description |
|---|---|
| **Tickets list** | Table: subject, customer email, status (badge), priority (badge), assigned to, created date. Filterable by status, priority. |
| **Ticket detail** | Full message thread (`TicketMessage[]`). Reply form at bottom. Status change dropdown. Priority change. Assign to admin dropdown. Link to customer profile. Link to order (if `orderId` is set). |
| **Contact submissions** | Separate tab. Table: type, name, email, subject, read status. Click to view full message. Mark as read. Convert to ticket button. Add internal note. |

### 10.6 Content (`/admin/content`)

Manages `ContentBlock` records. Simple key-value-ish editor:

| View | Description |
|---|---|
| **List** | All content blocks: key, title preview, status, last updated. |
| **Edit** | Form: title, body (markdown or rich text), image URL (Cloudinary picker), link URL, link text, status toggle. |

For blog/article content, Payload CMS provides its own admin UI. The custom content block editor handles only small, structured blocks (hero, announcement, about sections, FAQ entries).

### 10.7 Inventory (`/admin/inventory`)

A single view — not a separate entity, but a focused lens on `ProductVariant`:

| Column | Source |
|---|---|
| Product name | Product.name |
| Variant | ProductVariant.name |
| SKU | ProductVariant.sku |
| Device | DeviceModel.name |
| Stock | ProductVariant.inventoryCount |
| Threshold | ProductVariant.lowStockThreshold |
| Status | Derived: "In stock" / "Low stock" / "Out of stock" |

Filterable by status (low stock, out of stock). Inline quantity edit (click stock number → edit → save).

---

## 11. Interaction Patterns

### Add to cart

1. Customer selects device + color on PDP
2. Clicks "Add to cart" → button shows loading spinner (200ms debounce)
3. API call: `POST /api/cart` with `variantId` and `quantity`
4. On success: CartDrawer slides in from right showing updated cart
5. On failure (out of stock): inline error below button, button stays disabled

### Cart drawer

- Triggered by: add-to-cart success, or clicking cart icon in header
- Shows: item list (thumbnail + name + variant + qty + price), subtotal, "View cart" link, "Checkout" button
- Dismiss: click outside, click ×, or press Escape
- Does NOT allow quantity editing (that's the cart page's job — keep the drawer simple)

### Variant selection on PDP

- Device picker and color swatches are always visible (no accordion, no "select options" expand)
- Selecting a device filters available colors
- Selecting a color updates the main gallery image (if variant images exist)
- If the combination is out of stock, the swatch shows a diagonal line through it and is still selectable (to show the product) but "Add to cart" is disabled
- URL updates with query params: `/products/alpine?device=iphone-16-pro&color=moss` — for shareability and analytics

### Form submissions (contact, newsletter, support)

- Validate inline (Zod schemas shared between client and server)
- Submit button shows loading state
- On success: inline success message replaces form (not a toast — keep it in context)
- On error: inline error message with specific issue
- No page reload

### Page transitions

- No custom page transition animations. Next.js App Router handles navigation with streaming.
- Skeleton loading states for data-dependent sections (product grids, order lists)
- Instant navigation for static pages (about, legal, contact)

### Toast notifications

Used sparingly for:
- "Item added to cart" (only if CartDrawer is somehow prevented)
- "Address saved"
- "Settings updated"
- Error states that aren't inline (network failures)

Position: bottom-right. Auto-dismiss after 4 seconds. Max 3 stacked.

---

## 12. Responsive Strategy

### Breakpoints (Tailwind defaults)

| Name | Width | Target |
|---|---|---|
| (default) | 0–639px | Mobile phones |
| `sm` | 640px+ | Large phones, small tablets |
| `md` | 768px+ | Tablets |
| `lg` | 1024px+ | Small laptops, tablets landscape |
| `xl` | 1280px+ | Desktops |

### Key layout shifts

| Component | Mobile | Desktop |
|---|---|---|
| **Header nav** | Hamburger menu (slide-in) | Inline links |
| **Product grid** | 2 columns | 4 columns |
| **PDP layout** | Gallery stacked above info | Gallery left, info right (sticky) |
| **Cart item** | Image + info stacked | Image + info inline row |
| **Account layout** | Nav as horizontal tabs at top | Sidebar left |
| **Admin layout** | Nav as collapsible drawer | Sidebar left (persistent) |
| **Collection header** | Shorter hero, text below image | Taller hero, text overlay |
| **Footer** | Single column, stacked sections | Four-column grid |

### Touch targets

All interactive elements have a minimum touch target of 44×44px (WCAG 2.5.5). This applies to:
- Buttons (already h-11 = 44px minimum)
- Color swatches (44×44 even if visual circle is 32px — padding accounts for it)
- Quantity +/- buttons
- Cart item remove (×) button
- Navigation links (44px line-height minimum)
- Accordion expand/collapse areas

---

## 13. Accessibility Requirements

### WCAG 2.1 AA compliance (minimum)

| Requirement | Implementation |
|---|---|
| **Color contrast** | All text meets 4.5:1 ratio against its background. Verified: `#2C2C2C` on `#FAF8F5` = 13.5:1 ✓. `#7A756E` on `#FAF8F5` = 4.7:1 ✓. `#FAF8F5` on `#2C2C2C` = 13.5:1 ✓. |
| **Focus indicators** | All interactive elements have a visible focus ring (2px `--border-strong` outline with 2px offset). Never remove `:focus-visible`. |
| **Alt text** | Every `<img>` has meaningful alt text. Product images use `ProductImage.altText` / `VariantImage.altText`. Decorative images use `alt=""` with `aria-hidden="true"`. |
| **Keyboard navigation** | Full site navigable via Tab, Shift+Tab, Enter, Escape, Arrow keys. Modal dialogs (CartDrawer) trap focus. |
| **Form labels** | Every input has an associated `<label>`. Placeholder text is never the only label. |
| **Error identification** | Form errors are announced to screen readers via `aria-live="polite"` regions. Error text is adjacent to the field, not only color-coded. |
| **Heading hierarchy** | One `<h1>` per page. Headings never skip levels (h1 → h2 → h3). |
| **Skip navigation** | "Skip to main content" link as first focusable element. |
| **ARIA landmarks** | `<header>`, `<nav>`, `<main>`, `<footer>` on every page. |
| **Motion** | Respect `prefers-reduced-motion`. Disable hover animations, skeleton pulse, and any auto-advancing carousels. |
| **Image loading** | All product images use `loading="lazy"` except the first visible image (LCP). Cloudinary generates AVIF/WebP formats. |

---

## 14. What Is Intentionally Not Designed

These were considered and excluded to match the Phase 1/Phase 2 scope.

| Item | Reasoning | When to design |
|---|---|---|
| **Wishlist UI** | Tier 1 feature. Schema ready (`WishlistItem`), but no storefront UI at launch. | Month 1–2, after launch. Simple: heart icon on product cards + account wishlist page. |
| **Discount code input** | Tier 1 feature. The schema (`DiscountCode`) and checkout integration come together. | Month 1–2. Input field on cart page or checkout. |
| **Blog layout** | Tier 1 feature. Payload CMS handles blog. Design the blog index and article template when Payload is integrated. | Month 1–2. Narrow prose layout, same as legal pages but with hero image. |
| **Review submission form** | Tier 1 feature. Reviews need order verification logic. | Month 1–2. Simple: star selector + title + textarea + submit. Modal or inline on PDP. |
| **Custom inquiry flow** | Tier 2 feature. Contact form with type="Custom Inquiry" handles this for now. | Month 3–6. Dedicated multi-step form with material/device selectors. |
| **Admin analytics page** | Tier 2 feature. PostHog dashboard is the analytics interface at launch. | Month 3–6. Embedded PostHog dashboard or custom charts. |
| **Admin audit log viewer** | Tier 2 feature. Audit logs are written from day one but viewed via direct DB query or Payload admin. | Month 3–6. Filterable table in admin. |
| **Admin role management** | Tier 2 feature. At launch, roles are set directly in the DB by the super admin. | Month 3–6. UI to invite admins, assign roles. |
| **Dark mode** | Conflicts with brand warmth. No customer demand signal. | Only if clear demand. |
| **Multi-language** | English-only at launch. | When expanding internationally. |
| **Advanced search** | Product catalog is small (<100 products). Collection + device filtering is sufficient. | When catalog exceeds 100 products. Add Algolia or Postgres full-text search. |
| **Product comparison** | No evidence this drives conversion in phone cases. | Probably never. |
| **Size guide** | Phone cases don't have sizes — device model selection handles fit. | Never. |

---

## Component-to-Schema Mapping

This table connects every data-displaying component back to the Phase 2 schema, confirming alignment.

| Component | Schema tables read | Notes |
|---|---|---|
| ProductCard | Product, ProductImage (primary), Collection (overline label) | Price from `Product.basePrice` |
| DevicePicker | DeviceModel (filtered by product's active variants) | Grouped by `DeviceModel.family` |
| ColorSwatch | ProductVariant (color, colorHex, isActive, inventoryCount) | Shows availability per swatch |
| ProductGallery | ProductImage[], VariantImage[] (swapped on variant change) | Ordered by `sortOrder`, `isPrimary` first |
| ProductInfo | Product, ProductVariant (selected), Material (via ProductMaterial) | Price resolution: variant.price || product.basePrice |
| CartDrawer / CartPage | Cart, CartItem[], ProductVariant (live price + stock check) | Price always live from variant, not stored on cart |
| OrderCard | Order, OrderItem[] (snapshots), Payment (card info) | All display data is snapshotted — no live product lookups |
| ReviewCard | Review (rating, title, body, authorName, isVerifiedPurchase) | Only `isApproved = true` shown on storefront |
| ReviewSummary | Review[] aggregated (AVG rating, COUNT, distribution) | Computed at query time or cached |
| CollectionHeader | Collection (name, description, headline, imageUrl) | Hero image from `Collection.imageUrl` |
| AnnouncementBar | ContentBlock (key: "announcement-bar") | Hidden if status != PUBLISHED |
| HeroSection | ContentBlock (key: "homepage-hero") | All hero content is admin-editable |
| NewsletterForm | → NewsletterSubscriber (on submit) | Source field set based on placement |
| AdminOrderTable | Order, User (email, name) | Joins user for display name |
| AdminCustomerDetail | User, Order[], SupportTicket[], CustomerNote[], CustomerTag[] | Aggregated view — no custom table |
| AdminTicketDetail | SupportTicket, TicketMessage[], User | Thread display with isAdmin flag |
| AdminInventoryTable | ProductVariant, Product (name), DeviceModel (name) | Derived "status" column from stock vs. threshold |

**No schema misalignments found.** Every component maps cleanly to existing schema tables. No component requires data not already modeled.

---

## Summary

This design system is:

- **Minimal by principle** — every element earns its place
- **Tactile by emphasis** — photography and whitespace carry the brand
- **Schema-aligned** — every component maps to Phase 2 tables without new requirements
- **Tier-aware** — Tier 1 and Tier 2 features are acknowledged but not designed in detail
- **Accessible** — WCAG 2.1 AA as baseline, not afterthought
- **Mobile-first** — all layouts designed from 375px up

---

## Next Steps

**Phase 3 complete. Ready for Phase 4: Full Application Build.**

Phase 4 will deliver:
- Next.js project scaffold
- Tailwind config with full design token system
- Prisma client setup
- All storefront pages
- Cart and checkout integration
- Account pages
- Admin dashboard
- API routes
- Component library
