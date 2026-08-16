# CLAUDE.md — Northvale Roofing

Lean operating guide for anyone (human or AI) working in this repo. Read this
before adding pages or content. Full plan: `PLAN.md`. Progress: `TASKS.md`.
Non-technical contributors start with `ONBOARDING.md`.

## What this is

A local-roofing website + safe-to-scale SEO engine for the Houston metro.
Pages render **from data records**, never from name-swapped boilerplate.
Astro 5 + Tailwind 4 on Vercel (hybrid: static content pages with hourly ISR,
plus SSR for `/api/*` and the `/keystatic` admin). pnpm + Node 20.

## Brand + NAP

- **Name:** Northvale Roofing · **Legal:** Northvale Roofing LLC
- **Domain:** northvaleroofing.com
- **NAP must be byte-for-byte identical everywhere.** Single source:
  `src/lib/brand.ts`. Never hardcode phone/address in a page or component.
- The real phone `(713) 449-7661` is live in `src/data/business-info.json` and
  satisfies the NAP index gate. The street address is still blank — schema
  omits it automatically; never invent one. All contact facts flow from
  `business-info.json` → `brand.ts`; edit them there only.
- Visual identity (colors/type/logo rules): `docs/brand-guidelines.md` — live
  on the site since 2026-07. Key rules: brand gold `#C9A26C` fails WCAG on
  light backgrounds — use Gold Deep `#956E37` (`gold-600`) for gold text/icons
  on light; never set Cormorant Garamond below 28px rendered.
- Voice: confident, premium, neighborly-expert. See `docs/brand-voice.md`.
  Positioning is "bold & premium" — sound established — but **only with true,
  defensible claims** (see Hard Rules).

## Hard rules (never break)

1. **No doorway pages.** Never create a page that differs from another only by a
   swapped city/neighborhood/service name. Every indexable page must contain
   substantial, real, page-specific content no other page already covers.
2. **Never fabricate a fact.** No invented addresses, phone numbers, project
   stories, statistics, counts ("500 roofs", "100+ times"), certifications, or
   reviews. Inventing reviews violates the FTC's 2024 rule and is illegal.
   Unknown data = a visible placeholder + a `NEEDS DATA` flag for a human.
3. **NAP identical** across every page (see above).
4. **Thin / data-incomplete pages render `noindex`** and are excluded from the
   sitemap until a human completes them. The quality gate enforces this.
5. **Never push to `main`.** All work on a branch → PR → human review on the
   Vercel preview.
6. **Never touch** DNS, domain settings, secrets, env vars, billing, or auth.
   If a task needs these, stop and tell the owner.
7. **Confirm before** any bulk delete / move / rename.

## Owner-facing instructions (when you send the owner outside the session)

Whenever a task requires the owner to do something outside this session (claim
an account, verify a profile, paste a key, change a setting on a third-party
site), before handing it over you MUST:

1. **Confirm it's truly yours-to-hand-off.** Verify you cannot do it yourself
   from here. If any part is automatable in-session, do that part and only hand
   off the rest.
2. **Give the simplest path.** If a task has multiple routes, pick the one with
   the fewest steps and least friction for a busy, non-technical owner — and say
   why in one line if it's not obvious.
3. **Write true step-by-step instructions.** Numbered, in order, one action per
   step, nothing skipped or assumed. The owner should never have to guess what
   to click next.
4. **Speak non-technically.** Plain language, no jargon. When a technical term
   is unavoidable, define it in the same breath ("the Pixel ID — a string of
   digits Meta gives you").
5. **Ground it in current documentation.** Third-party setup flows change often.
   Check the most recent official docs/help pages you can find (web search/fetch)
   before writing steps, and cite what you relied on, so the owner isn't given
   stale or wrong information.

## Positioning: how to "look established" without lying

Allowed: confident premium voice; the operator's and crews' REAL experience
(once owner supplies numbers); strong warranties / written-estimate promise /
financing the company will honor; serving all 8 cities; true regional
climate/storm facts (sourced, e.g. NOAA); accurate certification _status_
(e.g. "IKO ROOFPRO applicant", not a named ROOFPRO tier unless held).
Forbidden: fake reviews, invented specific numbers presented as fact, false
certs, fake address/GBP. When in doubt, flag it for the owner — don't invent.

## SEO standards

- Unique `<title>` + meta description per page (`buildSeo`, `src/lib/seo.ts`).
  Never reuse a templated title across pages.
- Explicit canonical on every page (handled by `buildSeo` / `BaseLayout`).
- JSON-LD: `RoofingContractor`/LocalBusiness sitewide (`BaseLayout`);
  `Service` + `areaServed` on service pages; `BreadcrumbList` via `Breadcrumbs`;
  `FAQPage` where there's real Q&A. Validate with Google's Rich Results Test.
- Images via the image wrapper with descriptive, specific `alt` text. Reusable
  image slots use `src/components/ImagePlaceholder.astro` — pass a real `src` to
  swap a slot's branded placeholder for a photo in one place (zero layout shift;
  the slot reserves its aspect ratio). `RoofImage` is the underlying `<img>`.
