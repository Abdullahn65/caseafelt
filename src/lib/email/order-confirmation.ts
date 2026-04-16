import { resend, FROM_EMAIL } from "@/lib/email";

interface OrderItem {
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
}

interface OrderConfirmationData {
  orderNumber: string;
  customerEmail: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  currency?: string;
}

function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

function buildOrderHtml(data: OrderConfirmationData): string {
  const currency = data.currency ?? "USD";
  const greeting = data.customerName
    ? `Hi ${data.customerName},`
    : "Hi there,";

  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
          <strong>${item.productName}</strong><br />
          <span style="color: #666; font-size: 14px;">${item.variantName}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">
          ${formatPrice(item.unitPrice * item.quantity, currency)}
        </td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation — CaseaFelt</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f7f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f7f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 24px 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: 0.05em;">
                CASEAFELT
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="font-size: 16px; color: #1a1a1a; margin: 0 0 8px;">${greeting}</p>
              <p style="font-size: 16px; color: #1a1a1a; margin: 0 0 24px;">
                Thank you for your order! We've received your purchase and are getting it ready.
              </p>

              <div style="background-color: #f7f7f5; border-radius: 6px; padding: 16px 20px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #666;">Order number</p>
                <p style="margin: 4px 0 0; font-size: 18px; font-weight: 600; color: #1a1a1a;">${data.orderNumber}</p>
              </div>

              <!-- Items -->
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px; color: #1a1a1a;">
                <tr style="border-bottom: 2px solid #1a1a1a;">
                  <th style="padding: 8px 0; text-align: left; font-weight: 600;">Item</th>
                  <th style="padding: 8px 0; text-align: center; font-weight: 600;">Qty</th>
                  <th style="padding: 8px 0; text-align: right; font-weight: 600;">Price</th>
                </tr>
                ${itemRows}
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px; color: #1a1a1a; margin-top: 16px;">
                <tr>
                  <td style="padding: 4px 0;">Subtotal</td>
                  <td style="padding: 4px 0; text-align: right;">${formatPrice(data.subtotal, currency)}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;">Shipping</td>
                  <td style="padding: 4px 0; text-align: right;">${data.shippingCost > 0 ? formatPrice(data.shippingCost, currency) : "Free"}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0; font-weight: 700; font-size: 16px; border-top: 2px solid #1a1a1a;">Total</td>
                  <td style="padding: 12px 0 0; font-weight: 700; font-size: 16px; text-align: right; border-top: 2px solid #1a1a1a;">${formatPrice(data.total, currency)}</td>
                </tr>
              </table>

              <p style="font-size: 14px; color: #666; margin: 32px 0 0;">
                We'll send you a shipping confirmation with tracking details once your order is on its way.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f7f7f5; text-align: center; font-size: 13px; color: #999;">
              <p style="margin: 0;">
                Questions? Contact us at <a href="mailto:hello@caseafelt.com" style="color: #1a1a1a;">hello@caseafelt.com</a>
              </p>
              <p style="margin: 8px 0 0;">© ${new Date().getFullYear()} CaseaFelt. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmation(
  data: OrderConfirmationData
): Promise<void> {
  // Skip silently if Resend is not configured (MVP mode)
  if (!process.env.RESEND_API_KEY) {
    console.log(
      `[email] RESEND_API_KEY not set — skipping order confirmation for ${data.orderNumber}`
    );
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Order Confirmed — ${data.orderNumber}`,
      html: buildOrderHtml(data),
    });
    console.log(
      `[email] Order confirmation sent for ${data.orderNumber} to ${data.customerEmail}`
    );
  } catch (error) {
    // Log but don't throw — email failure shouldn't break the order flow
    console.error(
      `[email] Failed to send order confirmation for ${data.orderNumber}:`,
      error
    );
  }
}
