# Travel Split App Design

## Summary

Build a local-first web app for friends who travel together and need a simple way to record shared expenses, split costs fairly, and see who should pay whom. The first version is a single-page browser app with no backend, no accounts, and persistent data saved on the user's device.

## Company Operating Baseline

**Company mission:** Ship a trustworthy local-first travel expense splitter that lets small travel groups record costs quickly, understand who owes whom, and settle up without spreadsheets or accounts.

**Primary customer:** Friends, couples, families, and small informal travel groups who share trip expenses and need a fast answer on balances.

**North star for Phase 1:** A user can add people, record equal and weighted expenses, reload the browser, and confidently follow settlement suggestions on desktop or mobile.

**Product reality:** This is an MVP build. The approved product boundary is a single-device, local-first browser app. The team must ship the agreed scope before proposing backend sync, accounts, multi-trip cloud workflows, or monetization work.

**Paperclip operating model:** Paperclip is canonical for goals, projects, issues, assignments, comments, approvals, and completion state. Repo files are durable artifacts after review. Product strategy and scope changes are Founder decisions.

## Goals

### Product Goals

- Add and manage a group of people for one active trip.
- Add expenses with title, amount, payer, participants, and split weights.
- Default every selected participant to equal split weight `1`.
- Support weighted splits, where a participant with weight `2` owes twice the share of a participant with weight `1`.
- Show each person's net balance with clear positive/negative meaning.
- Show simplified settlement suggestions such as "Alex pays Mina $24.50".
- Keep the first version usable on mobile and desktop.
- Persist trip data in browser storage and restore it on reload.

### Quality Goals

- Keep money and split rules in pure TypeScript modules with direct tests.
- Use integer cents internally; never rely on floating-point display values for final balances.
- Keep React components focused on state and interaction, not split math.
- Validate loaded localStorage data so corrupt data does not break the app.
- Verify the critical user journeys manually before reporting the build as done.

### Company Goals

- Ship Phase 1 without scope creep.
- Preserve user trust by making balances explainable, deterministic, and test-covered.
- Keep the implementation maintainable enough for a later server-backed or multi-trip version, without building those features now.

## Non-Goals

- User accounts or authentication.
- Multi-device real-time collaboration.
- Backend database or API.
- Receipt upload or OCR.
- Multi-currency conversion.
- Multiple trips with cloud sync.
- Payment processing, reminders, or settlement collection.
- Budgeting, analytics, or travel planning features.
- Native mobile apps.
- Monetization, pricing, public launch, or marketing site work.

These are not backlog seeds. They require explicit Founder approval before any agent creates planning, research, design, or implementation tasks for them.

## Rules And Policies

### Scope Rules

1. Phase 1 is a local-first single-trip web app. Do not add backend, auth, cloud sync, account, or payment work.
2. Every task must trace to the Phase 1 north star. If it does not help users record expenses, calculate balances, persist locally, or settle up, do not create it.
3. Do not create speculative "future enhancement" tasks. Future items stay in the spec until the Founder approves a new phase.
4. Keep implementation simple: React, Vite, TypeScript, Vitest, localStorage, CSS.
5. New dependencies require a health check and a concrete reason. Prefer platform APIs and existing React/Vite tooling.

### Product-Critical Triggers

The following are product-critical and require Product Lead review before Founder-facing recommendations or durable strategy docs:

- changing split math, rounding, settlement simplification, or invalid-data behavior
- changing the Phase 1 product boundary
- changing the default equal-weight behavior
- adding accounts, backend sync, payments, multiple trips, OCR, or currency conversion
- changing the app's primary user, positioning, or public claims

### Research Routing Policy

Source-backed research, competitor comparisons, pricing/monetization recommendations, and public-claim evidence must be routed to a Research Specialist child issue first. The CEO may read context and synthesize approved evidence, but must not originate research deliverables.

Required chain for research or strategy-impacting work:

```text
Research Specialist -> Evidence Reviewer -> Product Lead (if product-critical) -> CEO -> Founder
```

### Quality Gate Policy

Before any "done" report:

1. Unit tests for money, split, and storage behavior must pass.
2. The production build must pass.
3. The app must be manually checked on desktop and mobile-width viewports.
4. The core journeys must be verified: add people, add equal expense, add weighted expense, edit/delete expense, block referenced-person deletion, reload persistence, and settlement display.
5. CEO must report verification evidence, not forwarded worker claims.

