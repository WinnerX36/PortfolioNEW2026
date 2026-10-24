# <Project Name> — Project Guide for Claude Code

> This file is auto-loaded by Claude Code. Keep it committed so every teammate's
> Claude session shares the same rules. It is NOT part of the website build.
>
> Template from Muze Labs — "Building a Company Website with Claude Code".
> https://muze.co.th/labs/building-company-website-with-claude-code/
> Replace every <placeholder> with your own project's reality.

## What this is
<One paragraph: what the site is, who it's for, the language(s), and the stack.>

This site is **static** — content is published by editing files in this repo
(**no CMS**), usually with Claude Code. That's the key enabler: content lives as
files, so Claude Code can edit it directly.

---

## ⚠️ Golden rules (the rules that, if broken, silently break the site)
- <e.g. Every page must exist in ALL supported languages (or it drops out of llms/AI search).>
- **Never hand-edit generated files** — edit the generator (see table below).
- **Never add a `static/` file that shadows a generated one** (e.g. `static/robots.txt`
  overrides the generated one and drops your AI-crawler rules).
- **FAQ must have a single source file** — define the path once (e.g. `data/faq.yaml`)
  and make both the page schema and llms read from it. Never hardcode FAQ inline in a template or page.
- <Add your own project's non-obvious "do this or it breaks" rules here.>

---

## Content structure

**Required pages:**
- **Landing** — who you are, in one screen.
- **Services / Products** — one page per offering.
- **Blog** — the *engine* of AI-search discovery. Question / how / why titles,
  entity-rich, in every language. "Articles matter more than the homepage."
- **FAQ** — question→answer shape mirrors how people ask AI. Single source
  (e.g. `data/faq.yaml`) → feeds FAQPage schema AND llms.
- **Contact**
- **Privacy Policy** — legally required if you collect any user data (contact
  forms, cookies, analytics). PDPA in Thailand, GDPR if you have EU visitors.

**Optional pages** (add when relevant):
- **About Us / Our Journey** — brand story and team.
- **Work / Case studies** — real projects with client names + metrics
  (entity-rich → AI cites you with authority).
- **Careers** — if you're hiring.
- **Team** — for trust-building in certain industries.

**Blog volume guideline** (not a rule — adjust to your resources):
- Aim for **20+ articles** as the threshold where AI starts treating you as
  an authority on your topic.
- Sustain at **1–2 articles/month** to keep the library growing.
- Prioritise depth + entity-richness over frequency.

## Publishing a blog post
Create `content/<section>/<slug>/` containing:
1. `index.md` — default language
2. `index.<lang>.md` — every other language (**required** by the golden rule)
3. images in the same folder
Frontmatter: `title, date, description, tags, author, cover`
→ auto-flows into list pages, sitemap, `llms-full.txt`, and Article + Breadcrumb schema.

---

## Generated files — SINGLE SOURCE OF TRUTH (do NOT hand-edit the output)
| Output | Generated from | Notes |
|--------|----------------|-------|
| `/llms.txt`, `/llms-full.txt` | template + `content/` + `data/` | English at root, for AI ingestion |
| `robots.txt` | `layouts/robots.txt` | keep the AI-crawler allow-list |
| `sitemap.xml` | generator default (+ a custom template for any static apps) | |
| FAQ (page + llms) | `data/faq.yaml` | one source, used in both places |

Rule: **write once, generate everywhere.** If you find yourself editing an output
file, stop — edit the source that generates it.

---

## GEO / AI-Search rules
- Keep `llms.txt` + `llms-full.txt` valid (a concise + a full LLM-ingestion doc).
- **Rich JSON-LD**: Organization, Service/Product, FAQPage, Review, Article.
- `robots.txt`: allow AI crawlers — GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot,
  Claude-Web, anthropic-ai, PerplexityBot, Google-Extended, Applebot-Extended, …
- Write **entity-rich** content: name real clients, numbers, product names.
- **Query-first**: keep a list of 12–20 target questions you want AI to answer with
  your site as the source. Validate that landing + services + blog + FAQ cover them.

---

## Design tokens (fill in — so every page is consistent)
- **Colors**: background `<#...>`, text `<#...>`, accent `<#...>`
- **Fonts**: `<display>` + `<body>` (+ per-language face if needed)
- **Radius / spacing / motion**: <your rules; e.g. animate transform/opacity only>
- Accessibility: `:focus-visible` + honor `prefers-reduced-motion`.

---

## Commands
```bash
<npm run dev>          # local preview
<npm run build:prod>   # production build
```

## Version control (Git) — your safety net
Develop on Git. It's what makes letting an AI edit your codebase safe:
- **Roll back anytime** (`git revert` / `git reset`) — so Claude Code can make bold
  changes and a bad edit is one command away from undone.
- **Commit every change** — a clear record of what the AI did; review the `git diff`
  before you trust it. Small, verifiable commits beat one giant one.
- **Branch flow** — work on a branch, open a PR, review, then merge.
  **Never touch the production branch directly.**
- **Deploys ride on Git** — push → merge, no hand-uploading files.

---

## Deploy
<Describe your branch/deploy flow — e.g. commit on `main` → merge to a release
branch → review → deploy.> **Never edit the production branch directly.**

---

## Working with Claude Code (workflow rules)
- **Verify every change**: build, then grep the ACTUAL output — don't trust the source alone.
- **Edit the generator, never the generated output.**
- **Never dump everything into one file.** Left alone, AI tends to generate a whole
  page as one giant file (HTML + CSS + JS merged — we once hit ~20k lines).
  Keep CSS and JS in their own files, and split pages into partials/components
  per your framework. If a file grows past a few hundred lines, split it.
- **New-page checklist**: in llms? in sitemap? structured data? hreflang? OG image? title correct?
- Work in short, verifiable steps. Let Claude read this file first, every session.
