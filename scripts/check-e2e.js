const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

(async () => {
  const v = await db.productVariant.findUnique({ where: { id: 'cmnzhg8bc000s34pkvkgzqjda' }, select: { inventoryCount: true } });
  const orders = await db.order.findMany({ include: { items: true, payment: true } });
  const cart = await db.cart.findFirst({ where: { sessionId: '91770380-7fb8-47c6-aa7b-79eb6302263c' }, include: { items: true } });

  console.log('========== E2E TEST RESULTS ==========');
  console.log('');
  console.log('1. ORDER CREATION:', orders.length > 0 ? 'PASS ✅' : 'FAIL ❌');
  if (orders.length > 0) {
    const o = orders[0];
    console.log('   Order ID:', o.id);
    console.log('   Status:', o.status);
    console.log('   Email:', o.email);
    console.log('   Total:', o.totalAmount, '(cents)');
    console.log('   Stripe Session:', o.stripeSessionId ? o.stripeSessionId.substring(0, 40) : 'none');
    console.log('');
    console.log('2. ORDER ITEMS:', o.items.length > 0 ? 'PASS ✅' : 'FAIL ❌');
    console.log('   Items count:', o.items.length);
    o.items.forEach(i => console.log('   -', 'variantId:', i.variantId, 'qty:', i.quantity, 'price:', i.unitPrice));
    console.log('');
    console.log('3. PAYMENT RECORD:', o.payment ? 'PASS ✅' : 'FAIL ❌');
    if (o.payment) {
      console.log('   Status:', o.payment.status);
      console.log('   Amount:', o.payment.amount);
      console.log('   Currency:', o.payment.currency);
      console.log('   Provider:', o.payment.provider);
    }
  }
  console.log('');
  const invPass = v.inventoryCount < 25;
  console.log('4. INVENTORY DECREMENT:', invPass ? 'PASS ✅ (was 25, now ' + v.inventoryCount + ')' : 'FAIL ❌ (still ' + v.inventoryCount + ')');
  console.log('');
  const cartCleared = cart === null || cart.items.length === 0;
  console.log('5. CART CLEARED:', cartCleared ? 'PASS ✅' : 'FAIL ❌ (still ' + (cart ? cart.items.length : 0) + ' items)');
  console.log('');
  console.log('======================================');

  await db.$disconnect();
})();
