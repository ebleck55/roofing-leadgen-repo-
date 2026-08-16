# Open tasks — human required

Ordered by the point in the launch path where they're blocking. Check off as they're done; add new ones at the appropriate tier.

> **Printable version:** `docs/execution-plan-next-steps.docx` is a Word-doc
> walkthrough of Tier 0–2 (generated 2026-07-04; revised 2026-07-04 after the LLC
> registered, Google Workspace went live, and Meta access landed). Regenerate it
> with `python scripts/build-execution-plan-doc.py`. It's a **snapshot** — this
> file stays the source of truth; ask a Claude session to regenerate the doc when
> tiers change or you want the next installment (Tier 2.5+).

> **▶ Goal = revenue ASAP, with two part-time owners and 4–8 jobs/wk of capacity.**
> The website is a 6–12 month asset — it will not ring the phone in the revenue window.
> What rings the phone in month one is **Google Business Profile + Local Services Ads +
> review velocity + sub-5-minute lead response.** So the top priority is **Tier 0**
> below, not the SEO expansion. The CRM lead pipeline is already built and dormant in
> code — turning on HighLevel (Tier 0 / Tier 2) is what powers the speed-to-lead
> automation, so it stays a top unblock. See `docs/decision-log.md` (2026-07-04) for the
> reasoning behind this re-sequencing.

## Team onboarding — new website helper (added 2026-07-28)

Grant the new (non-technical) team member access. Their guide is `ONBOARDING.md`;
one-time steps for you, in order:

- [ ] **Invite them on GitHub:** repo → Settings → Collaborators → "Add people" →
      their GitHub username. (They accept the email invite.)
- [ ] **Protect `main`:** repo → Settings → Rules → Rulesets → "New branch ruleset" →
      name it `protect-main`, target the default branch, enable "Require a pull request
      before merging" + "Block force pushes", enforcement "Active". This makes the
      "never push to main" rule enforced for everyone (you included) instead of an
      honor system.
- [ ] **Open up Vercel previews:** Vercel dashboard → project → Settings →
      Deployment Protection → turn **Vercel Authentication off**. Hobby has no team
      seats, so this is how they'll view preview links. (Repo is public, so previews
      being link-viewable exposes nothing new; production is unaffected.)
- [ ] **Send them `ONBOARDING.md`** (or the Claude Code share link from the
      2026-07-28 session) and have them do the two one-time setup steps in §4.

## Tier 0 — phone-ringers & speed-to-lead (do these first; they produce near-term revenue)

These are the fastest path to a ringing phone and mostly live _outside the codebase_.
Because both owners are part-time, the automated pieces matter most — a lead can't wait
on a busy person.

- [ ] **Claim + verify Google Business Profile.** The local 3-pack + LSA sit above
      organic search; this is the single biggest near-term lever. Then paste the GBP URL
      into the admin panel (feeds `sameAs`) and request the Place ID (Tier 2).
- [ ] **Apply for Google Local Services Ads** the day the LLC + GL insurance exist.
      Roofing LSA CPL ≈ $55–90 (about half of blended Google Ads CPL) plus the Google
      Screened badge. Requires the background check + insurance.
- [ ] **Turn on speed-to-lead in HighLevel** — auto-responder SMS (<60s on every form/call
      lead) + **missed-call text-back**. This exists _before the first ad dollar_. See
      **`docs/runbooks/speed-to-lead.md`** for the exact workflow config.
- [ ] **Run the review-request SOP at job #1** (not later) — review _velocity_ is the GBP
      wedge. The process already exists: `docs/sops/review-request.md`. Real reviews only.
- [ ] **Add lead-qualification fields + follow-up cadences in HighLevel** — retail vs.
      insurance claim, roof age, timeline (→ different nurture tracks); a no-answer ×3 →
      90-day recycle cadence; a quote-follow-up sequence (20–30% of signable jobs are lost
      to post-estimate silence). Cheap now, expensive to retrofit.

## Tier 1 — blocks anything going live

