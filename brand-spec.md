# Brand spec — Portfolio (light, modern-minimal)

Direction: `modern-minimal` (Linear / Vercel) adapted for a full-bleed
background field. The library palette is a near-white paper system, and this
build keeps that posture: the ground is bright, the rules are hairlines, the
accent is a single deep teal. The aurora field survives as a *pastel tint*
behind the content — the same teal / ice / violet hues held at very low chroma
and high lightness — so the page keeps its identity without ever competing with
the type.

## Tokens

```css
:root {
  --bg:      oklch(98.5% 0.003 250);  /* page ground, cool off-white */
  --surface: oklch(100% 0 0);         /* pure white — nav, panels, footer */
  --fg:      oklch(23% 0.018 262);    /* primary text, ~15:1 on --bg */
  --muted:   oklch(46% 0.014 258);    /* secondary text, ~7:1 on --bg */
  --border:  oklch(82% 0.008 258);    /* hairline rules only, ~1.7:1 on --bg */
  --accent:  oklch(48% 0.105 203);    /* deep aurora teal, ~6.5:1 on --bg */
  --accent-deep: oklch(39% 0.1 203);  /* hover ground for solid accents */
  --on-accent: oklch(100% 0 0);       /* text on a solid accent fill */

  --font-display: 'Space Grotesk', 'Prompt', ui-sans-serif, system-ui, sans-serif;
  --font-body:    'Inter', 'Noto Sans Thai', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono:    ui-monospace, 'JetBrains Mono', 'Cascadia Code', Consolas, 'Noto Sans Thai', monospace;
}
```

`color-scheme` is `light`, and the `theme-color` meta matches the ground
(`#f9fafc`, the sRGB reading of `--bg`), so the browser chrome and the OS
scrollbar follow the page instead of inverting it.

Four webfonts are self-hosted as base64 `data:` URIs inside
`assets/css/fonts.css` — the site still makes zero external requests, and the
stylesheet is loaded before `assets/css/site.css`. `Prompt` and
`Noto Sans Thai` carry the Thai script; Thai also gets its own line-height and
tracking overrides under `html[lang="th"]`.

## Rules observed

1. **Hairline borders, no shadows** (except the frosted nav/dropdown), tight
   display tracking at `-0.035em`, tabular numerals for years and indices.
2. **One accent** — deep aurora teal. It appears at most twice per viewport:
   the kicker/marker colour and the single primary CTA. It was a *light* teal
   while the ground was dark; inverting the ground inverted the accent with it,
   because a pale teal is unreadable on white. Every accent that sits on the
   page is now a dark teal with a verified ≥ 4.5:1 contrast ratio, and a solid
   accent fill carries white text.
3. **Frosted surfaces** over the background field (`color-mix` +
   `backdrop-filter`) so text contrast is guaranteed regardless of what sits
   behind them. The hero sits directly on the field, so its text column carries
   a soft radial veil in `--bg` (`.hero-inner::before`) instead of a plate; on
   the light ground that veil is near-white and reads as clean space, so the
   dark `text-shadow` halo the dark build needed was removed.
4. **Type pairing** — Space Grotesk (display) and Inter (body) differ in
   skeleton; mono is reserved for metadata (years, indices, labels).
5. **Motion** — one easing curve (`cubic-bezier(0.2, 0, 0, 1)`, M3 standard),
   150 ms for state feedback, 400–480 ms for reveals, transform/opacity only,
   and every transform is disabled under `prefers-reduced-motion`. The
   background is **static**: it is painted once by the compositor as layered
   radial gradients (`.aurora`) and never repaints, so the page holds a steady
   60 fps with no GPU work and no `requestAnimationFrame` loop.
6. **Two languages, one layout** — every string carries a `data-i18n` key and
   both dictionaries are kept in exact key parity (188 keys each), so switching
   EN/TH never reflows a section into a different structure. The dictionaries
   live in `assets/js/i18n.js`, one `en` block and one `th` block, and every
   key is namespaced by section: `item.*` per project, `exp.*` per employer,
   `act.*` per activity, `sport.*` per sport, and `work.*` / `hero.*` / `about.*`
   / `contact.*` / `meta.*` / `nav.*` for the shared chrome. `meta.title` and
   `meta.description` are set by script rather than by a `data-i18n` attribute.
7. **External artefacts are linked, not described** — a work item that has a
   public artefact (e.g. the `qwenmythos` weights on Hugging Face) shows a
   `Links` row: 92px mono label aligned to the Role/Approach/Outcome column,
   underlined text links at 45% accent, full accent on hover, `↗` in mono.
   Links always point at the real artefact, never a stand-in, and carry an
   `aria-label` that announces the new tab. The JSON-LD `Person` node mirrors
   the identity with `sameAs` → the Hugging Face profile, so the structured
   data and the visible link agree. The Hugging Face Space is deliberately not
   linked: it currently fails to build, and a dead demo link is worse than
   none.

