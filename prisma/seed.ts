import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// Seed Data
// ─────────────────────────────────────────────────────────────

const DEVICE_MODELS = [
  // Apple — iPhone 16 family
  { brand: "Apple", name: "iPhone 16", slug: "iphone-16", family: "iPhone 16", sortOrder: 1 },
  { brand: "Apple", name: "iPhone 16 Plus", slug: "iphone-16-plus", family: "iPhone 16", sortOrder: 2 },
  { brand: "Apple", name: "iPhone 16 Pro", slug: "iphone-16-pro", family: "iPhone 16", sortOrder: 3 },
  { brand: "Apple", name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", family: "iPhone 16", sortOrder: 4 },
  // Apple — iPhone 15 family
  { brand: "Apple", name: "iPhone 15", slug: "iphone-15", family: "iPhone 15", sortOrder: 5 },
  { brand: "Apple", name: "iPhone 15 Plus", slug: "iphone-15-plus", family: "iPhone 15", sortOrder: 6 },
  { brand: "Apple", name: "iPhone 15 Pro", slug: "iphone-15-pro", family: "iPhone 15", sortOrder: 7 },
  { brand: "Apple", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", family: "iPhone 15", sortOrder: 8 },
  // Samsung — Galaxy S25 family
  { brand: "Samsung", name: "Galaxy S25", slug: "galaxy-s25", family: "Galaxy S25", sortOrder: 10 },
  { brand: "Samsung", name: "Galaxy S25+", slug: "galaxy-s25-plus", family: "Galaxy S25", sortOrder: 11 },
  { brand: "Samsung", name: "Galaxy S25 Ultra", slug: "galaxy-s25-ultra", family: "Galaxy S25", sortOrder: 12 },
  // Google — Pixel 9 family
  { brand: "Google", name: "Pixel 9", slug: "pixel-9", family: "Pixel 9", sortOrder: 20 },
  { brand: "Google", name: "Pixel 9 Pro", slug: "pixel-9-pro", family: "Pixel 9", sortOrder: 21 },
  { brand: "Google", name: "Pixel 9 Pro XL", slug: "pixel-9-pro-xl", family: "Pixel 9", sortOrder: 22 },
];

const MATERIALS = [
  {
    name: "Merino Felt",
    slug: "merino-felt",
    description: "Soft, warm, and remarkably durable — sourced from ethical merino wool farms. Each case develops a unique patina over time.",
    careInstructions: "Spot clean with a damp cloth. Avoid machine washing. Air dry only.",
  },
  {
    name: "Pressed Wool",
    slug: "pressed-wool",
    description: "Dense and structured wool felt, pressed under heat for a smooth, firm surface. Resists pilling and holds its shape beautifully.",
    careInstructions: "Wipe with a lint roller or soft brush. Spot clean only.",
  },
  {
    name: "Cork Blend",
    slug: "cork-blend",
    description: "Sustainable Portuguese cork paired with a felt lining. Lightweight, water-resistant, and unlike anything else in your pocket.",
    careInstructions: "Wipe with a damp cloth. Cork is naturally water-resistant but avoid soaking.",
  },
  {
    name: "Canvas Felt",
    slug: "canvas-felt",
    description: "A hybrid of waxed canvas exterior with a soft felt interior. Built for everyday carry with a rugged, lived-in look.",
    careInstructions: "Spot clean with mild soap and water. Re-wax as needed for water resistance.",
  },
  {
    name: "Leather & Felt",
    slug: "leather-felt",
    description: "Italian vegetable-tanned leather accents on a premium felt body. The leather ages gracefully, getting better with every use.",
    careInstructions: "Condition leather with a natural conditioner every few months. Spot clean felt.",
  },
];

const COLLECTIONS = [
  {
    name: "Field",
    slug: "field",
    headline: "Cases inspired by open landscapes",
    description: "The Field collection draws from the colors and textures of wildflower meadows, forest floors, and morning dew. Earthy tones meet soft felt for a case that feels like a walk through nature.",
    accentColor: "#5C6B4F",
    imageUrl: "https://placehold.co/600x400/5C6B4F/ffffff?text=Field",
    sortOrder: 1,
  },
  {
    name: "Studio",
    slug: "studio",
    headline: "Designed for the creative workspace",
    description: "The Studio collection is for makers, designers, and anyone who lives in their creative space. Clean lines, muted tones, and materials that inspire tactile focus.",
    accentColor: "#6B3A3A",
    imageUrl: "https://placehold.co/600x400/6B3A3A/ffffff?text=Studio",
    sortOrder: 2,
  },
  {
    name: "Soft Form",
    slug: "soft-form",
    headline: "Where comfort meets design",
    description: "Soft Form cases are sculpted for the hand. Rounded edges, plush felt, and gentle curves make these the most comfortable cases we've ever made.",
    accentColor: "#8C7B6B",
    imageUrl: "https://placehold.co/600x400/8C7B6B/ffffff?text=Soft+Form",
    sortOrder: 3,
  },
  {
    name: "Earth",
    slug: "earth",
    headline: "Grounded in natural materials",
    description: "The Earth collection uses only sustainably sourced natural materials. Cork, untreated wool, and organic cotton come together in cases that are kind to the planet and beautiful to hold.",
    accentColor: "#5C6B4F",
    imageUrl: "https://placehold.co/600x400/5C6B4F/ffffff?text=Earth",
    sortOrder: 4,
  },
  {
    name: "Structure",
    slug: "structure",
    headline: "Precision-crafted protection",
    description: "Structure cases are engineered for people who value precision. Pressed wool and leather accents create a case that's both architectural and protective.",
    accentColor: "#4A4E54",
    imageUrl: "https://placehold.co/600x400/4A4E54/ffffff?text=Structure",
    sortOrder: 5,
  },
];

// Product definitions with variants
interface ProductSeed {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  basePrice: number; // cents
  compareAtPrice?: number;
  featured: boolean;
  collections: string[]; // collection slugs
  materials: string[];   // material slugs
  variants: {
    name: string;
    sku: string;
    color: string;
    colorHex: string;
    devices: string[]; // device slugs
    materialSlug?: string;
    price?: number;
  }[];
}

const PRODUCTS: ProductSeed[] = [
  {
    name: "Alpine Felt Case",
    slug: "alpine-felt-case",
    shortDescription: "Soft merino felt case inspired by mountain meadows. Naturally warm, surprisingly protective.",
    description: `The Alpine Felt Case wraps your phone in the same soft merino wool that keeps mountain sheep warm through harsh winters. Hand-cut and stitched in our workshop, each case develops a unique character as the felt gently moulds to your grip.\n\nThe natural lanolin in merino wool provides subtle water resistance, while the dense fibre structure absorbs everyday impacts. A slim, precise fit ensures full access to ports and buttons.\n\n**Features:**\n- 100% merino wool felt, 3mm thick\n- Naturally antimicrobial\n- Develops unique patina over time\n- Precise port and button cutouts\n- Minimal brand mark, embossed on interior`,
    basePrice: 4500,
    compareAtPrice: 5500,
    featured: true,
    collections: ["field", "earth"],
    materials: ["merino-felt"],
    variants: [
      { name: "Moss", sku: "ALP-MOSS", color: "Moss", colorHex: "#5C6B4F", devices: ["iphone-16-pro", "iphone-16-pro-max", "iphone-16", "iphone-15-pro"] },
      { name: "Sand", sku: "ALP-SAND", color: "Sand", colorHex: "#C4B5A0", devices: ["iphone-16-pro", "iphone-16-pro-max", "iphone-16", "iphone-15-pro"] },
      { name: "Charcoal", sku: "ALP-CHAR", color: "Charcoal", colorHex: "#3D3D3D", devices: ["iphone-16-pro", "iphone-16-pro-max", "iphone-16", "iphone-15-pro"] },
    ],
  },
  {
    name: "Atelier Pressed Case",
    slug: "atelier-pressed-case",
    shortDescription: "Dense pressed wool for a clean, structured silhouette. Studio-ready.",
    description: `The Atelier Pressed Case is made from wool felt that's been heated and compressed into a dense, smooth surface. The result is a case that holds its shape, resists pilling, and looks as refined on day 300 as day one.\n\nDesigned for the studio — or anywhere you want your tools to feel as considered as your work.\n\n**Features:**\n- Heat-pressed wool felt, 2.5mm thick\n- Smooth, pill-resistant surface\n- Structured fit with slight rigidity\n- Interior microfibre lining\n- Embossed logo on back`,
    basePrice: 5200,
    featured: true,
    collections: ["studio"],
    materials: ["pressed-wool"],
    variants: [
      { name: "Slate", sku: "ATL-SLAT", color: "Slate", colorHex: "#4A4E54", devices: ["iphone-16-pro", "iphone-16-pro-max", "iphone-16"] },
      { name: "Cream", sku: "ATL-CREM", color: "Cream", colorHex: "#F0E8D8", devices: ["iphone-16-pro", "iphone-16-pro-max", "iphone-16"] },
      { name: "Burgundy", sku: "ATL-BURG", color: "Burgundy", colorHex: "#6B3A3A", devices: ["iphone-16-pro", "iphone-16-pro-max", "iphone-16"] },
    ],
  },
  {
    name: "Terra Cork Case",
    slug: "terra-cork-case",
    shortDescription: "Sustainable Portuguese cork with a felt lining. Lightweight and water-resistant.",
    description: `The Terra Cork Case pairs sustainable Portuguese cork with our signature felt lining. Cork is one of nature's most remarkable materials — lightweight, water-resistant, and harvested without harming the tree.\n\nEach case has a unique grain pattern, making yours truly one of a kind.\n\n**Features:**\n- Portuguese cork exterior\n- Merino felt interior lining\n- Naturally water-resistant\n- Unique grain on every case\n- Carbon-negative material`,
    basePrice: 5800,
    featured: true,
    collections: ["earth"],
    materials: ["cork-blend", "merino-felt"],
    variants: [
      { name: "Natural", sku: "TER-NATL", color: "Natural", colorHex: "#B8976A", devices: ["iphone-16-pro", "iphone-16-pro-max", "galaxy-s25-ultra"] },
      { name: "Dark Oak", sku: "TER-DOAK", color: "Dark Oak", colorHex: "#5C4A32", devices: ["iphone-16-pro", "iphone-16-pro-max", "galaxy-s25-ultra"] },
    ],
  },
  {
    name: "Contour Soft Case",
    slug: "contour-soft-case",
    shortDescription: "Sculpted for the hand — plush felt with rounded ergonomic edges.",
    description: `The Contour Soft Case is built around a single idea: your phone should feel as good in your hand as it looks on a desk. The edges are gently rounded, the felt is our plushest blend, and the whole case is designed to curve with your grip.\n\n**Features:**\n- Double-layer merino felt, 4mm total\n- Ergonomic rounded edges\n- Extra-plush hand feel\n- Drop-tested from 4 feet\n- Machine-precise cutouts`,
    basePrice: 4900,
    featured: false,
    collections: ["soft-form"],
    materials: ["merino-felt"],
    variants: [
      { name: "Cloud", sku: "CNT-CLOD", color: "Cloud", colorHex: "#E8E4DE", devices: ["iphone-16-pro", "iphone-16", "pixel-9-pro"] },
      { name: "Dusk", sku: "CNT-DUSK", color: "Dusk", colorHex: "#6B5E5E", devices: ["iphone-16-pro", "iphone-16", "pixel-9-pro"] },
      { name: "Honey", sku: "CNT-HONY", color: "Honey", colorHex: "#C4956A", devices: ["iphone-16-pro", "iphone-16", "pixel-9-pro"] },
    ],
  },
  {
    name: "Framework Leather Case",
    slug: "framework-leather-case",
    shortDescription: "Italian leather accents on pressed wool. Architectural protection that ages beautifully.",
    description: `The Framework Leather Case combines vegetable-tanned Italian leather with pressed wool felt for a case that's equal parts protective and elegant. The leather develops a rich patina over time, while the wool body absorbs daily impacts.\n\nThis is a case for people who appreciate materials that get better with age.\n\n**Features:**\n- Italian vegetable-tanned leather accents\n- Pressed wool felt body\n- Develops leather patina over time\n- Reinforced corners\n- Suede-lined interior`,
    basePrice: 6800,
    compareAtPrice: 7500,
    featured: true,
    collections: ["structure", "studio"],
    materials: ["leather-felt", "pressed-wool"],
    variants: [
      { name: "Espresso", sku: "FRM-ESPR", color: "Espresso", colorHex: "#3C2415", devices: ["iphone-16-pro", "iphone-16-pro-max"] },
      { name: "Tan", sku: "FRM-TAN", color: "Tan", colorHex: "#B8956A", devices: ["iphone-16-pro", "iphone-16-pro-max"] },
      { name: "Black", sku: "FRM-BLCK", color: "Black", colorHex: "#1A1A1A", devices: ["iphone-16-pro", "iphone-16-pro-max"] },
    ],
  },
  {
    name: "Trail Canvas Case",
    slug: "trail-canvas-case",
    shortDescription: "Waxed canvas exterior with a felt core. Built for everyday adventures.",
    description: `The Trail Canvas Case is for people who take their phone everywhere — and mean everywhere. A waxed canvas exterior shrugs off rain and grime, while the felt interior cradles your phone in protective softness.\n\nThe canvas develops a beautiful worn character over time, like a favourite bag.\n\n**Features:**\n- Waxed canvas exterior\n- Merino felt interior\n- Water-resistant finish\n- Develops character with use\n- Reinforced edges`,
    basePrice: 5400,
    featured: false,
    collections: ["field"],
    materials: ["canvas-felt"],
    variants: [
      { name: "Olive", sku: "TRL-OLIV", color: "Olive", colorHex: "#5C6B4F", devices: ["iphone-16-pro", "iphone-16", "galaxy-s25", "pixel-9"] },
      { name: "Khaki", sku: "TRL-KHAK", color: "Khaki", colorHex: "#A89878", devices: ["iphone-16-pro", "iphone-16", "galaxy-s25", "pixel-9"] },
      { name: "Navy", sku: "TRL-NAVY", color: "Navy", colorHex: "#2C3E50", devices: ["iphone-16-pro", "iphone-16", "galaxy-s25", "pixel-9"] },
    ],
  },
];

const CONTENT_BLOCKS = [
  {
    key: "announcement-bar",
    title: "Free shipping on orders over $75 — Shop now",
    body: null,
    linkUrl: "/collections",
    linkText: "Browse collections",
    status: "PUBLISHED" as const,
  },
  {
    key: "homepage-hero",
    title: "Cases that feel like they belong",
    body: "Premium felt phone cases crafted from natural materials. Each case is designed to age beautifully, feel warm in your hand, and protect what matters.",
    linkUrl: "/collections",
    linkText: "Shop collections",
    imageUrl: "https://placehold.co/1920x800/5C6B4F/ffffff?text=CaseaFelt",
    status: "PUBLISHED" as const,
  },
  {
    key: "material-story",
    title: "Designed with intention",
    body: "CaseaFelt started with a simple idea: your phone case should be as considered as everything else you carry. We work with natural felt, cork, and leather — materials that develop character over time instead of degrading. Every case is cut, shaped, and finished by hand.",
    imageUrl: "https://placehold.co/800x600/C4B49A/2C2C2C?text=Materials",
    linkUrl: "/about",
    linkText: "Our story",
    status: "PUBLISHED" as const,
  },
  {
    key: "newsletter-cta",
    title: "Built to last, made to return",
    body: "Free shipping over $75 · 30-day returns · 1-year warranty",
    status: "PUBLISHED" as const,
  },
];

// ─────────────────────────────────────────────────────────────
// Seed Runner
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...\n");

  // 1. Device models
  console.log("📱 Seeding device models...");
  const deviceModelMap = new Map<string, string>();
  for (const dm of DEVICE_MODELS) {
    const result = await prisma.deviceModel.upsert({
      where: { slug: dm.slug },
      update: dm,
      create: dm,
    });
    deviceModelMap.set(dm.slug, result.id);
  }
  console.log(`   ✓ ${DEVICE_MODELS.length} device models`);

  // 2. Materials
  console.log("🧶 Seeding materials...");
  const materialMap = new Map<string, string>();
  for (const mat of MATERIALS) {
    const result = await prisma.material.upsert({
      where: { slug: mat.slug },
      update: mat,
      create: mat,
    });
    materialMap.set(mat.slug, result.id);
  }
  console.log(`   ✓ ${MATERIALS.length} materials`);

  // 3. Collections
  console.log("📁 Seeding collections...");
  const collectionMap = new Map<string, string>();
  for (const col of COLLECTIONS) {
    const result = await prisma.collection.upsert({
      where: { slug: col.slug },
      update: { ...col, status: "PUBLISHED" },
      create: { ...col, status: "PUBLISHED" },
    });
    collectionMap.set(col.slug, result.id);
  }
  console.log(`   ✓ ${COLLECTIONS.length} collections`);

  // 4. Products with variants
  console.log("📦 Seeding products...");
  let totalVariants = 0;

  for (const prod of PRODUCTS) {
    // Upsert product
    const product = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        shortDescription: prod.shortDescription,
        description: prod.description,
        basePrice: prod.basePrice,
        compareAtPrice: prod.compareAtPrice ?? null,
        featured: prod.featured,
        status: "ACTIVE",
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        shortDescription: prod.shortDescription,
        description: prod.description,
        basePrice: prod.basePrice,
        compareAtPrice: prod.compareAtPrice ?? null,
        featured: prod.featured,
        status: "ACTIVE",
      },
    });

    // Link collections
    for (const colSlug of prod.collections) {
      const colId = collectionMap.get(colSlug);
      if (!colId) continue;
      await prisma.collectionProduct.upsert({
        where: {
          collectionId_productId: { collectionId: colId, productId: product.id },
        },
        update: {},
        create: { collectionId: colId, productId: product.id },
      });
    }

    // Link materials
    for (const matSlug of prod.materials) {
      const matId = materialMap.get(matSlug);
      if (!matId) continue;
      await prisma.productMaterial.upsert({
        where: {
          productId_materialId: { productId: product.id, materialId: matId },
        },
        update: {},
        create: { productId: product.id, materialId: matId },
      });
    }

    // Create product-level hero image (uses first variant color)
    const heroHex = prod.variants[0]?.colorHex.replace("#", "") ?? "E8E3DC";
    const productImageUrl = `https://placehold.co/800x1000/${heroHex}/ffffff?text=${encodeURIComponent(prod.name)}`;
    const existingProductImage = await prisma.productImage.findFirst({
      where: { productId: product.id, isPrimary: true },
    });
    if (!existingProductImage) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: productImageUrl,
          altText: prod.name,
          isPrimary: true,
          sortOrder: 0,
        },
      });
    }

    // Create variants — one per color per device
    for (const v of prod.variants) {
      for (const deviceSlug of v.devices) {
        const deviceId = deviceModelMap.get(deviceSlug);
        if (!deviceId) continue;

        const sku = `${v.sku}-${deviceSlug}`.toUpperCase();
        const variantName = `${v.color} · ${DEVICE_MODELS.find((d) => d.slug === deviceSlug)?.name ?? deviceSlug}`;

        const variant = await prisma.productVariant.upsert({
          where: { sku },
          update: {
            name: variantName,
            color: v.color,
            colorHex: v.colorHex,
            deviceModelId: deviceId,
            materialId: v.materialSlug ? materialMap.get(v.materialSlug) ?? null : null,
            price: v.price ?? null,
            inventoryCount: 25, // Default seed inventory
            trackInventory: true,
            isActive: true,
          },
          create: {
            productId: product.id,
            name: variantName,
            sku,
            color: v.color,
            colorHex: v.colorHex,
            deviceModelId: deviceId,
            materialId: v.materialSlug ? materialMap.get(v.materialSlug) ?? null : null,
            price: v.price ?? null,
            inventoryCount: 25,
            trackInventory: true,
            isActive: true,
          },
        });

        // Create variant image
        const hex = v.colorHex.replace("#", "");
        const variantImageUrl = `https://placehold.co/600x600/${hex}/ffffff?text=${encodeURIComponent(v.color)}`;
        const existingVarImage = await prisma.variantImage.findFirst({
          where: { variantId: variant.id, isPrimary: true },
        });
        if (!existingVarImage) {
          await prisma.variantImage.create({
            data: {
              variantId: variant.id,
              url: variantImageUrl,
              altText: `${prod.name} — ${variantName}`,
              isPrimary: true,
              sortOrder: 0,
            },
          });
        }

        totalVariants++;
      }
    }
  }
  console.log(`   ✓ ${PRODUCTS.length} products, ${totalVariants} variants`);

  // 5. Content blocks
  console.log("📝 Seeding content blocks...");
  for (const block of CONTENT_BLOCKS) {
    await prisma.contentBlock.upsert({
      where: { key: block.key },
      update: block,
      create: block,
    });
  }
  console.log(`   ✓ ${CONTENT_BLOCKS.length} content blocks`);

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
