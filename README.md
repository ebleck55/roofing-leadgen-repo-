# roofing-leadgen

Website + lead-gen + content engine for a premium residential roofing business serving The Woodlands and NW Houston (Harris + Montgomery counties).

**Brand:** Northvale Roofing
**Domain:** northvaleroofing.com
**Owner:** ebleck55

> **Scaffold provenance:** the initial 21-file scaffold was built on `ebleck55/bleck-deal-engine@claude/roofing-lead-engine-plan-wPc6X` under `roofing-leadgen/` (MCP allowlist constraint). The full scaffold was copied here and extended — this repo is the permanent home.

## Stack (locked)

- **Site:** Astro 5 + Tailwind 4 + TypeScript (zero-JS-by-default for best Core Web Vitals)
- **Hosting:** Vercel (hybrid output + ISR on content pages)
- **Domain + DNS:** Squarespace Domains (registrar + DNS) — registered 2026-04-23
- **Automation / cron:** GitHub Actions
- **CRM + SMS + email + nurture:** HighLevel Pro SaaS
- **Call tracking + attribution:** CallRail Elite
- **Analytics:** GA4 + server-side GTM
- **Content pipeline LLM:** Anthropic Claude (primary) + OpenAI + Gemini
- **SEO intelligence:** Ahrefs Standard
- **Homeowner targeting data:** PropStream

## Key docs

- [`ONBOARDING.md`](ONBOARDING.md) — start here if you're new: non-technical guide to making website updates via Claude Code
- [`TASKS_FOR_ERIC.md`](TASKS_FOR_ERIC.md) — every open ask that needs a human
- [`STATUS.md`](STATUS.md) — phase-end summaries
- [`docs/brand-voice.md`](docs/brand-voice.md) — local-neighborly + premium-trusted + fast-response-urgency
- [`docs/compliance.md`](docs/compliance.md) — TCPA / CAN-SPAM / TDPSA / §27.02 / §701 / §4102 / §1102 checklist
- [`docs/utm-scheme.md`](docs/utm-scheme.md) — canonical UTM conventions
- [`docs/trademark-clearance.md`](docs/trademark-clearance.md) — USPTO TESS clearance log
- [`docs/runbooks/`](docs/runbooks/) — launch-checklist, storm-window, incident-response playbooks
- [`docs/lead-magnets/`](docs/lead-magnets/) — email-attachable lead magnet content
- [`briefs/README.md`](briefs/README.md) — content pipeline lifecycle docs

## Layout

```
.
├── .github/workflows/        # CI, content-pipeline, nightly-e2e, weekly-compliance
├── briefs/                   # content pipeline briefs (sample checked in; queue/ ignored)
├── docs/                     # brand, compliance, utm, runbooks, lead magnets, trademark
├── public/                   # static assets (favicon, brand/logo, og/default)
├── src/
│   ├── components/           # CTAButton, SiteHeader, LeadForm, Hero, TrustBar, …
│   ├── content/              # content collections (blog MDX, neighborhoods MD, reviews JSON)
│   ├── content.config.ts     # schema definitions (drafts gated from production)
│   ├── layouts/              # BaseLayout, ServiceLayout, NeighborhoodLayout, LegalLayout, BlogLayout
│   ├── lib/                  # brand, service-areas, personas, phone, utm, seo, legal, analytics, highlevel, callrail
│   ├── middleware.ts         # UTM + geo capture
│   ├── pages/                # home, /services/*, /[area], /for-[persona], /legal/*, /blog, /api/*
│   ├── scripts/              # compliance-scan (live); content-pipeline/reviews-sync planned (see its README)
│   └── styles/globals.css    # Tailwind + brand tokens
├── tests/                    # unit (vitest) + e2e (playwright)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Development

```bash
pnpm install
pnpm dev           # local preview at http://localhost:4321
pnpm typecheck
pnpm lint
pnpm test          # unit + integration (vitest)
pnpm test:e2e      # Playwright against dev server (or staging with E2E_BASE_URL)
pnpm lhci          # Lighthouse CI (needs `pnpm build` first)
```

## Day-90 north star (capacity-matched)

By day 90: **10–15 qualified homeowner leads/wk at ≤ ~$100 blended CPL with ≥40%
contact-to-inspection** — sized to a launch delivery capacity of **4–8 jobs/wk** so we
never buy leads we can't service (over-generation is what produces the bad reviews that
kill a young GBP). Plus: **GBP claimed/verified with 20+ reviews ≥4.8**, speed-to-lead
under 5 minutes on every lead (auto-responder + missed-call text-back live), LSA + a
modest Google Search campaign running, and revenue attributed to source for ≥60% of
closed deals (manual HighLevel→QuickBooks join is fine to start).

> Ramp ad spend to capacity, don't blast it: start with LSA + modest Search (~$2–3k/mo),
> hold Meta ~14 days until conversion-event volume supports optimization, and scale only
> on jobs booked — not leads generated. The earlier "50+ leads/wk @ ≤$75 CPL / all 5
> channels live" target was retired: 50 leads/wk implies ~15 jobs/wk ≈ a $15M+ run-rate,
> far beyond first-year crew capacity (see `docs/decision-log.md`).