## Content model

The contact address is real — `wuttiphong4work@gmail.com` — and is the single
primary CTA in the page. It appears in three places that must agree: the
button's `mailto:` target, the button's visible label, and the JSON-LD
`Person.email` field. The button label is long, so below 560px the CTA drops
to 14px with tighter padding to keep it inside the viewport without a
horizontal scroll. The remaining placeholder content is the *project outcome*
copy, and the contact note says so explicitly rather than implying the whole
page is unfinished.

The work list holds six rows. The per-project **Role** line uses a
two-value vocabulary rather than six bespoke titles: `AI Engineer` for the
model work (`QwenMythos` — "AI Engineer and model owner" — and `AI OCR`) and
`AI & Technology Specialist` for the platform, retrieval and growth work
(`ORBIT`, `STQ Orbit`, `AI Chatbot (RAG)`, `SEO · GEO · AEO`). The labels sit in
the `Role` row of the same `dl` grid as Approach and Outcome, so a shorter label
never changes the row height or the column rhythm.

`ORBIT` and `STQ Orbit` are two separate platform stories and are kept as two
rows on purpose: `ORBIT` is the internal consolidation (four tools, one
login), `STQ Orbit` is the accounting pipeline that sits in front of
QuickBooks — every record is corrected and validated before it syncs, receipts
are issued automatically, and the accounting team spends up to 50% less time
on it. The 50% figure is the client's own number, so it is stated plainly in
the Outcome row and the About paragraph — and the contact note names the four
rows whose outcomes are still sample copy instead of implying the whole page
is unfinished.

The growth row is titled `SEO · GEO · AEO`: the work covers classic search
optimisation, generative engine optimisation and answer engine optimisation,
so the title states all three and the tags carry `GEO`, `AEO` and `Schema.org`.
The capability chip reads `SEO, GEO & AEO`.

`QwenMythos` is one row that carries the whole
arc of the model: the *training* work (Thai reasoning dataset, Recurrent-Depth
fine-tune on a Qwen3.5 base, 4.2B parameters) and the *release* work
(safetensors weights, Q4_K_M GGUF quantisation, 262k context, download links)
in one Role / Approach / Outcome set, with five tags and both artefact links.
Splitting it into a training row and a release row read as two duplicates of
the same project, so the two halves were merged.

## Structure

```
index.html              markup-only shell: head, JSON-LD, sections
assets/css/fonts.css    base64 @font-face rules (4 webfonts)
assets/css/site.css     design tokens + every layout rule
assets/js/core.js       window.PortfolioCore — reduced-motion + localStorage
assets/js/i18n.js       window.PortfolioI18n — EN/TH dictionaries + applier
assets/js/site.js       reveals, mobile menu, accordion, scroll progress
main.go                 optional static server (go:embed of index.html + assets)
go.mod
brand-spec.md
```

Sections run `01 Work → 02 Experience → 03 Activities → 04 Sports → 05 About → 06 Contact`,
and the nav links mirror that order one-for-one. Six nav links fit the 64px
bar down to 1040px; below that the links tighten to 13px / 8px padding, and
below 720px they collapse into the mobile menu.

A fourth section, a Milestones timeline, stood between Activities and About
and was cut on request. Its content was never the only place a fact lived —
the work rows, the About paragraph and the JSON-LD all carry the same
ground — so removing it left no dangling copy, no `ms.*` dictionary keys and
no orphaned CSS.

## Work experience

The `Experience` section sits between Work and Activities and holds two rows,
one per employer, in the order Smarterware first, Give Education second.

**Smarterware Co., Ltd.** — AI Engineer (Intern). The role is carried by one
project: `AI OCR`, the document-intelligence service that reads Thai and
English invoices end to end. The blurb states the employer's substance
verbatim from its own site: a software engineering house at CMMI Level 3,
certified to ITIL, ISO 27001 and ISO 9001, building end-to-end software for
public and private sectors. The row links to `https://www.smarterware.co.th/`
as a `Company site` link (92px mono label column, underlined at 45% accent,
`↗` in mono, `aria-label` announcing the new tab) and gives the location as
`Nonthaburi, Thailand` — the address on that site is 99/25 หมู่ 4 ซอฟต์แวร์ปาร์ค
ชั้น 10 ถนนแจ้งวัฒนะ ตำบลคลองเกลือ อำเภอปากเกร็ด จังหวัดนนทบุรี 11120.