- **Demo images:** `src/lib/demo-images.ts` (`USE_DEMO_IMAGES`) fills every slot
  with royalty-free STOCK for preview only. Set it to `false` (or delete
  `public/placeholders/`) and replace with real Northvale photos before the real
  public launch — stock in before/after or "recent work" would violate Hard Rule
  #2 (FTC). See `TASKS_FOR_ERIC.md`.
- Internal links via `RelatedLinks` fed by the gate-aware graph in
  `src/lib/internal-links.ts` — relevant, not stuffed.
- **One primary query per page** — check `docs/keyword-map.md` before adding or
  retitling any page (city-qualified queries belong to `/the-woodlands/*`, not
  `/services/*`).
- **Every published fact traces to `docs/research-facts.md`** (with source URL).
  Anything on an UNVERIFIED list there stays off the site. New facts get added
  to that doc (sourced) before they get published.
- Sitemap + robots auto-exclude `noindex` pages (`src/lib/routes.ts`). Don't
  add a page to the sitemap by hand.

## Data model + quality gate

- Locations: `src/lib/service-areas.ts`. Services: `src/lib/services.ts`.
  Neighborhoods (villages): `src/lib/neighborhoods.ts`. Service-in-city pages:
  `src/lib/city-services.ts`. Each record has a `dataCompleteness` flag.
- `src/lib/quality-gate.ts` (`evaluateArea` / `evaluateService` /
  `evaluateNeighborhood` / `evaluateCityService`) decides index vs. `noindex`.
  Pages pass their record's verdict into `buildSeo({ noindex })`.
- To publish a page: fill the record with real distinct content, set
  `dataCompleteness: "complete"`, and confirm NAP is real. Don't flip the flag
  on invented content.

## Integrations (lead pipeline)

- **Pattern:** every third-party integration is **env-gated + best-effort** —
  it never throws, missing keys = a clean skip, and a provider failure never
  blocks a lead. `src/lib/notify.ts` is the reference; `highlevel.ts`,
  `meta-capi.ts`, `lead-store.ts`, and the CallRail webhook follow it. Use
  native `fetch`; keep secrets in the `astro.config.mjs` env schema
  (server/secret). One approved exception to native-fetch: `lead-store.ts`
  uses the official `@vercel/blob` SDK (the private-store REST surface is
  undocumented; a silently drifting safety net would defeat its purpose).
- **Flow:** form (`/api/lead`) + tracked calls (`/api/callrail-webhook`) →
  durable lead record in a **private Vercel Blob store** first
  (`lead-store.ts`, gated on `BLOB_READ_WRITE_TOKEN` — the never-lose-a-lead
  net) → HighLevel contact **upsert** (+ pipeline opportunity when
  `HIGHLEVEL_PIPELINE_ID`/`_STAGE_ID` set) + instant SMS/email alert; both
  channels also send a server-side Meta `Lead` conversion (forms as
  `website`, calls as `phone_call` with the CallRail call id as dedup event
  id). One canonical `lead_source` (`src/lib/lead-source.ts`) travels across
  every system.
- **Caveat:** HighLevel v2 payload shapes in `highlevel.ts` were built to the
  docs — confirm against the live account once the real token exists.

## Review workflow

1. Branch (never `main`) → small, self-contained commits.
2. `pnpm build` (runs `astro check`) + `pnpm test` + `pnpm lint` must pass.
3. Open a **draft PR**; owners review the Vercel preview link.
4. Keep `PLAN.md` / `TASKS.md` current so progress survives a context reset.

## Commands

- `pnpm dev` — local server (http://localhost:4321)
- `pnpm build` — typecheck + build · `pnpm preview` — preview the build
- `pnpm test` — unit tests · `pnpm lint` — prettier + astro check
- `pnpm test:e2e` — Playwright · `pnpm lhci` — Lighthouse CI