- [ ] **Register `Northvale Roofing LLC`** with TX Secretary of State (~$300, 3–5 business days). See `docs/trademark-clearance.md` for why LLC-first.
- [x] **Purchase `northvaleroofing.com`**. _Registered at Squarespace Domains 2026-04-23. DNS managed via Squarespace's built-in manager; records for Vercel + Google Workspace added during launch._
- [x] **Create Vercel project** from this repo. Set `PUBLIC_SITE_URL=https://northvaleroofing.com`. _Project created 2026-04-23; preview builds auto-deploy on every push to this branch. `PUBLIC_SITE_URL` still needs to be set to the real domain once it's registered._
- [ ] **Set up Google Workspace** or at minimum `hello@northvaleroofing.com` with MX/SPF/DKIM/DMARC records.
- [ ] **Create dedicated phone number** (Twilio or Google Voice Business). Update `BRAND.phoneE164` + `phoneDisplay` in `src/lib/brand.ts`.

## Tier 2 — analytics + CRM wiring (blocks attribution)

- [ ] **HighLevel** _(code done — keys pending)_: create sub-account (location), issue Private Integration token, build the sales pipeline. Paste into Vercel env as `HIGHLEVEL_API_KEY` + `HIGHLEVEL_LOCATION_ID`, and (optional, to auto-create pipeline opportunities) `HIGHLEVEL_PIPELINE_ID` + `HIGHLEVEL_PIPELINE_STAGE_ID`. **Step-by-step guide: `docs/setup-highlevel.md`.** The lead form upserts a contact + opens an opportunity automatically once these are set.
- [ ] **CallRail Elite** _(webhook wiring done — keys pending)_: provision 3 tracking numbers (site DNI pool + offline pool + GBP pool). Point the **Post-Call** webhook → `/api/callrail-webhook` with an HMAC-SHA1 secret; set `CALLRAIL_WEBHOOK_SECRET` + `CALLRAIL_API_KEY` + `CALLRAIL_ACCOUNT_ID` + `PUBLIC_CALLRAIL_COMPANY_ID` in Vercel. Completed inbound calls then push into HighLevel as a contact (+ opportunity) and fire the same instant SMS/email alert as form leads.
- [ ] **GA4**: create property + data stream. Set `PUBLIC_GA4_ID`.
- [ ] **Server-side GTM**: stand up container on Vercel subdomain (e.g., `metrics.northvaleroofing.com`). Set `PUBLIC_GTM_ID`.
- [ ] **Meta Business Manager + CAPI** _(server-side code done — keys pending)_: create ad account, issue CAPI token. Set `META_CAPI_TOKEN` + `META_PIXEL_ID`. Every form lead then sends a server-side `Lead` conversion (hashed PII) to Meta automatically.
- [ ] **Google Ads**: create account, set up conversion import from HighLevel (nightly), set `GOOGLE_ADS_CONVERSION_ID`.
- [ ] **Google Business Profile**: claim and verify. Request Place ID (see comment in `.env.example`). Set `GOOGLE_PLACE_ID`.
- [ ] **Google Places API key** issued and scoped for reviews pull. Set `GOOGLE_PLACES_API_KEY`.

## Tier 2.5 — data that unlocks gated SEO pages (added July 2026)

The local-authority expansion shipped with several pages gated `noindex` until
you supply real data (enter it in the /keystatic admin panel or hand it to the
next Claude session):

