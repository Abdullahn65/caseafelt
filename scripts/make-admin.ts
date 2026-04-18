/**
 * Bootstrap script: Promote a user to SUPER_ADMIN by email.
 *
 * Usage:
 *   npx tsx scripts/make-admin.ts your@email.com
 */

const { PrismaClient } = require("@prisma/client");

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npx tsx scripts/make-admin.ts <email>");
    process.exit(1);
  }

  const db = new PrismaClient();

  // Try to find user by email
  let user = await db.user.findUnique({ where: { email } });

  if (!user) {
    console.log(`No user found with email "${email}".`);
    console.log("Sign up on the site first, then run this script again.");
    console.log("\nOr, listing all users:");
    const users = await db.user.findMany({
      select: { id: true, email: true, role: true, firstName: true },
    });
    console.table(users);
    await db.$disconnect();
    process.exit(1);
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: { role: "SUPER_ADMIN" },
    select: { id: true, email: true, role: true, firstName: true },
  });

  console.log("✅ User promoted to SUPER_ADMIN:");
  console.log(updated);

  await db.$disconnect();
}

main().catch(console.error);