## Engineering Department

Engineering uses a reduced Compound Engineering-inspired workflow. Compound Engineering is workflow inspiration only; it is not a required runtime dependency. If the EveryInc/compound-engineering-plugin tools are installed, the CTO may use equivalent commands. If not, follow this workflow manually in Paperclip.

### Standing Engineering Agents

```text
CEO
└── CTO / Engineering Lead
    ├── TDD Engineer
    └── QE Engineer
        └── On-demand reviewers: Security, Reliability, TypeScript, Testing, Product Lens
```

### CTO / Engineering Lead

- Reviews product specs for ambiguity, contradictions, product-critical changes, and missing acceptance criteria.
- Writes or approves the technical spec and implementation plan before coding starts.
- Creates child issues for implementation, review, validation, deploy verification, and on-demand specialist review.
- Tags the right participants after validation or deploy.
- Escalates product-critical changes through Product Lead, CEO, and Founder approval.
- Does not implement feature code for assigned engineering tasks.

### TDD Engineer

- Implements only approved engineering tasks.
- Uses red/green/refactor:
  1. Red: write the failing test first and report the failing command/result.
  2. Green: implement the smallest change that passes the test and report the passing command/result.
  3. Refactor: simplify while tests stay green and note what changed.
- Posts completion comments with red evidence, green evidence, refactor notes, files changed, and remaining risks.
- Does not approve, deploy, or mark parent engineering work complete.

### QE Engineer

- Reviews implementation against the approved tech spec and acceptance criteria.
- Runs tests, production build, and runtime browser validation.
- Owns simple static deploy verification for Phase 1.
- Creates a dedicated Deployment child issue when deploys become stateful, multi-environment, rollback-sensitive, secret-dependent, or require server configuration.
- Does not change product behavior while validating; defects go back to the TDD Engineer and CTO.

### Participant Notification Matrix

| Event | Tag |
|---|---|
| Tech spec ready | CEO; Product Lead if product-critical |
| Scope or spec inconsistency | CEO, Product Lead, original spec owner |
| TDD implementation ready for review | QE Engineer |
| Review defect found | TDD Engineer, CTO |
| Runtime validation failed | TDD Engineer, CTO |
| Deploy succeeded | CTO, CEO |
| Product behavior changed | CEO, Product Lead |
| Founder decision needed | CEO only, with a decision packet |

### On-Demand Specialist Reviews

Create specialist child issues only when needed:

- Security Reviewer: auth, secrets, private data, network calls, payment, or deployment exposure.
- Reliability Reviewer: persistence, corrupt state, rollback, retries, deployment risk, or data loss.
- TypeScript Reviewer: complex typing, domain model changes, or unsafe casts.
- Testing Reviewer: weak assertions, missing branch coverage, or flaky tests.
- Product Lens Reviewer: user-facing behavior, UX tradeoffs, or product-critical acceptance criteria.

## Product Flow

The app opens directly into the trip workspace. Users first add people by name. They can then add expenses from the same screen without navigating through a setup wizard.

Each expense captures:

- Title, such as "Dinner" or "Boat tickets".
- Amount.
- Payer selected from the group.
- Participants selected from the group.
- Optional split weights for selected participants.

When an expense is saved, the settlement view updates immediately. Users can edit or delete people and expenses. If deleting a person would affect existing expenses, the UI explains that related expenses must be updated or removed first.

## Split Rules

For each expense:

1. Credit the payer by the full amount paid.
2. Sum the weights of all included participants.
3. For each participant, calculate their owed share as `amountCents * participantWeight / totalWeight`.
4. Debit each participant by their owed share.

Across all expenses, a positive balance means the person should receive money. A negative balance means the person owes money.

Settlement suggestions are generated by matching people who owe with people who should receive, producing the fewest practical transfers possible while preserving balances to cents.

Money calculations use integer cents internally. User-entered decimal amounts are converted to cents at input boundaries, and displayed values are formatted back to two decimal places.

## Interface Structure

The first version has three main areas:

