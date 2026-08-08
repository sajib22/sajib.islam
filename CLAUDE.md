# CLAUDE.md — standing instructions for sajibislam.com

Read this before doing anything in this repo. It replaces re-explaining the project.

## Working principles

1. **Ask, don't assume.** If something is unclear, ask before writing a single line. Never make silent assumptions about intent, architecture, or requirements. When running unattended, pick the most reasonable interpretation, proceed, and record the assumption rather than blocking — keep a running list of every assumption made and show it to me.
2. **Simplest solution for simple problems, better solutions for harder ones.** Do not over-engineer or add flexibility that isn't needed yet.
3. **Don't touch unrelated code.** Do surface bad code or design smells you discover so we can address them as a separate issue.
4. **Flag uncertainty explicitly.** If you're unsure, see point 1. Where it makes sense, run a small, localised, low-risk experiment and bring me the hypothesis and the results to discuss. Confidence without certainty causes more damage than admitting a gap.
5. **Suggest better ways.** I'm always open to ideas — especially ones with long-lasting impact over tactical fixes. Don't hesitate.

## Hard constraints

1. **Zero cost.** The domain is the only thing I pay for. Everything must fit in permanently free tiers. No paid services, no trials, no credit-card-required tools.
2. **No build step.** Plain HTML, CSS, and vanilla JavaScript. No React, no Tailwind CLI, no npm build pipeline, no bundler. I must be able to read and edit any file directly in a browser.
3. **Mobile-first workflow.** I will be updating this site from my phone using the Claude app plus the GitHub mobile app. Every routine change must be doable by editing one or two obvious files. No step in my normal workflow may require a laptop or a terminal.
4. **Single Worker, room to grow.** The site is a Cloudflare Worker serving static assets. I will later add dynamic features to this same project — do not build anything that would have to be torn out to add a backend.
5. **Nothing secret in the repo.** No API keys, no tokens, no personal address or phone number. The repo is public.

## Architecture, in three sentences

A push to `main` triggers Cloudflare Workers Builds, which deploys the Worker named
`sajibislam-com` with no build command. `src/index.js` is the Worker entry point; today it
passes every request straight to the static files in `public/`, which are served at the root
of sajibislam.com. Everything the visitor sees is plain HTML, CSS and vanilla JS in `public/`
— there is no framework, no bundler and no dependency.

## Where content lives

Four pages: `/` , `/experience/`, `/projects/`, `/about/`.

- `public/content/content.js` — the career chart, experience, skills, projects, education,
  certifications, recognition. One `window.SITE` object, rendered by `public/main.js`.
  **This is the file Sajib edits.** It lives inside `public/` because only files under
  `public/` are served. One list can feed two views: projects show as three cards on the
  home page (`data-render="projects-featured"`) and in full on `/projects/`.
- `public/index.html`, `public/experience/index.html`, `public/projects/index.html`,
  `public/about/index.html` — hero and page copy, prose, contact links, SEO tags, JSON-LD.
- **The header/nav and footer are duplicated across all four page files.** That is the cost
  of having no build step. Change one, change all four.
- `public/styles.css` — the theme is ~8 CSS custom properties in the first 30 lines.

Each section renders inside a `try/catch`: a typo in `content.js` breaks only that section
and prints a message naming the file, rather than blanking the page. It also rejects a value
that should be a list but isn't, so a section can never vanish silently. Keep both.
The renderer uses `textContent`, never `innerHTML` — do not change this.

The career timeline, the column chart and the delivery process are built from HTML and CSS,
not SVG, so labels never shrink with a viewBox and a real logo `<img>` can sit in the axis.
Bar lengths are derived from `from`/`to` dates, never typed, so nothing goes stale. The DAS
riser is inline SVG, hidden below 720px where its labels would render at ~5px, with its text
description shown there instead.

Two traps worth remembering: a visually-hidden `<table>` needs `table-layout: fixed` or it
ignores `width: 1px` and widens the whole page; and an HTML comment containing `-->` in its
text closes early and leaks the markup it was meant to hide.

Company logos load only from `/img/logos/` — `main.js` validates the path, which is what
keeps the no-third-party-requests rule true by construction. See `public/img/logos/README.md`.

## Never do any of these without asking first

- Change the hosting approach (Workers static assets — **not** Pages, not Netlify, not Vercel).
- Add a build step, a bundler, a CSS framework, or a JS framework.
- Add **any** dependency, including a "tiny" one. There is no `package.json` and there should not be.
- Edit `wrangler.jsonc` or `src/index.js`.
- Add anything that costs money, needs a card, or is a trial.
- Add a web font, analytics script, CDN link, or any request to a third-party host.
- Put a phone number, home address, personal email, ID number or credential in the repo.
  The public contact address is `contact@sajibislam.com` and nothing else.

## How to verify a change before pushing

1. **Placeholders.** Search the repo for `[[` — anything left is unfinished copy.
2. **Content file parses.** If you touched `content.js`, load the page; a broken file shows a
   visible error box naming the section. No box, no error.
3. **Links.** Every `href="#..."` must match an `id` on the page. Every external link must be `https://`.
4. **Layout.** Check 360px, 768px and 1440px. No horizontal scrolling at any width.
5. **Both themes.** Check light and dark. Text must stay readable — this site targets WCAG AA.
6. **Weight.** Cold page load stays under 150KB and makes zero requests to another host.
7. **Console.** Zero errors.

Do not commit or push without telling Sajib what is about to be committed.
