# ROADMAP.md — where future features attach

**Nothing in this file is built.** It exists so that when you do build one of these, it's an
addition rather than a rewrite, and so you know the free-tier limits before you start.

The site is already structured for this: `src/index.js` is a real Worker entry point that
currently does nothing but serve static files. Every feature below hangs off that one file.

```js
// src/index.js — today
export default {
  async fetch(request, env) {
    // ── Future routes go here, above the fallthrough. ──
    return env.ASSETS.fetch(request);
  },
};
```

Adding a route means adding a branch above that last line. Nothing gets torn out.

---

## 1. Contact form

**Attaches to:** `src/index.js` — a `POST /api/contact` branch. Plus a `<form>` in
`public/index.html` in the Contact section.

**Cloudflare products:** none required. The Worker can send the message on with a `fetch()`
to an email API, or write it to KV and forward on a schedule.

**Free-tier limits:** Workers free plan gives 100,000 requests/day and 10ms CPU per
invocation. A contact form will not come close.

**The real problem is spam, not delivery.** Before building this, decide on:
- **Cloudflare Turnstile** (free, unlimited) instead of a captcha, or
- a honeypot field plus rate limiting by IP in the Worker.

**Where the secret goes:** if you use an email API, its key is a **Worker secret**, set in
the Cloudflare dashboard under **Settings → Variables and Secrets → Add → Secret**. It never
goes in the repo. This is the first feature that will need one.

**Simpler alternative worth considering first:** a `mailto:` link already works and costs
nothing to maintain. A form is only worth it if you're getting enough contact to care about
the friction.

---

## 2. RF calculators — STARTED (`/tools/`)

**Built:** `public/tools/index.html` + `public/tools/tools.js` — one page with five
calculators: power (W/mW/dBm/dBW), LTE EARFCN ⇄ frequency (band table from 3GPP TS 36.101),
free-space path loss, VSWR / return loss, and wavelength. Pure client-side vanilla JS, no
Worker change, no config change. The maths is written out plainly in `tools.js` with the
formula beside each tool on the page.

**Still worth adding**, each as another `<section class="tool">` on that page (plus an entry
in the `.tools-nav` chip row and an `#id` anchor):
- **Link budget** — TX power + gains − losses → EIRP and received level. The natural next one.
- **DAS downlink power budget** — head-end output through the coax/splitter/tap chain to
  per-antenna EIRP. Sajib's core work; this is the highest-value addition.
- **Coax / cable loss** — loss per 100 m by cable type and frequency.
- **Antenna near-field / far-field boundary**, **Fresnel zone radius**, **dBm ↔ µV/m**.

**When adding a whole new tool section:**
- Reuse the `.tool`, `.calc`, `.field`, `.out` classes already in `styles.css`.
- Add a function for it in `tools.js` following the existing pattern (wire inputs, compute on
  `input`, write results with `textContent`). Keep the formula visible in a `.tool__ref`.
- Add its chip to `.tools-nav` and give the section a matching `id`.

Adding calculators does **not** touch the shared nav or any other page — the Tools page
already exists in the navigation.

---

## 3. Private personal-finance tools

**These must never sit on the public site.** Not behind a password field you write yourself,
not on an unguessable URL. Both of those are how personal financial data ends up indexed.

**Attaches to:** a separate route — `finance.sajibislam.com` or `sajibislam.com/private/*` —
protected by **Cloudflare Access**, which sits in front of the Worker and requires a Google
login before any request reaches your code.

**Cloudflare products and free-tier limits:**

| Product | What for | Free tier |
|---|---|---|
| **Cloudflare Access** (Zero Trust) | Login wall in front of the route | 50 users |
| **D1** | SQLite database for transactions | 5GB storage, 5M rows read/day |
| **KV** | Simple key-value storage | 100k reads/day, 1k writes/day |

**Which storage:** D1 if you're tracking transactions and want to query them (it's SQL, which
you already know). KV only if you're storing a handful of settings — its write limit is low
and it is not a database.

**Config changes needed when you get here:** D1 and KV both require a binding block in
`wrangler.jsonc`. That's one of the "ask first" files — get Claude to do it, and check the
change before pushing, because a malformed binding fails the deploy.

**Order of operations:** set up Access on an empty route *first* and confirm you get the login
prompt, before you put any real data behind it.

---

## Things deliberately not on this list

- **A blog.** Would need either a build step (violates the constraints) or hand-written HTML
  per post. If you want to write, write on LinkedIn and link to it from Projects.
- **A CMS.** `content.js` is the CMS. It's one file and it's editable from your phone.
- **Comments, newsletter signup, chat widget.** All third-party requests, all with a free tier
  that eventually isn't.

If one of these becomes genuinely worth it, that's a conversation — not a silent addition.