- `People`: add names, list trip members, and remove unused members.
- `Expenses`: add expenses, show recent expenses, edit or delete entries.
- `Settlement`: show net balances and suggested payments.

The layout should be dense enough for repeated trip use: compact forms, clear lists, and visible totals. On desktop, use a two-column or three-column workspace when space allows. On mobile, stack sections vertically and keep primary actions easy to reach.

## Use Cases And User Journeys

These journeys describe how a user moves through the `People`, `Expenses`, and `Settlement` areas. They serve as acceptance scenarios for the interface and inform component-level behavior.

### UC-1: Start a new trip and add people

- **Actor**: Trip organizer.
- **Precondition**: App opened for the first time, or trip is empty.
- **Journey**:
  1. User lands directly in the trip workspace; the `People` section is visible and empty.
  2. User types a name into the add-person input and submits.
  3. The new person appears in the people list immediately.
  4. User repeats for each traveler.
- **Outcome**: The group is ready to receive expenses. The `Expenses` section now offers a populated payer and participant selector.
- **Edge cases**: Blank or whitespace-only names are rejected inline. Duplicate names are allowed because IDs are canonical, but duplicate display names are visually disambiguated with a stable short suffix when duplicates exist.

### UC-2: Record an equal-split expense

- **Actor**: Any group member acting as the recorder.
- **Precondition**: At least one person exists.
- **Journey**:
  1. User opens the `Expenses` form (always available on the workspace).
  2. User enters title and amount, picks a payer, and selects participants.
  3. All selected participants default to weight `1`.
  4. User saves the expense.
  5. The expense appears at the top of the recent-expenses list, and the `Settlement` section updates in place.
- **Outcome**: Balances and suggested payments reflect the new expense without a page reload.
- **Edge cases**: Missing required fields block submission with inline messages; the form retains entered values for correction.

### UC-3: Record a weighted-split expense

- **Actor**: Recorder handling an uneven share (e.g., one person ate twice as much, or a couple shares one bill).
- **Precondition**: At least two people exist.
- **Journey**:
  1. User fills in the expense form as in UC-2.
  2. For specific participants, user adjusts the weight from `1` to a higher integer (or fractional value > 0).
  3. The form previews the per-person share if practical, or at minimum shows the total weight.
  4. User saves.
- **Outcome**: The split engine applies `amountCents * weight / totalWeight` per participant. The settlement view reflects the weighted shares.
- **Edge cases**: Weight `0` or negative is rejected; an expense with no selected participants cannot be saved.

### UC-4: Review balances and settle up

- **Actor**: Any group member at trip end (or mid-trip).
- **Precondition**: One or more expenses recorded.
- **Journey**:
  1. User scrolls to or focuses the `Settlement` section.
  2. User sees each person's net balance: positive means owed money, negative means owes money.
  3. User reads simplified transfer suggestions in the form "Alex pays Mina $24.50".
- **Outcome**: Each person knows exactly whom to pay and how much, with the fewest practical transfers.
- **Edge cases**: When all balances net to zero, the section shows an "all settled" state. Sub-cent residuals are absorbed so totals reconcile.

### UC-5: Correct a mistake (edit or delete an expense)

- **Actor**: Recorder noticing a wrong amount, payer, or participant set.
- **Precondition**: The expense exists in the recent-expenses list.
- **Journey**:
  1. User locates the expense and chooses edit or delete.
  2. On edit, the form re-opens prefilled; the user adjusts fields and saves.
  3. On delete, the user confirms; the expense is removed.
  4. Balances and suggestions in `Settlement` update immediately.
- **Outcome**: Trip state and settlements stay accurate.

### UC-6: Remove a person from the trip

- **Actor**: Organizer cleaning up a typo'd or no-longer-relevant entry.
- **Precondition**: The person exists.
- **Journey**:
  1. User selects remove on a person.
  2. If the person is referenced by any expense (as payer or participant), the UI blocks deletion and explains which expenses must be updated or removed first.
  3. If the person is unused, the deletion succeeds immediately.
- **Outcome**: People list stays consistent with expense history; no orphaned references are created.

### UC-7: Return to the trip later (persistence)

- **Actor**: Any user reopening the app on the same device and browser.
- **Precondition**: Prior session saved trip data to localStorage.
- **Journey**:
  1. User reloads or revisits the app.
  2. The trip workspace restores people, expenses, and settlement view from local storage.
