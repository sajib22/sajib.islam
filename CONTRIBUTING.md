# CONTRIBUTING.md — your operating manual

This is written for you, on your phone, using the GitHub mobile app (or github.com in a
browser) and the Claude app. You never need a laptop or a terminal for anything in this file.

**The short version:** almost everything you will ever want to change lives in one file —
`public/content/content.js`. Edit it, commit, and the site updates itself in about a minute.

## The four pages

| Page | File | What's on it |
|---|---|---|
| `/` | `public/index.html` | Hero, career timeline, what I do, three featured projects, contact |
| `/experience/` | `public/experience/index.html` | Column chart, DAS diagram, all roles, delivery process, skills |
| `/projects/` | `public/projects/index.html` | Every project with the long write-up |
| `/tools/` | `public/tools/index.html` | RF calculators (power, EARFCN, path loss, VSWR, wavelength) |
| `/about/` | `public/about/index.html` | The long story, education, certifications, recognition |

Plus `public/404.html`, which shows the same header and footer so a wrong URL isn't a dead end.

**⚠ The navigation and footer are copied into all six files.** There is no build step, so
nothing can share them automatically. If you add a page or rename a nav link, you must make
the same edit in all six. Search each file for `TITLE BLOCK` — the comment there says the
same thing.

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

## Add a company to the career charts

Same file, the `timeline:` section at the very top. **Oldest first, top to bottom.**

One list feeds both charts: the timeline on the home page (when things happened) and the
column chart on the Experience page (how long each job lasted).

- `from:` and `to:` are `"YYYY-MM"`. **Two-digit month** — `"2007-09"`, not `"2007-9"`.
  Use `"present"` for the job you are in now.
- `mark:` is the short name in the tile until you add a logo file. **8 characters or fewer.**
- `kind: "study"` draws a hollow bar and keeps it out of the column chart. Jobs don't need it.
- `current: true` colours it amber. One job only — delete the line from the old one.

**Bar lengths are worked out from the dates**, so nothing goes stale — your current job's bar
grows on its own. There is no number to keep updating.

If you add a job, add it in **two** places: `timeline:` for the charts and `experience:` for
the written entry. They are separate lists on purpose — the charts want one row per company,
the experience list groups the early Dhaka roles into one entry.

## Add your photo

The slot is built and waiting; nothing shows and the layout is unaffected until you add
the file, so there is no rush.

1. Export a square-ish headshot about **600px wide**, under **60KB**. WebP is smallest,
   JPG is fine.
2. In the GitHub app: **Add file → Upload files**, navigate into `public/img/`, and upload
   it as `portrait.webp`.
3. In `public/content/content.js`, near the top, delete the `//` in front of the `photo:`
   line inside `profile:`.
4. Commit both together.

It then appears beside your name on the home page and on the About page — above the name on
a phone, beside it on a wider screen. Space is reserved before it loads, so nothing jumps.

## Add company logos

Both charts show a lettered tile until you give them a logo file. To switch one on:

1. Save the file as `public/img/logos/nokia.svg` (svg, png or webp).
2. In `content.js`, find that company and delete the `//` in front of its `logo:` line.
3. Commit the image and the content change together.

Full instructions, including where to get logo files and what size works, are in
`public/img/logos/README.md`. Only paths inside that folder are accepted — the site can never
be made to load an image from another server.

## Add a project

Same file, the `projects:` section. Copy the fenced block, paste, edit.

- `blurb:` is the short version shown on the home page cards.
- `detail:` is the long version shown only on `/projects/`. Delete the line to use the blurb
  in both places.
- `featured: true` puts it on the home page. **Pick exactly three.** If you mark none, the
  first three are used.
- `outcome:` is the small amber line — a number or result, kept short. Optional.

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

Search for these comment banners:

| What you want to change | File | Search for |
|---|---|---|
| Page title, description, social preview text | each page | `SEO & SOCIAL` |
| Your name, one-line intro, hero email | `public/index.html` | `HERO` |
| The four "what I do" blocks | `public/index.html` | `WHAT I DO` |
| Email and LinkedIn links | `public/index.html` | `CONTACT` |
| The long About story | `public/about/index.html` | `THE LONG VERSION` |
| The six delivery steps | `public/experience/index.html` | `DELIVERY PROCESS` |

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
| `public/tools/tools.js` | The RF calculators' maths. A wrong change here gives wrong numbers, which is worse than an obvious break — ask Claude to add or change a calculator. |

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