- [ ] **GBP + social profile URLs** — Business Info → "profile URLs". Feeds the
      `sameAs` structured data on every page. (Set up the Google Business
      Profile first if it doesn't exist yet.)
- [ ] **Financing** — provider + plan terms in Business Info. `/financing`
      publishes automatically once filled. Never let anyone invent rates.
- [ ] **Team** — real names, roles, photos → unlocks `/team`.
- [ ] **Standard workmanship warranty term** (years/coverage) → stated on
      `/warranty` (today it says "on your estimate", which must stay true).
- [ ] **Real project photos** → unlocks `/gallery` + "our work" sections on the
      nine village pages. Real reviews unlock the AggregateRating schema.
- [ ] **Drone**: pages currently make NO drone-inspection claims — tell Claude
      if you buy one so the inspection pages can say so truthfully.
- [ ] **IKO ROOFPRO tier** — confirm Northvale's actual IKO ROOFPRO enrollment
      status/tier. The site says "IKO ROOFPRO applicant" everywhere; a confirmed
      Select+ tier unlocks the "extended Iron Clad, up to 25 years" warranty claim
      (kept off the site until then). See `docs/research-facts.md` Sheet 1B.
- [ ] **IKO colors sold in TX** — the color gallery/config will list IKO's full
      published Dynasty/Nordic palettes; tell Claude which colors Northvale
      actually stocks so we can prune to the real offering.
- [ ] **Project photos ↔ stories** — the 4 homeowner-story photos in
      `public/projects/` were paired to cities in the order supplied
      (Woodlands/Spring/Magnolia/Humble). Confirm each photo is really from that
      city, or send the correct mapping, so filenames + alt text stay truthful.
- [ ] **Re-verify before quoting anywhere**: Angi's Houston-specific cost
      figures and CertainTeed Landmark wind/algae warranty numbers are on the
      research do-not-publish list (docs/research-facts.md) — they need a
      manual check before use.

## Tier 2.6 — copy facts questionnaire (added July 2026 copy review)

The copy review found claims that are probably TRUE given your background but
need your confirmation to be defensible (CLAUDE.md: experience claims are
allowed "once owner supplies numbers"). Answer these and hand them to the next
Claude session — each unlocks stronger copy or fixes a placeholder:

- [ ] **Years in the local roofing market** — how many years have you (and your
      lead crews/foremen) worked roofs in the Houston/Woodlands market? Unlocks
      anchored experience claims site-wide ("N years working Woodlands-area roofs").
- [ ] **Carriers you've actually worked claims with** — name 4–5. The insurance
      page's "Carrier claim processes we know" section was neutralized pending
      this list (`src/lib/services.ts`, NEEDS DATA comment).
- [ ] **Crew model** — W-2 crews, vetted subs, or both? Is "a 10+ year foreman
      on every crew" true and something you'll stand behind? `about.astro` now
      says "our crew or a vetted partner crew" — confirm or tighten.
- [ ] **Manual accessibility testing** — `/legal/accessibility` states we test
      manually with screen readers + keyboard navigation. Confirm this happens
      (or will), otherwise it gets rephrased as a target.
- [ ] **Physical mailing address** — `/legal/tcpa` promises CAN-SPAM-compliant
      marketing email including a physical address; `emailFooterAddress` in
      `src/lib/legal.ts` is blank until the LLC's address is final (Tier 3 item).
- [ ] **Coverage list check** — the draft blog `welcome.mdx` names Bridgeland,
      April Sound, and Magnolia as areas the blog will cover. Confirm these are
      in scope before that post publishes.

## Tier 2.7 — brand identity refresh (added July 2026 brand review)

The new brand guide (`docs/brand-guidelines.md`) is written and the logo art
was recovered from your PDF, but three things only you (or your designer) can
supply — none block launch, all block a clean brand rollout:

- [ ] **Get the original vector logo files** (AI, EPS, or SVG source) from
      whoever made the brand PDF — the PDF only contains pictures of the logo,
      not the master artwork. Our traced copies are faithful but are a stopgap,
      and the guide's own rule is "never redraw the logo."
- [ ] **Lock Pantone colors with your print vendor** — pick the official
      coated + uncoated Pantone matches for the navy and gold before ordering
      yard signs, truck wraps, or embroidered gear, so the gold looks the same
      on every surface. One short email to the vendor with hex `#060E21` and
      `#C9A26C` does it.
- [ ] **Confirm one odd color** — the PDF lists a dark tone `#1E1E2E` that has
      a slight purple tint next to the brand navy. Ask the designer if that was
      intentional; if not, we drop it (details in the guide, section 3.2).

## Tier 3a — performance + accessibility (Lighthouse 0.95 budgets)

Lighthouse CI runs with production budgets (a11y/best-practices/SEO ≥ 0.95, performance ≥ 0.90, and Google's official "good" Core Web Vitals: LCP ≤ 2500ms, TBT ≤ 200ms, CLS ≤ 0.10 on mobile throttle). Budgets are **skipped on draft PRs** so scaffold iteration isn't blocked — ready-for-review PRs and pushes to `main` enforce them. The four pages in `.lighthouserc.json` currently pass all budgets.

- [x] **Self-host Fraunces + Inter** — done. Latin/latin-ext subsets live in `public/fonts/`, declared in `src/styles/globals.css` with `font-display: optional` (zero post-paint reflow → no font CLS) and preloaded in `BaseLayout`. The Google Fonts `<link>` is gone. (`font-display: optional` was chosen over `swap` because it eliminates the layout shift entirely.)
- [ ] **Preload the LCP image** once a real hero exists. Add `<link rel="preload" as="image" href="..." fetchpriority="high">` to `BaseLayout`, and use `loading="eager" fetchpriority="high"` on the `<img>` in `Hero.astro`. (Hero is currently text-only, so the LCP element is text — no image to preload yet.)
- [x] **Color-contrast audit** — done. Footer link lists + legal nav forced to light (were inheriting the dark link color on the navy footer); `--color-gold-700` darkened `#a86611 → #9a5f0f` so the hero eyebrow clears WCAG AA. All pages report color-contrast pass.
- [ ] **Consider deferring GTM to server-side-only** so static pages ship zero client JS. Today `BaseLayout` loads the GTM snippet inline; for a zero-JS-by-default Astro build this is the biggest perf lever left.
- [x] **Verify a11y landmarks + heading hierarchy** — done. Footer column headers `h4 → h2` fixed the heading-order skip; Lighthouse accessibility is 1.0 on every tested page.
- [x] Local `pnpm build && pnpm lhci` (and CI) hit the budgets on the four URLs in `.lighthouserc.json`. PR #3 carries these fixes.

## Tier 3 — legal + compliance

- [ ] **USPTO TEAS 1(b) ITU application** for NORTHVALE ROOFING in IC 037 (after LLC is filed). ~$350 gov't fee; ~$800 with attorney (recommended).
- [ ] **Counsel review** of `/legal/privacy`, `/legal/terms`, `/legal/tcpa`, `/legal/accessibility`. Texas-barred attorney familiar with TDPSA + TCPA.
- [ ] **Fill in LEGAL constants** in `src/lib/legal.ts` — `emailFooterAddress` (physical mailing address) once LLC registered agent is final.
- [ ] **Photograph crew + trucks + finished-job sites** for about + reviews + service pages. Replace stock copy slots. No unlicensed stock.
- [ ] **Remove demo placeholder images before launch.** The site currently shows royalty-free STOCK photos in every image slot for design preview (`public/placeholders/`, wired via `src/lib/demo-images.ts`). Set `USE_DEMO_IMAGES = false` (or delete the folder) and replace each slot with a real Northvale photo via the `src` prop. **Required:** before/after + "recent work" must show only real Northvale jobs (FTC).

## Tier 4 — content engine wiring (SCALE PHASE — not now)

> **Deprioritized for the revenue-ASAP window.** The automated blog-drafting pipeline is
> a scale-phase feature; it does not produce near-term revenue and adds LLM cost. Woodlands
> content is hand-authored + human-gated regardless. Do **not** provision `ANTHROPIC_API_KEY`
> / `OPENAI_API_KEY` yet. Revisit once the flagship is converting and you're expanding to a
> second city. (Decision: `docs/decision-log.md`, 2026-07-04.)

- [ ] **Implement `src/scripts/keyword-brief-generator.ts`** — consumes `keyword-seeds.json`, expands a slot into `briefs/queue/<slug>.json`.
- [ ] **Implement `src/scripts/content-draft.ts`** — consumes a brief, drafts full MDX blog post, writes with `status: draft`, opens a labeled PR.
- [ ] **Implement `src/scripts/compliance-scan.ts`** — weekly, greps built `dist/` for banned phrases (deductible-waiving, "hail-proof", unverified award claims).
- [ ] **Implement `src/scripts/reviews-sync.ts`** — nightly Google Places pull into `src/content/reviews/*.json`.
- [ ] **ANTHROPIC_API_KEY** + **OPENAI_API_KEY** set in Vercel env for the drafter scripts.

## Tier 5 — paid channels + launch

- [ ] **Produce lead magnet PDFs** listed in `docs/lead-magnets/README.md`.
- [ ] **Stand up HighLevel nurture workflows** for homeowner, agent, insurance, HOA, inspector personas.
- [ ] **Google Ads brand + non-brand campaigns** drafted and loaded (paused until CPL signal is real).
- [ ] **Meta conversion campaign** — hold 14 days post-launch until event volume supports optimization.
- [ ] **Run `docs/runbooks/launch-checklist.md`** end-to-end before flipping DNS live.