- **Outcome**: Work continues without re-entry.
- **Edge cases**: If stored data is unreadable or invalid, the app falls back to an empty trip and remains usable; invalid expenses referencing missing people are excluded from calculations and flagged.

### UC-8: Use the app on a phone during the trip

- **Actor**: Any group member adding an expense at the moment it happens.
- **Precondition**: App opened on a mobile-width viewport.
- **Journey**:
  1. Sections stack vertically; primary actions (add person, add expense) remain reachable without horizontal scrolling.
  2. User adds an expense in a few taps, with the keyboard not obscuring the save action.
  3. After saving, the user can swipe or scroll to the `Settlement` section to confirm.
- **Outcome**: The mobile flow supports in-the-moment capture without forcing a desktop session later.

## UI Wireframes And Style

### Design Principles

- **Workspace, not wizard**: every primary action lives on one screen — no multi-step setup.
- **Calm, paper-like surface**: warm off-white background with a deep-green accent suggests a notebook, not a banking app.
- **Density with breathing room**: lists are compact for repeated entry, but inputs are generous enough for touch.
- **Truthful state**: balances and settlements update inline the instant data changes; no separate "recalculate" step.

### Desktop Layout (≥ 980px)

A three-column workspace inside a 1180px max-width shell. Columns are sized so the middle (Expenses) gets the most room because it sees the most repeated use.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  TRIP WORKSPACE                                                              │
│  Travel Split — one screen, no accounts                                      │
├────────────────────┬─────────────────────────────┬───────────────────────────┤
│ PEOPLE         (4) │ EXPENSES               (12) │ SETTLEMENT                │
│ ┌────────────────┐ │ ┌─────────────────────────┐ │ Net balances              │
│ │ + Add name     │ │ │ Title    [__________]   │ │ ┌───────────────────────┐ │
│ └────────────────┘ │ │ Amount   [__________]   │ │ │ Alex      +24.50 ▲    │ │
│  • Alex      ✎ ✕   │ │ Payer    [▼ Alex     ]  │ │ │ Mina      −24.50 ▼    │ │
│  • Mina      ✎ ✕   │ │ Participants & weights  │ │ │ Sam         0.00 ◦    │ │
│  • Sam       ✎ ✕   │ │  ☑ Alex     [1]         │ │ │ Jo        +12.00 ▲    │ │
│  • Jo        ✎ ✕   │ │  ☑ Mina     [1]         │ │ └───────────────────────┘ │
│                    │ │  ☑ Sam      [2]         │ │ Suggested payments        │
│                    │ │  ☐ Jo       [—]         │ │ ┌───────────────────────┐ │
│                    │ │ [ Save expense ] [Reset]│ │ │ Mina → Alex   $24.50  │ │
│                    │ └─────────────────────────┘ │ │ Sam  → Jo     $12.00  │ │
│                    │ Recent                      │ └───────────────────────┘ │
│                    │  ─ Dinner     $80.00   ✎ ✕  │  All split to cents.      │
│                    │    paid by Alex · 4 ppl     │                           │
│                    │  ─ Boat       $40.00   ✎ ✕  │                           │
│                    │    paid by Sam · 3 ppl      │                           │
└────────────────────┴─────────────────────────────┴───────────────────────────┘
```

### Tablet Layout (560–980px)

Columns collapse to a single column; section order is `People → Expenses → Settlement` so users land on data entry first.

### Mobile Layout (< 560px)

Single column, full-bleed within a 20px gutter. Panels gain reduced padding (14px). The expense form's weight column drops below its checkbox label rather than sitting beside it, so each participant row gets full width.

```
┌──────────────────────────┐
│ Travel Split             │
├──────────────────────────┤
│ PEOPLE              (4)  │
│ [ + Add name        ]    │
│ • Alex            ✎ ✕    │
│ • Mina            ✎ ✕    │
│ • Sam             ✎ ✕    │
│ • Jo              ✎ ✕    │
├──────────────────────────┤
│ EXPENSES           (12)  │
│ Title  [_____________]   │
│ Amount [_____________]   │
│ Payer  [▼ Alex       ]   │
│ ── Participants ──       │
│ ☑ Alex                   │
│   weight [1]             │
│ ☑ Mina                   │
│   weight [1]             │
│ ☑ Sam                    │
│   weight [2]             │
│ [   Save expense    ]    │
│ [   Reset           ]    │
│                          │
│ Recent                   │
│ ─ Dinner   $80.00  ✎ ✕   │
│   paid by Alex · 4 ppl   │
├──────────────────────────┤
│ SETTLEMENT               │
│ Alex     +24.50 ▲        │
│ Mina     −24.50 ▼        │
│ Sam        0.00 ◦        │
│ Jo       +12.00 ▲        │
│ Mina → Alex      $24.50  │
│ Sam  → Jo        $12.00  │
└──────────────────────────┘
```

### Panel Anatomy

Every panel shares the same skeleton so users learn the pattern once:

```
┌─ panel ─────────────────────────────────┐
│  KICKER (uppercase, accent green)  (n)  │  ← .panel-heading + .count-pill
│  Heading                                │
│                                         │
│  [ inline form or primary action ]      │  ← .inline-form / .expense-form
│                                         │
│  · list item                ✎ ✕         │  ← .person-list / .expense-list /
│  · list item                ✎ ✕         │     .settlement-list
│  · list item                ✎ ✕         │
│                                         │
│  (empty state appears here if none)     │  ← .empty-state, dashed border
└─────────────────────────────────────────┘
```

### Color Tokens

The palette is "warm paper + forest ink." Greens carry meaning (credit, action); a single warm red carries debt; amber is reserved for warnings.

| Token              | Hex       | Role                                             |
| ------------------ | --------- | ------------------------------------------------ |
| `--bg-app`         | `#f6f4ee` | Page background (warm cream).                    |
| `--bg-panel`       | `#fffdf8` | Panel surface, slightly brighter than the page.  |
| `--bg-row`         | `#fbf8ef` | List-row surface inside panels.                  |
| `--text-primary`   | `#172018` | Body text, input text.                           |
| `--text-muted`     | `#465145` | Form labels, secondary metadata.                 |
| `--text-subtle`    | `#667064` | Tertiary text, empty-state copy.                 |
| `--accent`         | `#244732` | Primary buttons, deep brand green.               |
| `--accent-soft`    | `#3f6f56` | Kickers, accent text.                            |
| `--accent-pill`    | `#e1eadf` | Count-pill background.                           |
| `--pill-text`      | `#244732` | Count-pill text.                                 |
| `--secondary`      | `#e8e2d2` | Secondary button / icon-button background.       |
| `--border`         | `#d8d3c3` | Panel border.                                    |
| `--border-row`     | `#e2ddcf` | List-row border.                                 |
| `--border-input`   | `#c9c4b6` | Input/select border.                             |
| `--border-dashed`  | `#cac1ac` | Empty-state dashed border.                       |
| `--positive`       | `#1e6b43` | Net credit balance.                              |
| `--negative`       | `#a33d2d` | Net debt balance.                                |
| `--warning-bg`     | `#fff1cd` | Warning banner background.                       |
| `--warning-text`   | `#6d4a00` | Warning banner text.                             |
| `--shadow`         | `rgb(44 52 37 / 8%)` | Panel drop shadow.                    |

