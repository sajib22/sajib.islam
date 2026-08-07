# CONTRIBUTING.md — your operating manual

This is written for you, on your phone, using the GitHub mobile app (or github.com in a
browser) and the Claude app. You never need a laptop or a terminal for anything in this file.

**The short version:** almost everything you will ever want to change lives in one file —
`public/content/content.js`. Edit it, commit, and the site updates itself in about a minute.

---

## How to edit a file from your phone

1. Open the **GitHub** app → repo **sajib22/sajib.islam**.
2. Tap **Code**, then tap through to the file (e.g. `public` → `content` → `content.js`).
3. Tap the **pencil** icon.
4. Make your change.
5. Scroll to the bottom, write a short message like `Add new job`, and tap **Commit changes**.
   Commit directly to `main`.

That's it. Cloudflare picks it up automatically.

---

## Add a job

File: **`public/content/content.js`**, the `experience:` section.

1. Find the block marked `// ── COPY FROM HERE ──` … `// ── TO HERE ──`.
2. Copy the whole `{ … },` block including the closing comma.
3. Paste it directly below, then edit the text.
4. **New job is your current one?** Move `current: true,` to the new block and delete that
   line from the old one. Only one job should ever have it — it's what draws the amber
   "Current" marker.
5. Newest job goes at the top. The page shows them in the order they appear in the file.

## Add a project

Same file, the `projects:` section. Copy the fenced block, paste, edit.

If the project has nothing to link to, **delete the `link:` and `linkLabel:` lines
entirely** — the card will simply render without a link. Do not leave `link: ""`.

## Add a skill

Same file, the `skills:` section. Find the right group and add one line inside its `items:`
list:

```js
"Your new skill",
```

Don't forget the quotes and the comma. To add a whole new group, copy a `{ … },` block.

## Change your name, hero line, About paragraphs, or contact links

These are **not** in `content.js` — they're written straight into the page because they
change once a decade.

File: **`public/index.html`**. Search for these comment banners:

| What you want to change | Search for |
|---|---|
| Page title, description, social preview text | `SEO & SOCIAL` |
| Your name, one-line intro, hero email | `HERO` |
| The three About paragraphs | `ABOUT` |
| Email, LinkedIn, GitHub links | `CONTACT` |

The GitHub row in the contact list is currently commented out. To switch it on, follow the
instructions in the comment right above it.

---

## Change the colours

File: **`public/styles.css`**. The first ~30 lines are the entire theme:

```css
:root {
  --paper:   #F1F4F4;   /* page background        */
  --surface: #FFFFFF;   /* cards and raised areas */
  --ink:     #14191B;   /* main text              */
  --steel:   #55636A;   /* secondary text         */
  --accent:  #0B6B7A;   /* links, focus, markers  */
  --amber:   #7E5A0E;   /* the "current role" dot */
  --rule:    #D5DCDC;   /* hairlines and borders  */
}
```

Change a hex value and it changes everywhere. **There are two more copies below it** — one
for `[data-theme="dark"]` and one for `prefers-color-scheme: dark`. If you change a light
colour, check whether the dark versions need the matching change.

**If you change `--ink`, `--steel` or `--accent`, check they're still readable.** Paste the
new colour and the background into a contrast checker and make sure it's at least **4.5:1**.
Below that, the site stops being accessible.

## Change the fonts

Also `public/styles.css`, just below the colours: `--font-sans` and `--font-mono`.

These use your device's built-in fonts on purpose — they cost zero download and can't fail to
load. **Do not add a Google Font or any other web font.** It breaks the "no external
requests" rule and it makes the page slower on a phone.

---

## What you must never edit without asking Claude first

| File | Why |
|---|---|
| `wrangler.jsonc` | This is the deploy config. A wrong value here doesn't break the page — it breaks the *deploy*, and the old version stays live while you wonder why nothing changed. |
| `src/index.js` | The Worker entry point. Future features attach here. |
| `public/main.js` | The code that turns `content.js` into the page. |

Also never add: a framework, a package, a web font, a tracking script, or anything that
costs money. And never put a phone number, home address, personal email or ID number in any
file here — this repo is public and anyone can read it.

---

## Did my change actually go live?

1. **GitHub app → the repo → Commits.** Your commit should be at the top with a small
   coloured dot next to it. Green tick = deployed. Orange dot = still building. Red X = failed.
2. Or: **Cloudflare dashboard → Compute (Workers) → sajibislam-com → Deployments**. The
   newest entry should say **Success** and match your commit message.
3. Then just open sajibislam.com. If you see the old version, **pull down to refresh** — your
   phone browser caches aggressively. Try a private/incognito tab to be sure.

Normal time from commit to live: **under two minutes.**

## The deploy failed. Now what?

1. Open **Cloudflare → Compute (Workers) → sajibislam-com → Deployments**, tap the failed one,
   and read the bottom of the log — the real error is almost always in the last few lines.
2. Common causes:
   - **`Missing entry-point to Worker script or to assets directory`** — something changed
     `wrangler.jsonc`. Roll it back (below).
   - **`Missing script: build`** — a build command got added in the Cloudflare UI. Go to
     **Settings → Build → Build command** and clear it. It must be empty.
3. **Your live site is fine.** A failed deploy does not take the site down — Cloudflare keeps
   serving the last successful version. You have time to fix it properly.

## A change broke the page. How do I undo it?

**Option A — undo one commit (easiest on a phone):**

1. GitHub app → repo → **Commits**.
2. Tap the bad commit → tap **⋯** → **Revert**.
3. Commit the revert to `main`. The site rebuilds with the change undone.

**Option B — roll back the deployment instantly (fastest):**

1. Cloudflare → **Compute (Workers)** → **sajibislam-com** → **Deployments**.
2. Find the last deployment that worked, tap **⋯** → **Rollback**.
3. The live site reverts in seconds.

Option B is faster but doesn't change the repo — the bad code is still in `main` and the next
push will bring it back. Use B to stop the bleeding, then A to actually fix it.

**Option C — a section vanished but the rest of the page is fine.** That's a typo in
`content.js`, and the page will be showing a message telling you so. Look at what you last
edited: a missing comma, a missing `"` quote, or a missing `}`. Fix it, or revert with A.
