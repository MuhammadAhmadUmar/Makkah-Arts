import { BRAND_NAME } from "@/lib/constants";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM ?? getDefaultEmailFrom();

function getDefaultEmailFrom() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return "no-reply@example.com";
  }

  try {
    const { hostname } = new URL(siteUrl);
    return hostname ? `no-reply@${hostname}` : "no-reply@example.com";
  } catch {
    return "no-reply@example.com";
  }
}

function formatItems(items: { title: string; quantity: number; lineTotal: number }[]) {
  return items
    .map((item) => `- ${item.title} x ${item.quantity} — PKR ${item.lineTotal}`)
    .join("\n");
}

export async function sendOrderConfirmationEmail(
  to: string,
  orderNumber: string,
  total: number,
  paymentMethod: string,
  items: { title: string; quantity: number; lineTotal: number }[],
) {
  if (!RESEND_API_KEY) {
    throw new Error("Resend API key is not configured.");
  }

  const subject = `${BRAND_NAME} order confirmation — ${orderNumber}`;
  const text = `Thank you for your order.

Order number: ${orderNumber}
Payment method: ${paymentMethod}
Total: PKR ${total}

Items:
${formatItems(items)}

We will contact you shortly to confirm the details and arrange delivery.

Warm regards,
${BRAND_NAME}`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend email send failed: ${response.status} ${body}`);
  }

  return response.json();
}
