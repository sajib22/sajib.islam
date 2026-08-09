# sajibislam.com

Personal site for **Sajib Islam** — RF engineer in Toronto. In-building 5G and LTE design,
commissioning and optimization.

Plain HTML, CSS and vanilla JavaScript. No framework, no bundler, no dependencies, no build
step. Deployed as a Cloudflare Worker serving static assets; a push to `main` ships it.

## Layout

Four pages: `/`, `/experience/`, `/projects/`, `/about/`.

```
public/                    everything served at the root of sajibislam.com
  index.html                 home — hero, career chart, featured projects, contact
  experience/index.html      career chart, DAS diagram, roles, process, skills
  projects/index.html        every project, long form
  about/index.html           the long story, education, certifications
  styles.css                 all styling; the theme is ~8 variables at the top
  main.js                    renders content.js into whichever page is loaded
  content/
    content.js             ← career chart, experience, skills, projects. Edit this.
  404.html  favicon.svg  apple-touch-icon.png  og.png  robots.txt  sitemap.xml
src/
  index.js                 Worker entry point — passes everything to public/
wrangler.jsonc             deploy config. Do not edit without checking CONTRIBUTING.md.
```

The header and footer are duplicated across the four page files — the cost of having no
build step. Change one, change all four.

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
