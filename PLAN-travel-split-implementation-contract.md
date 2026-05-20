# Travel Split Implementation Contract

Generated from the design-deck selections. This file is the implementation contract for the first build.

## Source Context

Read before implementation:

- `/Users/crossianllc/Downloads/2026-05-15-travel-split-plans.md`
- `/Users/crossianllc/Downloads/2026-05-15-travel-split-specs.md`

Current codebase state at contract creation:

- Directory: `/Users/crossianllc/Downloads/travel-split`
- Not a git repo.
- Referenced app files do not exist yet.
- Existing file: `pi-session.cast`

## Implementation Addendum — 2026-05-19

This addendum supersedes older localStorage and sticky-workspace implementation details below for the current build.

- Preserve the existing Tailwind tabbed UI in `src/App.tsx`, `PeopleScreen`, `ExpensesScreen`, and `SettleScreen`.
- Use IndexedDB now, SQLite later. Keep persistence behind a `TripRepository` interface.
- Use a reduced v1 IndexedDB shape: active trip metadata plus one validated trip snapshot keyed by `tripId`.
- Keep `tripId` in `TripState` so normalized IndexedDB or SQLite can be introduced later.
- Use `TripDataProvider` to coordinate commands, structured console logs, reducer calls, repository saves, and derived selectors.
- Keep money/split/reducer logic in pure TypeScript modules with unit tests.
- Add Vitest coverage and a Playwright browser smoke test with screenshot evidence.

## Selected Decisions

### 1. Product Boundary

**Selected:** Local-only MVP with shareable summary affordance.

Implement a single-device, localStorage-backed app. Do not add accounts, backend sync, cloud collaboration, payment collection, OCR, multi-trip cloud workflows, or native app work.

Allowed sharing:

- Copy a plain-text settlement summary to clipboard.
- Copy/export read-only trip summary text.
- No writeback, invite identity, shared trip URL, or server persistence.

### 2. App Architecture

**Selected:** Reducer + command actions.

Use a reducer to model trip mutations. Keep money/split logic outside React.

Suggested modules:

```text
src/domain/types.ts
src/domain/money.ts
src/domain/split.ts
src/storage/tripStorage.ts
src/App.tsx
src/components/*
```

Reducer action shape:

```ts
type TripAction =
  | { type: "person.add"; name: string }
  | { type: "person.remove"; personId: string }
  | { type: "expense.upsert"; expense: ExpenseDraft; id?: string }
  | { type: "expense.delete"; expenseId: string }
  | { type: "ui.activeRecorder.set"; personId?: string };
```

### 3. Persistence

**Selected:** Simple validated snapshot.

Persist one `TripState` snapshot to localStorage. Validate the top-level storage shape on load. If the JSON is missing, unreadable, or not shaped like a trip, fall back to an empty trip. If the snapshot is structurally valid but contains semantically invalid expenses, keep the usable data, ignore those expenses in calculations, and surface a warning.

```ts
const STORAGE_KEY = "travel-split-trip";
```

Do not add migrations in Phase 1 unless the data shape changes during implementation.

### 4. Money And Split Policy

**Selected after double-check:** Integer cents + deterministic largest-remainder allocation.

This corrects the deck selection of a decimal math library because the original plan/spec explicitly require integer cents internally and prefer avoiding new dependencies.

Implementation requirements:

- Parse user-entered decimal amounts into integer cents at the input boundary.
- Store final money values as integer cents.
- Calculate weighted shares from integer cents and participant weights.
- Allocate remainder cents deterministically so every expense reconciles exactly to its original amount.
- Use a stable tie-breaker for equal remainders, such as participant order in the expense.
- Unit-test equal split, weighted split, multiple payers, rounding, invalid records, and settlement simplification.

Do not add a decimal arithmetic dependency unless the Founder explicitly approves changing this contract after a dependency health check.

### 5. Workspace Information Architecture

**Selected:** Sticky action rail + anchors.

Use one document/workspace, not routes or tabs.

Desktop:

- Three-column workspace: People · Expenses · Settlement.
- Expenses column gets the most width.

Mobile:

- Single stacked page.
- Sticky quick-jump rail with anchors: People, Expenses, Settle.
- Persistent bottom settlement teaser showing next suggested payment when available.

No router required.

### 6. Expense Entry

**Selected:** Ultra-fast default + Advanced split disclosure.

Default expense flow:

1. Title.
2. Amount.
3. Paid by.
4. Save.

By default, split equally across all active trip people with weight `1`.

Advanced split:

- Use disclosure/accordion pattern.
- Lets recorder include/exclude participants.
- Lets recorder adjust weights.
- Weight must be greater than zero.
- Show compact helper text: `Split equally across N people` or `Custom weighted split`.