### Typography

- **Font stack**: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- **Page title (`h1`)**: fluid `clamp(2rem, 5vw, 4.2rem)`, line-height 1 — the only visually loud type on the screen.
- **Panel heading (`h2`)**: `1.15rem`, normal letter-spacing.
- **Kicker / section eyebrow**: `0.78rem`, 700 weight, uppercase, accent green.
- **Body / inputs**: inherit root (16px effective on most devices).
- **Labels**: `0.88rem`, 700 weight, muted color.
- **Row metadata** (e.g. "paid by Alex · 4 ppl"): `0.88rem`, subtle color.
- Disable font synthesis; render with `optimizeLegibility`.

### Spacing And Sizing

- **App shell**: `min(1180px, 100% − 32px)`, 32px vertical padding (20px on mobile).
- **Panel padding**: 18px desktop, 14px mobile.
- **Panel gap**: 16px between columns and between stacked panels.
- **Form gap**: 12px between fields; 10px between form-action buttons.
- **List gap**: 8px between rows; 10px row padding.
- **Radius**: 8px for panels and empty states, 7px for rows/warnings, 6px for inputs/buttons, 999px for pills.
- **Touch targets**: minimum 42px height for inputs, selects, and primary buttons; 34px for icon buttons (still ≥ 24px hit area + padding).

