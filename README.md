# Travel Split

Travel Split is a local-first trip expense splitter for small groups. It helps travelers record shared costs, see who paid for what, and settle up with clear suggested payments.

Live app: <https://eldesperado.github.io/travel-split/>

## Why this exists

Group trips create small money questions that become annoying fast: who paid for dinner, who owes for tickets, and what is the simplest way to settle without sending money back and forth unnecessarily.

Travel Split keeps that flow lightweight:

- no accounts
- no backend
- no payment connection
- no invite workflow
- no cloud sync

The goal is a private, single-device tool that works during a trip and produces a clear settlement answer at the end.

## Who it is for

Travel Split is for small travel groups that need a simple shared-expense ledger. It is especially useful when one person is comfortable keeping the trip record on their phone or laptop and showing or copying the result for the group.

## UI walkthrough

The screenshots below use a sample trip with three travelers — Alex, Mina, and Jordan — plus three shared expenses: welcome dinner ($120), museum tickets ($75), and airport taxi ($36). Click any image for the full-resolution version.

| Desktop workspace | Mobile · Expenses | Mobile · Settle |
| :---: | :---: | :---: |
| <a href="docs/screenshots/desktop-workspace.png"><img src="docs/screenshots/desktop-workspace.png" width="100%" alt="Travel Split desktop workspace with sample trip data" /></a> | <a href="docs/screenshots/mobile-tabs.png"><img src="docs/screenshots/mobile-tabs.png" width="100%" alt="Travel Split mobile Expenses tab" /></a> | <a href="docs/screenshots/mobile-settle.png"><img src="docs/screenshots/mobile-settle.png" width="100%" alt="Travel Split mobile Settle tab" /></a> |
| Three-column layout: roster, expense form with recent list, and live settlement. | Bottom tab bar with the active Expenses pill and a count badge. | Net balances, suggested payments, and a selected-payment receipt. |

**Desktop** is optimized for planning or reviewing a trip on a laptop. People, Expenses, and Settlement live in one workspace so every new expense immediately updates net balances and suggested payments — no screen switching.

**Mobile** uses a bottom tab bar with three destinations: People (manage travelers), Expenses (record shared costs, with a count badge), and Settle (review who pays whom). The selected tab uses a filled pill around the icon and label for a clear active state while preserving large touch targets. On the Settle tab, tapping a suggested payment expands a receipt-style explanation precise to the cent.

## Main features

- **Add people** — build the trip group quickly with local names.
- **Record expenses** — enter an activity, amount, payer, and split participants.
- **Edit and delete expenses** — revise any saved expense in place; remove people who aren't tied to an expense.
- **Equal and weighted splits** — default to equal splits, with support for custom weights.
- **Settlement suggestions** — calculate who should pay whom to settle balances.
- **Receipt-style explanations** — show why each suggested payment exists.
- **Scoped validation** — each panel shows only its own validation errors, styled distinctly from neutral disclaimers.
- **Trip notifications** — a single banner surfaces global state (new trip ready, storage recovered) without crowding panel content.
- **Local persistence** — save the active trip in the browser using IndexedDB.
- **Responsive layouts** — use a mobile tab layout below 980px and a desktop three-column workspace at wider widths.
- **Private by default** — trip data stays in the browser; there is no server-side storage.

## Product scope

This is a local-first MVP. It intentionally does not include:

- user accounts
- cloud sync
- multi-device collaboration
- invite links
- payment processing
- native mobile app packaging

Those are future product decisions, not accidental omissions.

## Architecture

```mermaid
flowchart LR
  User[Traveler] --> UI[React UI]
  UI --> Provider[TripDataProvider]
  Provider --> Reducer[Trip reducer]
  Provider --> Selectors[Derived selectors]
  Reducer --> Domain[Domain logic]
  Domain --> Money[Integer-cent money math]
  Domain --> Split[Split + settlement engine]
  Domain --> Errors[Validation messages + source mapping]
  Provider --> Repo[TripRepository]
  Repo --> IDB[(IndexedDB snapshot)]

  UI --> Layout[Viewport layout chooser]
  Layout --> Mobile[Mobile tabs < 980px]
  Layout --> Desktop[Desktop workspace >= 980px]
```

### Data flow

```mermaid
sequenceDiagram
  actor Traveler
  participant Screen as People/Expenses/Settle screen
  participant Provider as TripDataProvider
  participant Reducer as tripReducer
  participant Domain as money + split logic
  participant Repo as TripRepository
  participant IDB as IndexedDB

  Traveler->>Screen: Add person or expense
  Screen->>Provider: Dispatch command
  Provider->>Reducer: Apply TripAction
  Reducer->>Domain: Validate and calculate cents/splits
  Domain-->>Reducer: Updated TripState
  Reducer-->>Provider: New state
  Provider->>Repo: Save snapshot
  Repo->>IDB: Persist locally
  Provider-->>Screen: Render updated balances
```

### Design principles

- **Local-first:** data is stored in the browser, not on a server.
- **Pure domain logic:** money, splitting, selectors, and reducers are testable outside React.
- **Persistence seam:** `TripRepository` hides IndexedDB so a future SQLite store can be added without rewriting UI logic.
- **Deterministic money math:** amounts are stored as integer cents and allocated with stable rounding behavior.
- **Responsive shell:** viewport width selects mobile tabs or desktop workspace; both shells share the same domain and data provider.
- **Scoped error surface:** validation errors carry a source (`people`, `expenses`, `global`) so each panel renders only its own; storage failures fall through as global. Source mapping lives in `src/domain/errors.ts`.
- **Plain-English micro-copy:** user-facing messages live in `ERROR_MESSAGES` / `WARNING_MESSAGES`. The voice is action-led ("Add an amount.", "Pick who paid."), no jargon, and every error names the next step.

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- IndexedDB via `idb`
- Vitest for unit coverage
- Playwright for browser validation
- GitHub Actions + GitHub Pages for deployment

## Local development

```bash
npm ci
npm run dev
```

Run the full verification gate:

```bash
npm run verify
```

This runs unit tests with coverage, builds the app, and runs Playwright browser tests.

## Deployment

The app deploys automatically to GitHub Pages when commits are pushed to `main`.

Deployment workflow:

1. install dependencies with `npm ci`
2. install the Chromium Playwright browser
3. set the Vite base path for GitHub Pages
4. run `npm run verify`
5. build and upload `dist`
6. deploy through GitHub Pages

If verification fails, the previous successful GitHub Pages deployment remains live.

## Current status

Travel Split is deployed on GitHub Pages with desktop and mobile layouts, scoped validation messaging, a trip-level notification banner, and IndexedDB persistence. Vitest covers the domain layer (money math, splitting, reducers, error mapping); Playwright drives the People → Expenses → Settle flow end-to-end.
