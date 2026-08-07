# sajibislam.com

Personal site for **Sajib Islam** — RF engineer in Toronto. In-building 5G and LTE design,
commissioning and optimization.

Plain HTML, CSS and vanilla JavaScript. No framework, no bundler, no dependencies, no build
step. Deployed as a Cloudflare Worker serving static assets; a push to `main` ships it.

## Layout

```
public/            everything served at the root of sajibislam.com
  index.html         the page — head/meta, JSON-LD, hero, about, contact
  styles.css         all styling; the theme is ~8 variables at the top
  main.js            renders content.js into the page; theme toggle
  content/
    content.js       ← experience, skills, projects, education. Edit this.
  404.html  favicon.svg  apple-touch-icon.png  og.png  robots.txt  sitemap.xml
src/
  index.js           Worker entry point — passes everything to public/
wrangler.jsonc       deploy config. Do not edit without checking CONTRIBUTING.md.
```

## Documentation

| File | What it's for |
|---|---|
| **CONTRIBUTING.md** | How to add a job, project or skill; change colours; roll back a bad change. Start here. |
| **SETUP.md** | One-time dashboard steps: Cloudflare Worker, custom domains, email routing, SPF/DMARC. |
| **ROADMAP.md** | Where a contact form, RF calculators and private tools would attach, and their free-tier limits. |
| **CLAUDE.md** | Standing instructions for Claude Code sessions in this repo. |

## Running it locally

There's no build, so any static file server works:

```sh
cd public && python3 -m http.server 8787
```

Then open `http://localhost:8787`.

## Deploy

Automatic. Push to `main` and Cloudflare Workers Builds deploys the Worker named
`sajibislam-com`. Build command is intentionally empty.