### Component States

- **Primary button**: solid `--accent` background, white text, 800 weight; disabled state drops opacity to 0.45 and shows `not-allowed`.
- **Secondary button**: `--secondary` background, primary text — used for Reset and destructive cancels.
- **Icon button** (✎ edit, ✕ delete): square 34px, `--secondary` surface, primary text.
- **Inputs / selects**: white background, `--border-input` border, 6px radius, focus ring inherits browser default but stays inside the 42px target height.
- **List row**: `--bg-row` surface with `--border-row`; expense rows align to top to fit a metadata line under the title.
- **Count pill**: pill-shaped, `--accent-pill` bg with `--pill-text` text, used to surface item counts beside panel headings.
- **Balance row**: same row shape as lists; numeric value colored `--positive` or `--negative`; zero balance stays neutral.
- **Empty state**: dashed `--border-dashed`, subtle text, single short sentence plus a hint about the next action (e.g. "Add a person to get started.").
- **Warning banner**: `--warning-bg` background, `--warning-text` text — used when deleting a person who is still referenced by expenses.

### Breakpoints

| Range                 | Layout                                                                 |
| --------------------- | ---------------------------------------------------------------------- |
| `≥ 980px` (desktop)   | Three-column workspace: People · Expenses · Settlement.                |
| `560–980px` (tablet)  | Single column; panels stack in the order People → Expenses → Settlement. |
| `< 560px` (mobile)    | Single column with reduced padding; participant rows stack vertically. |

### Accessibility Notes

- Maintain at least WCAG AA contrast for all text/background pairings in the palette above (the listed greens on cream and reds on cream meet AA for body text; verify any new combinations).
- Every interactive control is reachable by keyboard; icon buttons must expose an accessible name (`aria-label="Edit"`, `"Delete"`).
- Use semantic elements: `<ul>` for lists, `<form>` for entry forms, `<label>` wrapping each input.
- Numeric balances must not rely solely on color — the `▲ / ▼ / ◦` indicator (or text sign) carries the same meaning for users who can't distinguish red/green.
- Respect reduced-motion preferences; the app should have no required animations.

## Architecture

Use React, Vite, and TypeScript.

Suggested modules:

- `src/domain/types.ts`: shared app types.
- `src/domain/split.ts`: pure split and settlement calculations.
- `src/storage/tripStorage.ts`: localStorage serialization and validation.
- `src/App.tsx`: top-level state and layout.
- `src/components/*`: focused UI components for people, expenses, and settlement.

The split calculation must stay independent from React so it can be tested directly.

## Data Model

```ts
type Person = {
  id: string;
  name: string;
};

type ExpenseParticipant = {
  personId: string;
  weight: number;
};

type Expense = {
  id: string;
  title: string;
  amountCents: number;
  payerId: string;
  participants: ExpenseParticipant[];
  createdAt: string;
};

type TripState = {
  people: Person[];
  expenses: Expense[];
};
```

## Validation And Errors

- Person names cannot be blank.
- Duplicate names are allowed, but the UI must disambiguate duplicate display names.
- Expense title cannot be blank.
- Amount must be greater than zero.
- Payer must exist in the people list.
- At least one participant must be selected.
- Participant weights must be greater than zero.
- Expenses referencing missing people are ignored by calculations and surfaced as invalid if encountered from stored data.
- If localStorage contains invalid or unreadable data, the app falls back to an empty trip and keeps the UI usable.

## Testing

Add unit tests for the split engine:

- Equal split with one payer.
- Weighted split.
- Multiple expenses with different payers.
- Simplified settlements between debtors and creditors.
- Integer-cent calculations and two-decimal display formatting.
- Invalid expenses are handled predictably.

For UI verification, run the app locally and inspect the main flows manually on desktop and mobile-width viewports.

## Future Enhancements

- Multiple named trips.
- Shareable trip links backed by a server.
- Export to CSV or image.
- Receipt photo upload.
- Multi-currency expenses.
- Mark settlement payments as completed.
