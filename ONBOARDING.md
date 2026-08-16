# Welcome to the Northvale Roofing website team

This guide is for you — the newest person helping with website updates. No coding
background needed. Read it once top to bottom (about 10 minutes), then keep it handy.
When in doubt, ask Eric or just ask Claude inside a session — it knows this project's
rules.

---

## 1. What this project is

This repository ("repo" — the folder of files that makes up the website) contains
**northvaleroofing.com**: the public website plus the machinery that turns visitors into
leads (forms, call tracking, CRM connections) for a premium roofing company serving The
Woodlands and NW Houston.

You'll make changes by describing them in plain English to **Claude Code** at
[claude.ai/code](https://claude.ai/code). Claude edits the files, you and Eric review a
preview of the changed site, and only then does it go live.

---

## 2. How the site is built (the 2-minute version)

Two things make this site different from a normal brochure site, and they explain most
of the rules below:

1. **Pages are generated from data records, not copy-paste.** A city page like
   `/the-woodlands` is built from a structured record (facts about that city, real
   services offered there). We **never** create a new page by copying an old one and
   swapping the city name — Google penalizes that ("doorway pages"), and it would sink
   the whole SEO strategy.
2. **Incomplete pages hide themselves from Google.** Every record has a completeness
   flag. A page missing real data is automatically marked so search engines ignore it
   until a human fills in the facts. So "publish it now and fix it later" isn't a thing
   here — and that's deliberate.

The good news: Claude already knows all of this. Its instructions live in `CLAUDE.md` in
this repo, and it reads them at the start of every session.

---

## 3. The golden rules (please actually read these)

These come from `CLAUDE.md` and from the law — not just style preferences:

1. **Never invent a fact.** No made-up review, customer story, statistic ("500 roofs
   installed"), certification, address, or number of any kind. Fake reviews violate an
   FTC rule — it's illegal, not just tacky. If you don't have the real fact, the page
   shows a placeholder and Eric gets flagged to supply it.
2. **The phone number and address live in ONE place.** Never type the phone number or
   address into a page. Google cross-checks them everywhere; one typo hurts local
   rankings. If they ever need to change, tell Claude to change the source data file.
3. **Never work directly on `main`.** `main` is the live site. All changes go on a
   branch (a safe working copy) and through a pull request (see below). Claude does this
   automatically — don't ask it to skip the process.
4. **Never touch** the domain, DNS, passwords/secret keys, billing, or login settings.
   If a task seems to need those, stop and hand it to Eric.
5. **If Claude pushes back on something you asked for** (e.g. "I can't add that claim —
   it's not in our verified facts"), that's the system working. Don't override it;
   loop in Eric instead.

---

## 4. One-time setup (your side)

You need two things, both one-time:

1. **Accept the GitHub invitation.** Eric will invite your GitHub account as a
   collaborator on `ericnorthvale/roofing-leadgen-repo-`. You'll get an email from
   GitHub — click **Accept invitation** while signed in to your GitHub account.
2. **Connect Claude Code on the web to GitHub.**
   1. Go to [claude.ai/code](https://claude.ai/code) and sign in with your Claude
      account.
   2. It will prompt you to connect GitHub. Follow the prompt — it installs/authorizes
      the "Claude" GitHub App for your GitHub account. Grant it access to your
      repositories when asked.
   3. When onboarding offers to create a **Default** environment, keep the defaults.
   4. Back at claude.ai/code, click the repository selector under the message box and
      choose `ericnorthvale/roofing-leadgen-repo-`. If it doesn't appear, make sure you
      accepted the GitHub invitation first (step 1).

That's it. No software to install on your computer.

---

## 5. Running a session (your day-to-day)

1. Go to [claude.ai/code](https://claude.ai/code), pick the repo, and describe what you
   want in plain English. Be specific: "On the /roof-repair page, update the section
   about hail damage to mention we handle insurance claim paperwork" beats "improve the
   repair page."
2. Claude works in the cloud — you can close the tab and come back; the session keeps
   going.
3. When Claude finishes, it will have created a **branch** and opened a **draft pull
   request** (a "PR" — a proposed change waiting for review). It will give you the PR
   link.

Tip: for anything bigger than a small tweak, switch the mode dropdown next to the input
box to **Plan** — Claude will propose an approach and wait for your OK before changing
anything.

---

## 6. How a change goes live (the standard workflow)

Every change, no exceptions, follows this path:

1. **Branch** — Claude makes the change on a safe working copy, never on the live site.
2. **Draft pull request** — the proposed change, opened as a draft on GitHub.
3. **Automatic checks ("CI")** — robots verify the site still builds, the code is
   formatted, and links aren't broken. On the PR page these show up as checks that turn
   green (pass) or red (fail). If something is red, paste the failure into your Claude
   session and ask it to fix it.
4. **Preview** — Vercel (our hosting service) builds a private full copy of the site
   with your change and posts the link on the PR. **Always click it.** Check the change
   on your phone too — most visitors are on phones.
5. **Mark "Ready for review"** — on the PR page, click "Ready for review" to take it out
   of draft. This triggers one final automatic check (a performance test called
   Lighthouse).
6. **Merge** — the "Merge" button folds the change into `main`, and Vercel puts it live
   within a couple of minutes.

### Before you click Merge — the checklist

- [ ] All automatic checks are green.
- [ ] You viewed the preview link on desktop **and** phone, and the change looks right.
- [ ] Every fact in the change is real and you could point to where it came from.
- [ ] For a **new page**: the topic doesn't overlap an existing page
      (`docs/keyword-map.md` is the registry — ask Claude "does this collide with the
      keyword map?").
- [ ] If **anything** feels off or you're unsure — don't merge. Send Eric the PR link
      and preview link instead. Merging is easy to do and annoying to undo; there is
      never a rush.

---

## 7. Good first prompts

Paste these into your first sessions:

1. "Give me a tour of this project: what the site does, how pages are organized, and
   the rules from CLAUDE.md I should know as a non-technical contributor. Don't change
   anything."
2. "Show me what's currently in TASKS.md and suggest one small, low-risk task I could
   do as my first change."
3. "Explain what would happen, step by step, if I asked you to update the wording on
   the financing page — but don't do it yet."

Then do one small real change end-to-end (draft PR → checks → preview → ask Eric to
look → merge) before taking on anything bigger.

---

## 8. Where things are

| I want to…                                   | Look at                                            |
| -------------------------------------------- | -------------------------------------------------- |
| Understand how we operate the site (no code) | `OWNER_GUIDE.md`                                   |
| See the rules Claude follows                 | `CLAUDE.md`                                        |
| See current work / what's next               | `TASKS.md` (progress) · `TASKS_FOR_ERIC.md` (asks) |
| Write in the brand's voice                   | `docs/brand-voice.md`                              |
| Check colors / logo / visual rules           | `docs/brand-guidelines.md`                         |
| Check if a claim is verified                 | `docs/research-facts.md`                           |
| Check if a page topic already exists         | `docs/keyword-map.md`                              |

One more thing that exists but isn't part of your setup yet: an admin panel at
`/keystatic` where Eric edits business info and reviews directly. If you ever need
access, ask Eric.

Welcome aboard.