**Give Education and Aquatots Thailand** — AI & Technology Specialist. This
employer carried every project in the work list except `QwenMythos`: `ORBIT`,
`STQ Orbit`, `AI Chatbot (RAG)` and `SEO · GEO · AEO`. The row has **no link**:
no official company site could be verified, and the rule is that artefacts are
linked, never described — so the employer is named as plain text until a real
URL exists. It is a Thai education group and the master developer of the
Aqua-Tots Swim School franchise across Southeast Asia.

Each row follows the same grid: a 150px metadata column (mono period, type,
location) and a main column (company in display type, role line, description,
then a 92px mono `Projects` label with the project names as pill chips that
reuse the existing `item.*` title keys). The two dates — `2026` and
`2024 – 2026` — are derived from the project years and are the only figures in
the section that still need confirming from the CV.

The JSON-LD `Person` node carries an `affiliation` array with both
organisations; only Smarterware has a `url` field, for the same reason.

## Activities & events

The `Activities` section sits between Experience and About and holds one
row per outside commitment. The first is **H.O.W. — House of Wisdom**, the
invitation-based private community of leaders in Bangkok, joined in the role of
AI & Technology Specialist. The blurb carries the club's own substance —
300+ active members, 26 industries, closed-door learning sessions with some
open to guests — and states the purpose: to listen, to exchange what has been
built, and to meet people whose problems are not yet known. The `Brought back`
row states where that knowledge lands: back inside Give Education and
Aquatots Thailand. The period `2024 – present` is the only figure in the row
that still needs confirming.

The second row is **Bull's Arena — Team Givespace 2.0**, a project team formed
inside the same house; the role is the same — AI & Technology Specialist — but
the contribution is delivery rather than attendance: pushing the idea out of
the conversation and into something that actually runs, so the team ships
instead of stopping at a good plan. The period `2025 – present` is inferred
from the "2.0" iteration and still needs confirming. The row links to the
published Creative Talk article covering **Bull's Arena: Pitching Day** — the
H.O.W. stage where eight member ventures pitch to six national-level coaches
and investors with real investment offers on the table — so the description
cites that event rather than describing it in the abstract. Both activity rows
read `Bangkok, Thailand` — the part that is actually verifiable; the earlier
`Silom` was never confirmed against a source and was dropped so the two rows
describe the same house the same way.

The third row is **Sports & athletics achievements**, TaeKwonDo competitions
at national and university level plus province representation in basketball
and village-level events, joined in the role of AI & Technology Specialist.
The period `2026` is derived from the project years. Focus items list the
key competitions: TaeKwonDo — Chumporn-Ranong Youth Games (33rd National,
Runner-up 2nd place), TaeKwonDo — Kanchanaburi Games (35th, Runner-up 2nd),
TaeKwonDo — Thailand Championship (Cadet category, 4th place), TaeKwonDo —
University games & province representative, and Basketball — Provincial
representative (Lpai province, village-level). Brought back: Sports discipline
has strengthened focus, resilience and teamwork — skills carried into every
technical project.

The row reuses the experience grid rather than inventing a second one: a 150px
metadata column (mono period, mono type, location) and a main column (name in
display type with the outbound links, role line, description, then a 92px mono
label column holding `Focus` pills and the `Brought back` sentence). Two links
point at the real artefact — the club site and its learning-sessions page —
each with an `aria-label` announcing the new tab. The Bull's Arena row follows
the same link treatment with the event article. The JSON-LD `Person` node
carries the club as `memberOf` with its URL.

No build step: the browser loads the same files that sit on disk, so the
OpenDesign preview, a `python -m http.server`, and the Go server all render
identically. Hugo was considered and rejected as the primary setup because it
requires a binary and a template build before the preview can show anything;
it stays available as a follow-up if a content pipeline is ever needed.

## Background field

The aurora look is carried by `.aurora` in `assets/css/site.css` — a
`position:fixed` layer at `z-index:0` holding five layered radial gradients
(teal `oklch(93% 0.055 200)`, ice `oklch(95% 0.038 232)`, violet
`oklch(94% 0.048 300)`) over a white-to-`--bg` base gradient, with `.scrim`
above it at `z-index:1` fading the field into the page at the top and bottom
edges. On the light ground the three hues are held at very low chroma and high
lightness, so the field reads as a pastel tint behind the content rather than a
coloured wash. The layer is painted once and never animated: no canvas, no
WebGL context, no shader, no frame loop. `assets/js/aurora.js`
was removed; the FPS readout and the background pause control went with it,
since neither had anything left to report.

`main.go` embeds `index.html` and `assets/` with `//go:embed` and serves them
over `http.FileServer(http.FS(...))`, so `go run .` yields a self-contained
binary with no asset paths to configure. `ADDR` overrides the default
`127.0.0.1:8080`, and `/healthz` answers `ok`. The Go toolchain is not
installed in the authoring environment, so this file is **not** compile-verified
here — it is plain, standard-library-only Go 1.21+.
