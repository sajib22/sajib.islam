# SETUP.md — the parts I can't do for you

Everything in this file happens in a dashboard, not in the repo, so you have to click it
yourself. It is written for a phone browser.

**Before you start:** in your phone browser, open the menu and turn on **Desktop site** for
`dash.cloudflare.com`. The Cloudflare dashboard works on mobile, but several buttons in these
steps are hidden behind collapsed menus otherwise. Everything below assumes desktop mode.

You should be able to get through steps 1 and 2 in about ten minutes. Steps 3–5 involve
waiting for emails and DNS, so budget an hour with interruptions.

---

## Step 1 — Create the Worker from this repo

1. Go to **dash.cloudflare.com** and sign in.
2. In the left sidebar, click **Compute (Workers)**. (In some accounts this is still labelled
   **Workers & Pages**.)
3. Click **Create**, then choose the **Workers** tab, then **Import a repository**.
4. If this is your first time, Cloudflare asks to connect your GitHub account. Click
   **Connect GitHub**, sign in, and when GitHub asks which repositories to grant access to,
   choose **Only select repositories** and pick **sajib22/sajib.islam**.
   - *You should see:* a green tick and your repo appearing in Cloudflare's list.
   - *If you don't see the repo:* you granted access to the wrong account or wrong repo. In
     GitHub go to **Settings → Applications → Cloudflare Workers and Pages → Configure**, and
     add `sajib.islam` to the repository list.
5. Select **sajib22/sajib.islam**, then click **Begin setup**.
6. Now the important screen. Fill it in exactly like this:

   | Field | What to put |
   |---|---|
   | **Project name / Worker name** | `sajibislam-com` |
   | **Production branch** | `main` |
   | **Build command** | **leave completely empty** |
   | **Deploy command** | `npx wrangler deploy` (this is usually pre-filled — leave it) |
   | **Root directory** | `/` (leave as-is) |

   **Cloudflare will suggest `sajib-islam` or `sajib.islam` as the name. Do not accept it.**
   A Worker name may only contain lowercase letters, numbers and hyphens — no dots, no
   underscores. Type `sajibislam-com` yourself.
   - *If you see:* "Invalid worker name" or the Create button stays greyed out — the name
     still has a dot or underscore in it. Retype it.
   - *On the build command:* this project has no build step. If Cloudflare pre-fills
     `npm run build`, **delete it and leave the box blank.** Leaving it in makes the deploy
     fail with "Missing script: build".

7. Click **Create and deploy**.
8. Wait for the build. It should take well under a minute.
   - *You should see:* a build log ending with **Success** and a URL like
     `https://sajibislam-com.<your-subdomain>.workers.dev`.
   - *If you see* `Missing entry-point to Worker script or to assets directory`: something
     changed `wrangler.jsonc`. That file must have `"main": "src/index.js"` and
     `"assets": { "directory": "./public" }`. Do not fix it by guessing — ask Claude.

**Verify step 1:** open the `.workers.dev` URL. You should see the site, with your name, the
signal chart, and all sections filled in. If the page loads but Experience and Skills are
empty, `content.js` is not loading — ask Claude.

---

## Step 2 — Put it on sajibislam.com

Your domain is already Active in Cloudflare, so this is just attaching it.

1. From **Compute (Workers)**, click the **sajibislam-com** Worker.
2. Go to the **Settings** tab → **Domains & Routes** → **Add** → **Custom domain**.
3. Type `sajibislam.com` and click **Add domain**.
4. Repeat: **Add** → **Custom domain** → `www.sajibislam.com` → **Add domain**.
   - *You should see:* both domains listed, each showing **Active** within a minute or two.
     They may briefly say "Initializing" — that is normal.
   - *If a domain is stuck on "Initializing" after 10 minutes:* check **Websites →
     sajibislam.com → DNS** for an old `A`, `AAAA` or `CNAME` record on `@` or `www` left over
     from a previous host. Delete it; the custom domain creates its own record.

Cloudflare issues the SSL certificate automatically. There is nothing to buy or configure.

**Verify step 2:** open `https://sajibislam.com` and `https://www.sajibislam.com` in your
phone browser. Both should load the site over HTTPS with a padlock. If you get a certificate
warning, wait 15 minutes and try again — certificate issuance is not instant.

---

## Step 3 — Email: `contact@sajibislam.com` forwarding to Gmail

This gives you a professional address without paying for a mailbox. Cloudflare receives mail
for the domain and forwards it to your existing Gmail.

1. In Cloudflare, click **Websites** in the sidebar, then **sajibislam.com**.
2. In the left menu, click **Email** → **Email Routing**.
3. Click **Get started** / **Enable Email Routing**.
4. Cloudflare shows you the DNS records it needs to add — three `MX` records and one `TXT`
   (SPF) record. Click **Add records and enable**.
   - **If you currently receive email at sajibislam.com through another provider, stop.**
     Adding these MX records will take over mail delivery for the whole domain. You said this
     domain is only for the website, so this should be safe — but check first.
5. Under **Destination addresses**, click **Add destination address** and enter your Gmail
   address. Cloudflare sends a confirmation email to it.
6. Open Gmail, find the email from Cloudflare, and click the verification link.
   - *You should see:* the destination address change from **Unverified** to **Verified**.
   - *If the email doesn't arrive:* check Gmail's Spam folder. It comes from
     `noreply@notify.cloudflare.com`.
7. Back in **Email Routing → Routing rules**, click **Create address**:
   - Custom address: `contact`
   - Action: **Send to an email**
   - Destination: your verified Gmail address
   - Click **Save**.

