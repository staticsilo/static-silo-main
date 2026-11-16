import { timingSafeEqual } from "node:crypto";
import { FEEDBACK_EMAIL } from "../../site-config";

// Ko-fi calls this address whenever someone donates, subscribes or buys from the shop.
// Set it in Ko-fi: Settings -> API -> Webhooks -> https://staticsilo.vercel.app/api/kofi
//
// Secrets are read from the host's environment settings, never from the code:
//   KOFI_VERIFICATION_TOKEN  the token Ko-fi shows beside the webhook URL (required)
//   RESEND_API_KEY           lets this send you an email; without it the call is only logged
export const runtime = "nodejs";

type KofiPayload = {
  verification_token?: string;
  type?: string;
  is_public?: boolean;
  from_name?: string;
  message?: string | null;
  amount?: string;
  currency?: string;
  url?: string;
  email?: string;
  tier_name?: string | null;
  is_subscription_payment?: boolean;
  is_first_subscription_payment?: boolean;
  kofi_transaction_id?: string;
  shop_items?: { direct_link_code?: string; variation_name?: string; quantity?: number }[] | null;
};

function sameSecret(given: string, expected: string) {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function describe(p: KofiPayload) {
  const what =
    p.type === "Subscription"
      ? p.is_first_subscription_payment
        ? "a new monthly supporter"
        : "a monthly payment"
      : p.type === "Shop Order"
        ? "a shop order"
        : p.type === "Commission"
          ? "a commission"
          : "a donation";
  const who = p.is_public === false ? "An anonymous supporter" : p.from_name || "Someone";
  return { what, who, amount: `${p.amount ?? "?"} ${p.currency ?? ""}`.trim() };
}

async function notify(p: KofiPayload) {
  const key = process.env.RESEND_API_KEY;
  const { what, who, amount } = describe(p);
  const subject = `Ko-fi: ${who} sent ${amount}`;
  const lines = [
    `${who} sent ${what} of ${amount}.`,
    "",
    `Message: ${p.message || "(none)"}`,
    p.tier_name ? `Tier: ${p.tier_name}` : null,
    `Shown publicly on Ko-fi: ${p.is_public === false ? "no" : "yes"}`,
    p.email ? `Their email: ${p.email}` : null,
    p.url ? `Ko-fi link: ${p.url}` : null,
    p.kofi_transaction_id ? `Transaction: ${p.kofi_transaction_id}` : null,
  ].filter((l): l is string => l !== null);

  if (!key) {
    // No mail service yet: keep a trace in the host's logs, without the supporter's email or message.
    console.log(`[kofi] ${subject} (${p.type ?? "unknown"})`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Static Silo <onboarding@resend.dev>",
      to: [FEEDBACK_EMAIL],
      subject,
      text: lines.join("\n"),
    }),
  });
  if (!res.ok) console.error(`[kofi] email not sent (${res.status})`);
}

export async function POST(request: Request) {
  const expected = process.env.KOFI_VERIFICATION_TOKEN;
  if (!expected) return new Response("Ko-fi webhook is not set up", { status: 503 });

  let payload: KofiPayload;
  try {
    // Ko-fi posts a form with a single field, "data", holding the JSON.
    const form = await request.formData();
    const raw = form.get("data");
    if (typeof raw !== "string") return new Response("Bad request", { status: 400 });
    payload = JSON.parse(raw) as KofiPayload;
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  if (typeof payload.verification_token !== "string" || !sameSecret(payload.verification_token, expected)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await notify(payload);
  } catch {
    console.error("[kofi] notification failed");
  }
  // Ko-fi wants a 200 to know it was received, even if the email step failed.
  return new Response("OK", { status: 200 });
}
