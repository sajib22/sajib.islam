/**
 * Worker entry point for sajibislam.com
 *
 * Everything that is not an explicit route falls through to the static files
 * in /public, exactly as before. Today there is one route: the contact form.
 *
 * ── SETUP FOR POST /api/contact ────────────────────────────────────────────
 * The route needs one secret. It is NOT in this repo and must never be:
 *
 *   1. Create a free account at resend.com (3,000 emails/month, no card).
 *   2. Add and verify the domain sajibislam.com. Resend shows the DNS records;
 *      the domain is already on Cloudflare, so they paste straight in.
 *   3. Create an API key in Resend.
 *   4. Cloudflare dashboard → the sajibislam-com Worker → Settings →
 *      Variables and Secrets → Add → Secret.
 *      Name it exactly:  RESEND_API_KEY
 *
 * Until that secret exists this route answers 503, and the form in the page
 * quietly falls back to opening the visitor's mail app, so nothing anybody
 * types is ever lost.
 */

const CONTACT_TO = "contact@sajibislam.com";

/* The address the mail is sent FROM. It has to be on a domain verified in
   Resend, which is why it is not the visitor's address — sending as them
   would be rejected by SPF and would land in spam even if it were not.
   The visitor's address goes in reply_to instead, so pressing reply works. */
const CONTACT_FROM = "Website <noreply@sajibislam.com>";

/* Long enough for a real enquiry, short enough that nobody can post a novel.
   The message is also capped in the page; this is the copy that matters,
   because anything can post to a public URL. */
const LIMITS = { first: 100, last: 100, email: 254, message: 5000 };

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { "Content-Type": "application/json" },
  });
}

/* The same rule the page applies, repeated here on purpose: the check in the
   browser is a courtesy to the person typing, not a guarantee about what
   arrives. Anything reaching this route may have skipped the page entirely. */
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/;

async function handleContact(request, env) {
  if (request.method !== "POST") {
    return json({ error: "Use POST." }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: "Expected JSON." }, 400);
  }

  const field = (name) => String(body?.[name] ?? "").trim().slice(0, LIMITS[name]);
  const first = field("first");
  const last = field("last");
  const email = field("email");
  const message = field("message");

  /* The honeypot from the form. A person never sees the field, so anything in
     it is automated. Answer 200 so the sender learns nothing from the reply,
     and drop the message. */
  if (String(body?.website ?? "").trim()) {
    return json({ ok: true }, 200);
  }

  if (!first || !last || !EMAIL.test(email) || message.length < 10) {
    return json({ error: "Please fill in every field with a valid email." }, 400);
  }

  if (!env.RESEND_API_KEY) {
    // Not configured yet. The page falls back to the visitor's mail app.
    return json({ error: "Email is not configured on the server yet." }, 503);
  }

  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      reply_to: email,
      subject: `Website message from ${first} ${last}`,
      /* Plain text only. Nothing a stranger types is put into HTML, so there
         is no markup for them to inject in the first place. */
      text:
        `From: ${first} ${last}\n` +
        `Email: ${email}\n` +
        `\n${message}\n`,
    }),
  });

  if (!sent.ok) {
    /* Logged for the Workers dashboard, never returned — the upstream error
       can name the account and the key. */
    console.error("Resend rejected the message:", sent.status, await sent.text());
    return json({ error: "The message could not be sent. Please email me directly." }, 502);
  }

  return json({ ok: true }, 200);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") return handleContact(request, env);

    // ── Future routes go here, above the fallthrough. ──

    return env.ASSETS.fetch(request);
  },
};