**Verify step 3:** from your phone, send an email to `contact@sajibislam.com`. It should land
in your Gmail inbox within a minute. If it bounces, the destination address is not verified
yet — redo step 6.

---

## Step 4 — Send email *from* `contact@sajibislam.com` in Gmail

Step 3 only handles incoming mail. This step lets you reply as `contact@sajibislam.com`
instead of your Gmail address.

**4a — Turn on 2-Step Verification (required)**

Google hides app passwords until 2-Step Verification is on.

1. Go to **myaccount.google.com** → **Security**.
2. Under "How you sign in to Google", tap **2-Step Verification** and follow the steps.
   - *If it already says "On", skip to 4b.*

**4b — Create an app password**

1. Go to **myaccount.google.com/apppasswords**.
   - *If you get "The setting you are looking for is not available for your account":*
     2-Step Verification is not fully on yet. Go back to 4a.
2. Give it a name like `sajibislam-com` and tap **Create**.
3. Google shows a **16-character password** in four groups. Copy it now — you cannot see it
   again. You will paste it in the next step and never need it after that.
   - Type it **without the spaces** when you paste it.

**4c — Add the address to Gmail**

Do this part in a browser, not the Gmail app — the Gmail mobile app cannot add send-as
addresses.

1. Open **mail.google.com** with **Desktop site** turned on.
2. **Settings (gear) → See all settings → Accounts and Import**.
3. Next to "Send mail as", click **Add another email address**.
4. Enter:
   - Name: `Sajib Islam`
   - Email address: `contact@sajibislam.com`
   - **Untick** "Treat as an alias"
   - Click **Next Step**.
5. On the SMTP screen enter exactly:

   | Field | Value |
   |---|---|
   | SMTP Server | `smtp.gmail.com` |
   | Port | `587` |
   | Username | your full Gmail address (e.g. `you@gmail.com`) |
   | Password | the 16-character app password from 4b, no spaces |
   | Security | **Secured connection using TLS** |

   - *Common mistake:* the username is your **Gmail** address, not `contact@sajibislam.com`.
   - *If you get "Authentication failed":* the app password was mistyped or has spaces in it.
     Generate a fresh one.
6. Click **Add Account**. Google emails a confirmation code to `contact@sajibislam.com`, which
   Cloudflare forwards to your Gmail inbox (this is why step 3 has to work first).
7. Open that email, copy the code, paste it into the verification box, and confirm.

**Verify step 4:** compose a new email in Gmail. Tap the **From** field — you should now be
able to pick `contact@sajibislam.com`. Send a test to yourself and check the "from" address
on the received copy.

---

## Step 5 — SPF and DMARC, so your mail isn't marked as spam

Go to **Websites → sajibislam.com → DNS → Records**.

**5a — SPF (one record only)**

Email Routing already added an SPF record in step 3. **You must edit that record, not add a
second one.** Two SPF records on a domain is a hard failure — mail providers reject both.

1. Find the existing `TXT` record on `sajibislam.com` whose content starts with `v=spf1`.
   It probably reads: `v=spf1 include:_spf.mx.cloudflarenet.com ~all`
2. Click **Edit** and change the content to exactly:

   ```
   v=spf1 include:_spf.mx.cloudflarenet.com include:_spf.google.com ~all
   ```

3. Save.

The `include:_spf.google.com` part is what authorises Gmail to send as your domain after
step 4.

**5b — DMARC**

1. Click **Add record**:
   - Type: `TXT`
   - Name: `_dmarc`
   - Content:

     ```
     v=DMARC1; p=none; rua=mailto:contact@sajibislam.com
     ```

2. Save.

`p=none` means "monitor, don't reject". Start here. It cannot break your mail. Once you have
been sending for a month with no problems, you can tighten it to `p=quarantine`, but there is
no rush and no need.

**Verify step 5:** send an email from `contact@sajibislam.com` to your own Gmail. Open the
received message, tap the three-dot menu → **Show original**. You want to see **SPF: PASS**
and **DMARC: PASS**. If SPF says `fail` or `softfail`, re-check 5a for a typo or a second
SPF record.

---

## Step 6 — Web Analytics (optional — read this first)

**This is the one step that conflicts with a rule you set.** One of the hard constraints for
this site is *no external requests except my own assets*. Cloudflare Web Analytics works by
adding a small script that loads from `static.cloudflareinsights.com` — about 5KB from a host
that isn't yours, on every page view.

It is genuinely free, needs no cookie banner, and collects no personal data. But it is a
third-party request, and the site is complete without it. **Your call.**

If you want it:

1. In Cloudflare, go to **Analytics & Logs** → **Web Analytics**.
2. Click **Add a site**, enter `sajibislam.com`, and choose **Manual setup**.
3. Copy the `<script>` snippet it gives you.
4. Ask Claude to add it to `public/index.html` immediately before the closing `</body>` tag.
   Do not paste it anywhere else — putting it in `<head>` will slow the first paint.

To remove it later, delete that one `<script>` line. Nothing else depends on it.

**Verify step 6:** load sajibislam.com, wait a minute, then check the Web Analytics page for a
recorded page view.

---

## What "working" looks like when you're done

- `https://sajibislam.com` loads the site with a padlock.
- `https://www.sajibislam.com` loads the same site.
- Email to `contact@sajibislam.com` arrives in your Gmail.
- You can send from `contact@sajibislam.com` in Gmail, and it passes SPF and DMARC.
- Pushing a change to `main` on GitHub updates the live site within a minute or two.

That last one is the real test. Once it works, you never touch this file again — see
CONTRIBUTING.md for day-to-day changes.