### 7. Roster And Permissions

**Selected:** Roster chips + optional identity note.

Roster:

- People are local names/chips.
- Add names quickly from one input.
- Duplicate names may be allowed but should be visually distinguishable if practical.
- Deleting a person referenced by an expense is blocked.

Local identity note:

- Optional `activeRecorderPersonId` in UI/preferences only.
- This is not auth and does not imply accounts.
- Used for convenience copy such as `Recording as Alex`.

### 8. Trust And Explainability

**Selected:** Settlement receipt card.

Settlement UI must show:

- Net balances with sign and non-color cue.
- Suggested payments.
- For each suggested payment, a receipt-style explanation.

Example:

```text
Mina → Alex $24.50
This payment clears Mina's -$24.50 balance and reduces Alex's +$24.50 balance to $0.00.
```

Semantically invalid stored expenses:

- Show an inline warning/alert.
- Ignore invalid expenses in calculations.
- Keep valid people and valid expenses usable.
- Reserve full empty-state fallback for missing, unreadable, or structurally invalid storage snapshots.

### 9. Visual System

**Selected:** Warm paper + forest ink.

Use the spec palette:

```css
--bg-app: #f6f4ee;
--bg-panel: #fffdf8;
--bg-row: #fbf8ef;
--text-primary: #172018;
--text-muted: #465145;
--text-subtle: #667064;
--accent: #244732;
--accent-soft: #3f6f56;
--accent-pill: #e1eadf;
--pill-text: #244732;
--secondary: #e8e2d2;
--border: #d8d3c3;
--border-row: #e2ddcf;
--border-input: #c9c4b6;
--border-dashed: #cac1ac;
--positive: #1e6b43;
--negative: #a33d2d;
--warning-bg: #fff1cd;
--warning-text: #6d4a00;
```

Tone:

- Warm travel notebook, not generic fintech.
- Calm, trustworthy, dense enough for repeated use.
- Avoid fake native-app claims.

## Implementation Tasks

### Task 1 — Scaffold

Create React + Vite + TypeScript + Vitest app with CSS/Tailwind-compatible structure.

Required files:

```text
package.json
index.html
tsconfig.json
tsconfig.node.json
vite.config.ts
src/main.tsx
src/App.tsx
src/App.test.tsx
src/styles.css
```

### Task 2 — Domain Types And Money

Create:

```text
src/domain/types.ts
src/domain/money.ts
src/domain/money.test.ts
```

Types must use `amountCents`, not floating display amounts.

### Task 3 — Split Engine

Create:

```text
src/domain/split.ts
src/domain/split.test.ts
```

Functions:

```ts
calculateBalances(people, expenses)
calculateSettlements(balances)
getInvalidExpenseIds(people, expenses)
explainSettlement(settlement, balances)
```

### Task 4 — Reducer And Storage

Create:

```text
src/domain/tripReducer.ts
src/domain/tripReducer.test.ts
src/storage/tripStorage.ts
src/storage/tripStorage.test.ts
```

Reducer owns mutations. Storage owns validated snapshot load/save.

### Task 5 — UI Components

Create:

```text
src/components/PeoplePanel.tsx
src/components/ExpensePanel.tsx
src/components/SettlementPanel.tsx
src/components/ShareSummaryButton.tsx
src/components/EmptyState.tsx
src/components/StickyAnchorRail.tsx
src/components/SettlementTeaser.tsx
```

### Task 6 — Integration

`App.tsx` wires:

- reducer state
- localStorage persistence
- domain selectors
- sticky anchors
- bottom settlement teaser
- panels
- copy summary affordance

### Task 7 — Verification

Run:

```bash
npm test
npm run build
```

Manual checks:

1. Add Alex, Mina, Sam.
2. Add equal dinner expense.
3. Confirm settlement receipt card.
4. Add weighted expense via Advanced split.
5. Edit/delete expense.
6. Block deleting referenced person.
7. Reload and confirm persistence.
8. Confirm invalid storage fallback.
9. Mobile-width check for sticky anchors, bottom teaser, keyboard-safe save flow.
10. Copy settlement summary.

## Out Of Scope

Do not implement:

- backend
- accounts/auth
- invite links with shared state
- real-time sync
- payment collection
- OCR/receipt upload
- multi-currency conversion
- cloud multi-trip support
- native mobile app

## Double-Check Resolution

The original deck selected a decimal math library, but the source plan/spec are clearer and stricter: use integer cents internally and avoid new dependencies unless necessary. This contract now follows the original plan/spec with deterministic integer-cent allocation.
