# Travel Split App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first React web app for tracking travel expenses, weighted splits, balances, and settlement suggestions.

**Architecture:** The split and money logic live in pure TypeScript domain modules with direct unit tests. Browser persistence is isolated behind a localStorage adapter. React components manage the trip workspace, forms, lists, and settlement display without embedding calculation rules.

**Tech Stack:** React, Vite, TypeScript, Vitest, localStorage, CSS.

## Company Goals, Rules, And Policies

### Mission

Ship a trustworthy local-first travel expense splitter for small travel groups. Phase 1 succeeds when a user can add travelers, record equal and weighted expenses, reload the browser, and follow settlement suggestions on desktop or mobile without accounts or a spreadsheet.

### Phase 1 Product Boundary

- One active trip.
- Browser-only localStorage persistence.
- People, expenses, weighted participants, balances, and settlement suggestions.
- Responsive single-page workspace.
- No backend, accounts, cloud sync, payment collection, OCR, multi-currency conversion, or native mobile app work.

Future enhancements stay in the spec. They are not implementation tasks until the Founder approves a new phase.

### Operating Rules For Agents

1. Paperclip is canonical for goals, projects, issues, assignments, comments, approvals, and completion state.
2. Every implementation issue must link to the Phase 1 goal and a project.
3. Before creating a task, confirm the deliverable does not already exist and has clear acceptance criteria.
4. Do not create busywork when the Phase 1 backlog is complete. Report completion and wait for Founder direction.
5. Keep split and money logic in pure TypeScript modules. React components must not duplicate calculation rules.
6. Use integer cents internally for money. UI formatting is an input/output boundary only.
7. New dependencies require a reason and health check. Prefer the existing React/Vite/Vitest stack.
8. Do not change scope, product positioning, or future roadmap without Founder approval.

### Engineering Department

Use a reduced Compound Engineering-inspired workflow. Compound Engineering is optional workflow inspiration, not a required runtime dependency. If the EveryInc/compound-engineering-plugin tools are installed, the CTO may use equivalent commands; otherwise all steps run manually through Paperclip issues and comments.

```text
CEO
└── CTO / Engineering Lead
    ├── TDD Engineer
    └── QE Engineer
        └── On-demand reviewers: Security, Reliability, TypeScript, Testing, Product Lens
```

#### CTO / Engineering Lead

- Reviews the product spec for missing states, contradictions, product-critical behavior, and acceptance gaps.
- Writes or approves the tech spec and implementation plan before coding.
- Creates child issues for TDD implementation, QE review, runtime validation, deploy verification, and on-demand specialist review.
- Owns participant tagging after validation or deploy.
- Escalates product-critical changes through Product Lead, CEO, and Founder approval.
- Does not implement assigned feature code.

#### TDD Engineer

- Implements only approved engineering issues.
- Works red/green/refactor:
  1. Red: write a failing test and report the failing command/result.
  2. Green: implement the smallest passing change and report the passing command/result.
  3. Refactor: simplify while tests stay green and note what changed.
- Completion comments must include red evidence, green evidence, refactor notes, files changed, and remaining risks.
- Does not approve, deploy, or mark parent engineering work complete.

#### QE Engineer

- Reviews implementation against the approved tech spec and acceptance criteria.
- Runs tests, production build, and runtime browser validation.
- Owns simple static deploy verification for Phase 1.
- Creates a dedicated Deployment child issue when deployment is stateful, multi-environment, rollback-sensitive, secret-dependent, or needs server configuration.
- Does not change product behavior while validating; defects go back to the TDD Engineer and CTO.

#### Participant Notification Matrix

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

#### On-Demand Specialist Reviews

- Security Reviewer: auth, secrets, private data, network calls, payment, or deployment exposure.
- Reliability Reviewer: persistence, corrupt state, rollback, retries, deployment risk, or data loss.
- TypeScript Reviewer: complex typing, domain model changes, or unsafe casts.
- Testing Reviewer: weak assertions, missing branch coverage, or flaky tests.
- Product Lens Reviewer: user-facing behavior, UX tradeoffs, or product-critical acceptance criteria.

### Product-Critical Work

Treat these as product-critical:

- split math, rounding, settlement simplification, or invalid-data policy
- Phase 1 scope changes
- equal-weight default behavior
- adding accounts, backend sync, payments, multiple trips, OCR, or currency conversion
- app positioning, public claims, or user/customer definition

Product-critical research or source-backed recommendations require:

```text
Research Specialist -> Evidence Reviewer -> Product Lead -> CEO -> Founder
```

The CEO may read context, verify work, and synthesize approved outputs. The CEO must not originate source-backed research deliverables.

### Completion Policy

No issue is done until:

- relevant unit or integration tests pass
- `npm run build` passes for final verification
- manual desktop and mobile checks are completed for UI work
- settlement math is verified against at least one equal split and one weighted split
- localStorage reload behavior is verified
- TDD implementation comments include red evidence, green evidence, and refactor notes
- QE review/validation comments include the commands, runtime flows, and deployed URL when applicable
- the completion comment states what was checked and what evidence passed

### Paperclip VPS Bootstrap And Deployment

Use the API clone script plus filesystem scaffold to create the new Paperclip company from an existing company structure. This is a structure clone, not an artifact clone.

Target company:

| Field | Value |
|---|---|
| Name | `Vibe Gangz` |
| Slug | `vibe-gangz` |
| VPS root | `/home/openclaw/paperclip-companies/vibegangz` |
| Paperclip base URL | `http://100.82.107.51:3100` |

Do not copy comments, issue documents, attachments, runs, approvals, costs, API keys, daily notes, completed research, or old company memory. Copy only the company hierarchy, agent/skill/policy structure, project/goal shape, budgets/config shape, and first-day setup issues.

#### Script Contract

The clone script is expected at:

```bash
scripts/clone-paperclip-company-structure.cjs
```

If this file does not exist in the checkout, create or copy it before deployment. Do not hand-edit database rows as a substitute; the clone must go through the Paperclip API plus filesystem scaffold so IDs, run state, locks, and artifacts are not accidentally carried over.

It must support:

- `--dry-run`: print intended API mutations and filesystem writes; do not mutate.
- `--apply`: create the new company, scaffold files, and starter Paperclip entities.
- `PAPERCLIP_BASE_URL`: authenticated Paperclip base URL.
- `PAPERCLIP_AUTH_COOKIE`: board-auth cookie, never committed.
- `SOURCE_COMPANY_ID`: existing company to clone structure from.
- `NEW_COMPANY_NAME`: display name.
- `NEW_COMPANY_SLUG`: Paperclip slug/url key.
- `NEW_COMPANY_ROOT`: filesystem scaffold path on the VPS.

Run the script on the VPS whenever possible so `NEW_COMPANY_ROOT` is a real local path for the script. If run locally, the script must explicitly support SSH filesystem writes; otherwise it can only clone API structure.

#### VPS Deployment Steps

1. **Authenticate to the VPS.**

   ```bash
   ssh hetzner-ts
   ```

   If Tailscale prompts for approval, approve it in the browser before continuing.

2. **Confirm Paperclip is healthy.**

   ```bash
   curl -fsS http://127.0.0.1:3100/api/health
   ```

   Expected: `status: ok`, authenticated deployment, bootstrap ready.

3. **Prepare the playbook/scripts checkout on the VPS.**

   ```bash
   mkdir -p /home/openclaw/paperclip-company-playbook
   cd /home/openclaw/paperclip-company-playbook
   ```

   Then copy or pull the repo contents so `scripts/clone-paperclip-company-structure.cjs` and the templates are present.

4. **Create a private env file for the clone run.**

   ```bash
   cat > /tmp/vibe-gangz-paperclip.env <<'EOF'
   PAPERCLIP_BASE_URL=http://127.0.0.1:3100
   PAPERCLIP_AUTH_COOKIE='PASTE_BOARD_COOKIE_HERE'
   SOURCE_COMPANY_ID='PASTE_SOURCE_COMPANY_ID_HERE'
   NEW_COMPANY_NAME='Vibe Gangz'
   NEW_COMPANY_SLUG='vibe-gangz'
   NEW_COMPANY_ROOT='/home/openclaw/paperclip-companies/vibegangz'
   EOF
   chmod 600 /tmp/vibe-gangz-paperclip.env
   ```

   Use `127.0.0.1` on the VPS. Use `http://100.82.107.51:3100` only when running the script from your local machine.

5. **Run dry-run first.**

   ```bash
   set -a
   . /tmp/vibe-gangz-paperclip.env
   set +a

   node scripts/clone-paperclip-company-structure.cjs --dry-run
   ```

   Review the output before applying. The dry-run must show:

   - new company `Vibe Gangz`
   - new root `/home/openclaw/paperclip-companies/vibegangz`
   - goals/projects recreated without old artifacts
   - agents recreated paused or disabled until verified
   - no copied comments, attachments, run logs, approvals, costs, keys, or old memory

6. **Apply only after dry-run is correct.**

   ```bash
   node scripts/clone-paperclip-company-structure.cjs --apply
   ```

   The script should create:

   - Paperclip company
   - company goal/project skeleton
   - starter setup issues
   - paused Engineering agents: CTO / Engineering Lead, TDD Engineer, QE Engineer
   - filesystem scaffold under `/home/openclaw/paperclip-companies/vibegangz`

7. **Verify filesystem scaffold.**

   ```bash
   test -d /home/openclaw/paperclip-companies/vibegangz
   find /home/openclaw/paperclip-companies/vibegangz -maxdepth 3 -type f | sort
   ```

   Required files:

   - `company/vision.md`
   - `PROJECT-INVENTORY.md`
   - `GOVERNANCE-ROUTING.md`
   - `CONTRIBUTING.md`
   - `agents/ceo/SOUL.md`
   - `agents/ceo/HEARTBEAT.md`
   - `agents/ceo/AGENTS.md`
   - `agents/ceo/TOOLS.md`
   - `agents/cto/AGENTS.md`
   - `agents/tdd-engineer/AGENTS.md`
   - `agents/qe-engineer/AGENTS.md`

8. **Verify Paperclip API state.**

   Replace IDs from the script output:

   ```bash
   curl -fsS "$PAPERCLIP_BASE_URL/api/companies/NEW_COMPANY_ID/org" \
     -H "Cookie: $PAPERCLIP_AUTH_COOKIE"

   curl -fsS "$PAPERCLIP_BASE_URL/api/companies/NEW_COMPANY_ID/goals" \
     -H "Cookie: $PAPERCLIP_AUTH_COOKIE"

   curl -fsS "$PAPERCLIP_BASE_URL/api/companies/NEW_COMPANY_ID/projects" \
     -H "Cookie: $PAPERCLIP_AUTH_COOKIE"
   ```

   Expected:

   - org chart contains CEO, CTO / Engineering Lead, TDD Engineer, QE Engineer
   - project primary workspace points to `/home/openclaw/paperclip-companies/vibegangz`
   - first-day setup issues exist and are linked to goal/project

9. **Fill company placeholders before enabling work.**

   ```bash
   cd /home/openclaw/paperclip-companies/vibegangz
   rg -n '\[[A-Z0-9_ /-]+\]|\[COMPANY|TODO|PLACEHOLDER' .
   ```

   Fill all company-specific values before resuming agents.

10. **Run the first Engineering workflow.**

   - CTO reviews this product spec and writes the tech spec.
   - CTO creates the TDD implementation child issues.
   - TDD Engineer implements red/green/refactor.
   - QE Engineer validates tests/build/runtime behavior.
   - QE Engineer verifies deploy if the app is static/simple.
   - CTO tags participants using the notification matrix.

11. **Clean up secrets.**

   ```bash
   shred -u /tmp/vibe-gangz-paperclip.env 2>/dev/null || rm -f /tmp/vibe-gangz-paperclip.env
   ```

#### Local Dry-Run Variant

If running from this local repo instead of the VPS:

```bash
PAPERCLIP_BASE_URL=http://100.82.107.51:3100 \
PAPERCLIP_AUTH_COOKIE='...' \
SOURCE_COMPANY_ID='...' \
NEW_COMPANY_NAME='Vibe Gangz' \
NEW_COMPANY_SLUG='vibe-gangz' \
NEW_COMPANY_ROOT='/home/openclaw/paperclip-companies/vibegangz' \
node scripts/clone-paperclip-company-structure.cjs --dry-run
```

Only use local `--apply` if the script explicitly supports writing the remote VPS scaffold over SSH. Otherwise run `--apply` on the VPS.

---

## File Structure

- Create `package.json`: npm scripts and dependencies for React, Vite, TypeScript, Vitest, and React Testing Library.
- Create `index.html`: Vite app entry.
- Create `tsconfig.json`, `tsconfig.node.json`: TypeScript configuration.
- Create `vite.config.ts`: Vite and Vitest configuration.
- Create `src/main.tsx`: React entrypoint.
- Create `src/App.tsx`: top-level trip state, persistence, handlers, and layout.
- Create `src/App.test.tsx`: minimal integration tests for adding people and expenses.
- Create `src/styles.css`: responsive app styling.
- Create `src/domain/types.ts`: shared domain types.
- Create `src/domain/money.ts`: parse, format, rounding, and cent allocation helpers.
- Create `src/domain/money.test.ts`: unit tests for money helpers.
- Create `src/domain/split.ts`: balance and settlement calculations.
- Create `src/domain/split.test.ts`: unit tests for equal splits, weighted splits, multiple payers, settlements, rounding, and invalid records.
- Create `src/storage/tripStorage.ts`: localStorage load/save with runtime validation.
- Create `src/storage/tripStorage.test.ts`: tests for empty, valid, and invalid stored data.
- Create `src/components/PeoplePanel.tsx`: add people and remove unused people.
- Create `src/components/ExpensePanel.tsx`: add, edit, and delete expenses.
- Create `src/components/SettlementPanel.tsx`: balances and settlement suggestions.
- Create `src/components/EmptyState.tsx`: compact empty-state copy.

## Task 1: Scaffold App And Test Harness

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/App.test.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Create package manifest**

Create `package.json`:

```json
{
  "name": "traveling-split",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "preview": "vite preview --host 0.0.0.0"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "typescript": "latest",
    "react": "latest",
    "react-dom": "latest",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "jsdom": "latest",
    "vitest": "latest"
  }
}
```

- [ ] **Step 2: Create Vite and TypeScript config**

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Travel Split</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

Create `vite.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: []
  }
});
```

- [ ] **Step 3: Create minimal app shell**

Create `src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Travel Split</p>
        <h1>Split trip costs without the spreadsheet.</h1>
      </header>
    </main>
  );
}
```

Create `src/styles.css`:

```css
:root {
  color: #172018;
  background: #f6f4ee;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
select {
  font: inherit;
}

.app-shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 32px 0;
}

.app-header {
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #3f6f56;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(2rem, 5vw, 4.2rem);
  line-height: 1;
  letter-spacing: 0;
}
```

- [ ] **Step 4: Write smoke test**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the travel split workspace", () => {
    render(<App />);
    expect(screen.getByText("Travel Split")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Split trip costs without the spreadsheet."
      })
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Install dependencies**

Run:

```bash
npm install
```

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 6: Run tests**

Run:

```bash
npm test
```

Expected: the smoke test passes.

- [ ] **Step 7: Optional repo hygiene commit**

If the local worktree is clean enough and the company workflow expects per-task commits, run:

```bash
git add package.json package-lock.json index.html tsconfig.json tsconfig.node.json vite.config.ts src
git commit -m "chore: scaffold travel split app"
```

Paperclip issue completion is canonical. Do not fail the task solely because a local commit is not appropriate for the current worktree.

## Task 2: Money Helpers

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/money.ts`
- Create: `src/domain/money.test.ts`

- [ ] **Step 1: Define domain types**

Create `src/domain/types.ts`:

```ts
export type Person = {
  id: string;
  name: string;
};

export type ExpenseParticipant = {
  personId: string;
  weight: number;
};

export type Expense = {
  id: string;
  title: string;
  amountCents: number;
  payerId: string;
  participants: ExpenseParticipant[];
  createdAt: string;
};

export type TripState = {
  people: Person[];
  expenses: Expense[];
};

export type Balance = {
  personId: string;
  cents: number;
};

export type Settlement = {
  fromPersonId: string;
  toPersonId: string;
  cents: number;
};
```

- [ ] **Step 2: Write failing money helper tests**

Create `src/domain/money.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { allocateCents, formatCents, parseAmountToCents } from "./money";

describe("money helpers", () => {
  it("parses user-entered decimal amounts to integer cents", () => {
    expect(parseAmountToCents("24.50")).toBe(2450);
    expect(parseAmountToCents(" 7 ")).toBe(700);
    expect(parseAmountToCents("7.1")).toBe(710);
  });

  it("rejects invalid amount input", () => {
    expect(parseAmountToCents("")).toBeNull();
    expect(parseAmountToCents("abc")).toBeNull();
    expect(parseAmountToCents("-5")).toBeNull();
    expect(parseAmountToCents("0")).toBeNull();
  });

  it("formats cents for display", () => {
    expect(formatCents(2450)).toBe("$24.50");
    expect(formatCents(-321)).toBe("-$3.21");
    expect(formatCents(0)).toBe("$0.00");
  });

  it("allocates cents by weight while preserving the exact total", () => {
    expect(allocateCents(100, [1, 1, 1])).toEqual([34, 33, 33]);
    expect(allocateCents(1000, [2, 1, 1])).toEqual([500, 250, 250]);
    expect(allocateCents(101, [1, 2])).toEqual([34, 67]);
  });
});
```

- [ ] **Step 3: Run money tests to verify failure**

Run:

```bash
npm test -- src/domain/money.test.ts
```

Expected: FAIL because `src/domain/money.ts` does not exist.

- [ ] **Step 4: Implement money helpers**

Create `src/domain/money.ts`:

```ts
export function parseAmountToCents(input: string): number | null {
  const trimmed = input.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return null;
  }

  const [whole, decimal = ""] = trimmed.split(".");
  const cents = Number(whole) * 100 + Number(decimal.padEnd(2, "0"));
  return cents > 0 ? cents : null;
}

export function formatCents(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const absolute = Math.abs(cents);
  const dollars = Math.floor(absolute / 100);
  const remainder = String(absolute % 100).padStart(2, "0");
  return `${sign}$${dollars}.${remainder}`;
}

export function allocateCents(totalCents: number, weights: number[]): number[] {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  if (totalCents <= 0 || totalWeight <= 0 || weights.some((weight) => weight <= 0)) {
    return weights.map(() => 0);
  }

  const rawShares = weights.map((weight, index) => {
    const raw = (totalCents * weight) / totalWeight;
    return {
      index,
      floor: Math.floor(raw),
      remainder: raw - Math.floor(raw)
    };
  });

  const allocated = rawShares.map((share) => share.floor);
  let remaining = totalCents - allocated.reduce((sum, cents) => sum + cents, 0);

  rawShares
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index)
    .forEach((share) => {
      if (remaining > 0) {
        allocated[share.index] += 1;
        remaining -= 1;
      }
    });

  return allocated;
}
```

- [ ] **Step 5: Run money tests to verify pass**

Run:

```bash
npm test -- src/domain/money.test.ts
```

Expected: PASS.

- [ ] **Step 6: Optional repo hygiene commit**

If appropriate for the current worktree, run:

```bash
git add src/domain/types.ts src/domain/money.ts src/domain/money.test.ts
git commit -m "feat: add money helpers"
```

Paperclip issue completion is canonical. Do not fail the task solely because a local commit is not appropriate for the current worktree.

## Task 3: Split Engine

**Files:**
- Create: `src/domain/split.ts`
- Create: `src/domain/split.test.ts`
- Modify: `src/domain/types.ts`

- [ ] **Step 1: Write failing split tests**

Create `src/domain/split.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { Expense, Person } from "./types";
import { calculateBalances, calculateSettlements, getInvalidExpenseIds } from "./split";

const people: Person[] = [
  { id: "alex", name: "Alex" },
  { id: "mina", name: "Mina" },
  { id: "sam", name: "Sam" }
];

function expense(overrides: Partial<Expense>): Expense {
  return {
    id: "expense-1",
    title: "Dinner",
    amountCents: 3000,
    payerId: "alex",
    participants: [
      { personId: "alex", weight: 1 },
      { personId: "mina", weight: 1 },
      { personId: "sam", weight: 1 }
    ],
    createdAt: "2026-05-15T00:00:00.000Z",
    ...overrides
  };
}

describe("calculateBalances", () => {
  it("splits an expense equally", () => {
    const balances = calculateBalances(people, [expense({})]);
    expect(balances).toEqual([
      { personId: "alex", cents: 2000 },
      { personId: "mina", cents: -1000 },
      { personId: "sam", cents: -1000 }
    ]);
  });

  it("supports weighted splits", () => {
    const balances = calculateBalances(people, [
      expense({
        amountCents: 4000,
        participants: [
          { personId: "alex", weight: 2 },
          { personId: "mina", weight: 1 },
          { personId: "sam", weight: 1 }
        ]
      })
    ]);

    expect(balances).toEqual([
      { personId: "alex", cents: 2000 },
      { personId: "mina", cents: -1000 },
      { personId: "sam", cents: -1000 }
    ]);
  });

  it("combines multiple expenses from different payers", () => {
    const balances = calculateBalances(people, [
      expense({ id: "dinner", amountCents: 3000, payerId: "alex" }),
      expense({ id: "tickets", amountCents: 1500, payerId: "mina" })
    ]);

    expect(balances).toEqual([
      { personId: "alex", cents: 1500 },
      { personId: "mina", cents: 0 },
      { personId: "sam", cents: -1500 }
    ]);
  });

  it("preserves cents when a split does not divide evenly", () => {
    const balances = calculateBalances(people, [
      expense({ amountCents: 100, payerId: "alex" })
    ]);

    expect(balances).toEqual([
      { personId: "alex", cents: 66 },
      { personId: "mina", cents: -33 },
      { personId: "sam", cents: -33 }
    ]);
  });

  it("ignores invalid expenses predictably", () => {
    const balances = calculateBalances(people, [
      expense({ id: "missing-payer", payerId: "unknown" }),
      expense({
        id: "bad-weight",
        participants: [{ personId: "alex", weight: 0 }]
      }),
      expense({ id: "valid", amountCents: 1200, payerId: "sam" })
    ]);

    expect(balances).toEqual([
      { personId: "alex", cents: -400 },
      { personId: "mina", cents: -400 },
      { personId: "sam", cents: 800 }
    ]);
    expect(getInvalidExpenseIds(people, [
      expense({ id: "missing-payer", payerId: "unknown" }),
      expense({
        id: "bad-weight",
        participants: [{ personId: "alex", weight: 0 }]
      }),
      expense({ id: "valid", amountCents: 1200, payerId: "sam" })
    ])).toEqual(["missing-payer", "bad-weight"]);
  });
});

describe("calculateSettlements", () => {
  it("creates simplified payments from debtors to creditors", () => {
    const settlements = calculateSettlements([
      { personId: "alex", cents: 1500 },
      { personId: "mina", cents: 500 },
      { personId: "sam", cents: -2000 }
    ]);

    expect(settlements).toEqual([
      { fromPersonId: "sam", toPersonId: "alex", cents: 1500 },
      { fromPersonId: "sam", toPersonId: "mina", cents: 500 }
    ]);
  });
});
```

- [ ] **Step 2: Run split tests to verify failure**

Run:

```bash
npm test -- src/domain/split.test.ts
```

Expected: FAIL because `src/domain/split.ts` does not exist.

- [ ] **Step 3: Implement split engine**

Create `src/domain/split.ts`:

```ts
import { allocateCents } from "./money";
import type { Balance, Expense, Person, Settlement } from "./types";

function isValidExpense(expense: Expense, peopleById: Map<string, Person>): boolean {
  if (expense.amountCents <= 0) {
    return false;
  }
  if (!peopleById.has(expense.payerId)) {
    return false;
  }
  if (expense.participants.length === 0) {
    return false;
  }
  return expense.participants.every(
    (participant) =>
      peopleById.has(participant.personId) && Number.isFinite(participant.weight) && participant.weight > 0
  );
}

export function getInvalidExpenseIds(people: Person[], expenses: Expense[]): string[] {
  const peopleById = new Map(people.map((person) => [person.id, person]));
  return expenses
    .filter((expense) => !isValidExpense(expense, peopleById))
    .map((expense) => expense.id);
}

export function calculateBalances(people: Person[], expenses: Expense[]): Balance[] {
  const peopleById = new Map(people.map((person) => [person.id, person]));
  const balances = new Map(people.map((person) => [person.id, 0]));

  expenses.forEach((expense) => {
    if (!isValidExpense(expense, peopleById)) {
      return;
    }

    balances.set(expense.payerId, (balances.get(expense.payerId) ?? 0) + expense.amountCents);

    const shares = allocateCents(
      expense.amountCents,
      expense.participants.map((participant) => participant.weight)
    );

    expense.participants.forEach((participant, index) => {
      balances.set(participant.personId, (balances.get(participant.personId) ?? 0) - shares[index]);
    });
  });

  return people.map((person) => ({
    personId: person.id,
    cents: balances.get(person.id) ?? 0
  }));
}

export function calculateSettlements(balances: Balance[]): Settlement[] {
  const creditors = balances
    .filter((balance) => balance.cents > 0)
    .map((balance) => ({ ...balance }))
    .sort((a, b) => b.cents - a.cents);
  const debtors = balances
    .filter((balance) => balance.cents < 0)
    .map((balance) => ({ personId: balance.personId, cents: Math.abs(balance.cents) }))
    .sort((a, b) => b.cents - a.cents);

  const settlements: Settlement[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const cents = Math.min(debtor.cents, creditor.cents);

    if (cents > 0) {
      settlements.push({
        fromPersonId: debtor.personId,
        toPersonId: creditor.personId,
        cents
      });
    }

    debtor.cents -= cents;
    creditor.cents -= cents;

    if (debtor.cents === 0) {
      debtorIndex += 1;
    }
    if (creditor.cents === 0) {
      creditorIndex += 1;
    }
  }

  return settlements;
}
```

- [ ] **Step 4: Run domain tests**

Run:

```bash
npm test -- src/domain
```

Expected: PASS.

- [ ] **Step 5: Optional repo hygiene commit**

If appropriate for the current worktree, run:

```bash
git add src/domain/split.ts src/domain/split.test.ts src/domain/types.ts
git commit -m "feat: calculate weighted trip settlements"
```

Paperclip issue completion is canonical. Do not fail the task solely because a local commit is not appropriate for the current worktree.

## Task 4: localStorage Persistence

**Files:**
- Create: `src/storage/tripStorage.ts`
- Create: `src/storage/tripStorage.test.ts`

- [ ] **Step 1: Write failing storage tests**

Create `src/storage/tripStorage.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import type { TripState } from "../domain/types";
import { emptyTripState, loadTripState, saveTripState } from "./tripStorage";

describe("tripStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("loads an empty trip when storage is empty", () => {
    expect(loadTripState()).toEqual(emptyTripState);
  });

  it("saves and loads a valid trip", () => {
    const trip: TripState = {
      people: [{ id: "alex", name: "Alex" }],
      expenses: [
        {
          id: "dinner",
          title: "Dinner",
          amountCents: 2450,
          payerId: "alex",
          participants: [{ personId: "alex", weight: 1 }],
          createdAt: "2026-05-15T00:00:00.000Z"
        }
      ]
    };

    saveTripState(trip);
    expect(loadTripState()).toEqual(trip);
  });

  it("falls back to an empty trip for unreadable data", () => {
    window.localStorage.setItem("travel-split-trip", "{bad json");
    expect(loadTripState()).toEqual(emptyTripState);
  });

  it("falls back to an empty trip for invalid shape", () => {
    window.localStorage.setItem("travel-split-trip", JSON.stringify({ people: "Alex" }));
    expect(loadTripState()).toEqual(emptyTripState);
  });
});
```

- [ ] **Step 2: Run storage tests to verify failure**

Run:

```bash
npm test -- src/storage/tripStorage.test.ts
```

Expected: FAIL because `src/storage/tripStorage.ts` does not exist.

- [ ] **Step 3: Implement storage adapter**

Create `src/storage/tripStorage.ts`:

```ts
import type { Expense, Person, TripState } from "../domain/types";

const STORAGE_KEY = "travel-split-trip";

export const emptyTripState: TripState = {
  people: [],
  expenses: []
};

function isPerson(value: unknown): value is Person {
  const person = value as Person;
  return (
    typeof person === "object" &&
    person !== null &&
    typeof person.id === "string" &&
    typeof person.name === "string"
  );
}

function isExpense(value: unknown): value is Expense {
  const expense = value as Expense;
  return (
    typeof expense === "object" &&
    expense !== null &&
    typeof expense.id === "string" &&
    typeof expense.title === "string" &&
    typeof expense.amountCents === "number" &&
    Number.isFinite(expense.amountCents) &&
    typeof expense.payerId === "string" &&
    typeof expense.createdAt === "string" &&
    Array.isArray(expense.participants) &&
    expense.participants.every(
      (participant) =>
        typeof participant === "object" &&
        participant !== null &&
        typeof participant.personId === "string" &&
        typeof participant.weight === "number" &&
        Number.isFinite(participant.weight)
    )
  );
}

function isTripState(value: unknown): value is TripState {
  const state = value as TripState;
  return (
    typeof state === "object" &&
    state !== null &&
    Array.isArray(state.people) &&
    Array.isArray(state.expenses) &&
    state.people.every(isPerson) &&
    state.expenses.every(isExpense)
  );
}

export function loadTripState(): TripState {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return emptyTripState;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return isTripState(parsed) ? parsed : emptyTripState;
  } catch {
    return emptyTripState;
  }
}

export function saveTripState(state: TripState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
```

- [ ] **Step 4: Run storage tests**

Run:

```bash
npm test -- src/storage/tripStorage.test.ts
```

Expected: PASS.

- [ ] **Step 5: Optional repo hygiene commit**

If appropriate for the current worktree, run:

```bash
git add src/storage/tripStorage.ts src/storage/tripStorage.test.ts
git commit -m "feat: persist trip state locally"
```

Paperclip issue completion is canonical. Do not fail the task solely because a local commit is not appropriate for the current worktree.

## Task 5: Trip Workspace UI

**Files:**
- Create: `src/components/EmptyState.tsx`
- Create: `src/components/PeoplePanel.tsx`
- Create: `src/components/ExpensePanel.tsx`
- Create: `src/components/SettlementPanel.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing integration tests**

Replace `src/App.test.tsx` with:

```tsx
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("adds people to the trip", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Friend name"), "Alex");
    await user.click(screen.getByRole("button", { name: "Add friend" }));

    expect(screen.getAllByText("Alex").length).toBeGreaterThan(0);
  });

  it("adds an equal split expense and shows settlement", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Friend name"), "Alex");
    await user.click(screen.getByRole("button", { name: "Add friend" }));
    await user.type(screen.getByLabelText("Friend name"), "Mina");
    await user.click(screen.getByRole("button", { name: "Add friend" }));

    await user.type(screen.getByLabelText("Expense title"), "Dinner");
    await user.type(screen.getByLabelText("Amount"), "40");
    await user.click(screen.getByRole("button", { name: "Save expense" }));

    expect(screen.getByText("Dinner")).toBeInTheDocument();
    expect(screen.getByText("Mina pays Alex")).toBeInTheDocument();
    expect(screen.getAllByText("$20.00").length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run integration tests to verify failure**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected: FAIL because the app does not yet render the trip forms.

- [ ] **Step 3: Create EmptyState component**

Create `src/components/EmptyState.tsx`:

```tsx
type EmptyStateProps = {
  title: string;
  body: string;
};

export function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{body}</p>
    </div>
  );
}
```

- [ ] **Step 4: Create PeoplePanel component**

Create `src/components/PeoplePanel.tsx`:

```tsx
import { Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import type { Person } from "../domain/types";
import { EmptyState } from "./EmptyState";

type PeoplePanelProps = {
  people: Person[];
  usedPersonIds: Set<string>;
  onAddPerson: (name: string) => void;
  onRemovePerson: (personId: string) => void;
};

export function PeoplePanel({ people, usedPersonIds, onAddPerson, onRemovePerson }: PeoplePanelProps) {
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onAddPerson(name);
    setName("");
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">People</p>
          <h2>Trip group</h2>
        </div>
        <span className="count-pill">{people.length}</span>
      </div>

      <form className="inline-form" onSubmit={handleSubmit}>
        <label>
          Friend name
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <button type="submit">
          <Plus size={18} aria-hidden="true" />
          Add friend
        </button>
      </form>

      {people.length === 0 ? (
        <EmptyState title="No friends yet" body="Add everyone who will join expenses on this trip." />
      ) : (
        <ul className="person-list">
          {people.map((person) => {
            const isUsed = usedPersonIds.has(person.id);
            return (
              <li key={person.id}>
                <span>{person.name}</span>
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Remove ${person.name}`}
                  title={isUsed ? "Used in an expense" : "Remove"}
                  onClick={() => onRemovePerson(person.id)}
                  disabled={isUsed}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
```

- [ ] **Step 5: Create ExpensePanel component**

Create `src/components/ExpensePanel.tsx`:

```tsx
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { formatCents, parseAmountToCents } from "../domain/money";
import type { Expense, ExpenseParticipant, Person } from "../domain/types";
import { EmptyState } from "./EmptyState";

type ExpensePanelProps = {
  people: Person[];
  expenses: Expense[];
  onSaveExpense: (expense: Omit<Expense, "id" | "createdAt">, expenseId?: string) => void;
  onDeleteExpense: (expenseId: string) => void;
};

type ExpenseDraft = {
  title: string;
  amount: string;
  payerId: string;
  participants: ExpenseParticipant[];
};

function createDraft(people: Person[]): ExpenseDraft {
  return {
    title: "",
    amount: "",
    payerId: people[0]?.id ?? "",
    participants: people.map((person) => ({ personId: person.id, weight: 1 }))
  };
}

export function ExpensePanel({ people, expenses, onSaveExpense, onDeleteExpense }: ExpensePanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ExpenseDraft>(() => createDraft(people));

  const peopleById = useMemo(() => new Map(people.map((person) => [person.id, person])), [people]);

  useEffect(() => {
    if (editingId) {
      return;
    }

    setDraft((current) => {
      const currentParticipants = new Map(
        current.participants.map((participant) => [participant.personId, participant])
      );

      return {
        ...current,
        payerId: people.some((person) => person.id === current.payerId) ? current.payerId : people[0]?.id ?? "",
        participants: people.map(
          (person) => currentParticipants.get(person.id) ?? { personId: person.id, weight: 1 }
        )
      };
    });
  }, [editingId, people]);

  function resetDraft() {
    setEditingId(null);
    setDraft(createDraft(people));
  }

  function toggleParticipant(personId: string) {
    setDraft((current) => {
      const exists = current.participants.some((participant) => participant.personId === personId);
      return {
        ...current,
        participants: exists
          ? current.participants.filter((participant) => participant.personId !== personId)
          : [...current.participants, { personId, weight: 1 }]
      };
    });
  }

  function updateWeight(personId: string, weight: number) {
    setDraft((current) => ({
      ...current,
      participants: current.participants.map((participant) =>
        participant.personId === personId ? { ...participant, weight } : participant
      )
    }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const amountCents = parseAmountToCents(draft.amount);
    if (!amountCents || !draft.title.trim() || !draft.payerId || draft.participants.length === 0) {
      return;
    }
    if (draft.participants.some((participant) => participant.weight <= 0)) {
      return;
    }

    onSaveExpense(
      {
        title: draft.title.trim(),
        amountCents,
        payerId: draft.payerId,
        participants: draft.participants
      },
      editingId ?? undefined
    );
    resetDraft();
  }

  function startEditing(expense: Expense) {
    setEditingId(expense.id);
    setDraft({
      title: expense.title,
      amount: (expense.amountCents / 100).toFixed(2),
      payerId: expense.payerId,
      participants: expense.participants
    });
  }

  return (
    <section className="panel expense-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">Expenses</p>
          <h2>Activities and costs</h2>
        </div>
        <span className="count-pill">{expenses.length}</span>
      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        <label>
          Expense title
          <input
            value={draft.title}
            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            disabled={people.length === 0}
          />
        </label>
        <label>
          Amount
          <input
            inputMode="decimal"
            value={draft.amount}
            onChange={(event) => setDraft((current) => ({ ...current, amount: event.target.value }))}
            disabled={people.length === 0}
          />
        </label>
        <label>
          Paid by
          <select
            value={draft.payerId}
            onChange={(event) => setDraft((current) => ({ ...current, payerId: event.target.value }))}
            disabled={people.length === 0}
          >
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </label>

        <div className="split-list" aria-label="Split between">
          {people.map((person) => {
            const participant = draft.participants.find((entry) => entry.personId === person.id);
            return (
              <div className="split-row" key={person.id}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={Boolean(participant)}
                    onChange={() => toggleParticipant(person.id)}
                  />
                  {person.name}
                </label>
                <label>
                  Weight
                  <input
                    type="number"
                    min="0.25"
                    step="0.25"
                    value={participant?.weight ?? 1}
                    onChange={(event) => updateWeight(person.id, Number(event.target.value))}
                    disabled={!participant}
                  />
                </label>
              </div>
            );
          })}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={people.length === 0}>
            {editingId ? <Save size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
            {editingId ? "Update expense" : "Save expense"}
          </button>
          {editingId ? (
            <button type="button" className="secondary-button" onClick={resetDraft}>
              <X size={18} aria-hidden="true" />
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {expenses.length === 0 ? (
        <EmptyState title="No expenses yet" body="Add meals, transport, rooms, tickets, and other shared costs." />
      ) : (
        <ul className="expense-list">
          {expenses.map((expense) => (
            <li key={expense.id}>
              <div>
                <strong>{expense.title}</strong>
                <span>
                  {formatCents(expense.amountCents)} paid by {peopleById.get(expense.payerId)?.name ?? "Unknown"}
                </span>
              </div>
              <div className="row-actions">
                <button type="button" className="icon-button" aria-label={`Edit ${expense.title}`} onClick={() => startEditing(expense)}>
                  <Pencil size={16} aria-hidden="true" />
                </button>
                <button type="button" className="icon-button" aria-label={`Delete ${expense.title}`} onClick={() => onDeleteExpense(expense.id)}>
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

- [ ] **Step 6: Create SettlementPanel component**

Create `src/components/SettlementPanel.tsx`:

```tsx
import { ArrowRight } from "lucide-react";
import { formatCents } from "../domain/money";
import type { Balance, Person, Settlement } from "../domain/types";
import { EmptyState } from "./EmptyState";

type SettlementPanelProps = {
  people: Person[];
  balances: Balance[];
  settlements: Settlement[];
  invalidExpenseIds: string[];
};

export function SettlementPanel({ people, balances, settlements, invalidExpenseIds }: SettlementPanelProps) {
  const peopleById = new Map(people.map((person) => [person.id, person]));

  return (
    <section className="panel settlement-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">Settlement</p>
          <h2>Who pays whom</h2>
        </div>
      </div>

      {invalidExpenseIds.length > 0 ? (
        <p className="warning">Some saved expenses reference missing or invalid people and are not included.</p>
      ) : null}

      {people.length === 0 ? (
        <EmptyState title="Nothing to settle" body="Add friends and expenses to see balances." />
      ) : (
        <>
          <div className="balance-list">
            {balances.map((balance) => (
              <div className="balance-row" key={balance.personId}>
                <span>{peopleById.get(balance.personId)?.name ?? "Unknown"}</span>
                <strong className={balance.cents >= 0 ? "positive" : "negative"}>{formatCents(balance.cents)}</strong>
              </div>
            ))}
          </div>

          {settlements.length === 0 ? (
            <EmptyState title="All even" body="No payments are needed right now." />
          ) : (
            <ul className="settlement-list">
              {settlements.map((settlement) => (
                <li key={`${settlement.fromPersonId}-${settlement.toPersonId}-${settlement.cents}`}>
                  <span>{peopleById.get(settlement.fromPersonId)?.name ?? "Unknown"} pays {peopleById.get(settlement.toPersonId)?.name ?? "Unknown"}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                  <strong>{formatCents(settlement.cents)}</strong>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
```

- [ ] **Step 7: Replace App with integrated state and persistence**

Replace `src/App.tsx` with:

```tsx
import { useEffect, useMemo, useState } from "react";
import { ExpensePanel } from "./components/ExpensePanel";
import { PeoplePanel } from "./components/PeoplePanel";
import { SettlementPanel } from "./components/SettlementPanel";
import { calculateBalances, calculateSettlements, getInvalidExpenseIds } from "./domain/split";
import type { Expense, Person, TripState } from "./domain/types";
import { emptyTripState, loadTripState, saveTripState } from "./storage/tripStorage";

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export default function App() {
  const [trip, setTrip] = useState<TripState>(() => {
    if (typeof window === "undefined") {
      return emptyTripState;
    }
    return loadTripState();
  });

  useEffect(() => {
    saveTripState(trip);
  }, [trip]);

  const usedPersonIds = useMemo(() => {
    const ids = new Set<string>();
    trip.expenses.forEach((expense) => {
      ids.add(expense.payerId);
      expense.participants.forEach((participant) => ids.add(participant.personId));
    });
    return ids;
  }, [trip.expenses]);

  const balances = useMemo(() => calculateBalances(trip.people, trip.expenses), [trip.people, trip.expenses]);
  const settlements = useMemo(() => calculateSettlements(balances), [balances]);
  const invalidExpenseIds = useMemo(
    () => getInvalidExpenseIds(trip.people, trip.expenses),
    [trip.people, trip.expenses]
  );

  function addPerson(name: string) {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    setTrip((current) => ({
      ...current,
      people: [...current.people, { id: createId("person"), name: trimmed }]
    }));
  }

  function removePerson(personId: string) {
    if (usedPersonIds.has(personId)) {
      return;
    }
    setTrip((current) => ({
      ...current,
      people: current.people.filter((person) => person.id !== personId)
    }));
  }

  function saveExpense(expenseDraft: Omit<Expense, "id" | "createdAt">, expenseId?: string) {
    setTrip((current) => {
      if (expenseId) {
        return {
          ...current,
          expenses: current.expenses.map((expense) =>
            expense.id === expenseId ? { ...expense, ...expenseDraft } : expense
          )
        };
      }

      return {
        ...current,
        expenses: [
          {
            ...expenseDraft,
            id: createId("expense"),
            createdAt: new Date().toISOString()
          },
          ...current.expenses
        ]
      };
    });
  }

  function deleteExpense(expenseId: string) {
    setTrip((current) => ({
      ...current,
      expenses: current.expenses.filter((expense) => expense.id !== expenseId)
    }));
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Travel Split</p>
        <h1>Split trip costs without the spreadsheet.</h1>
      </header>

      <div className="workspace">
        <PeoplePanel
          people={trip.people}
          usedPersonIds={usedPersonIds}
          onAddPerson={addPerson}
          onRemovePerson={removePerson}
        />
        <ExpensePanel people={trip.people} expenses={trip.expenses} onSaveExpense={saveExpense} onDeleteExpense={deleteExpense} />
        <SettlementPanel
          people={trip.people}
          balances={balances}
          settlements={settlements}
          invalidExpenseIds={invalidExpenseIds}
        />
      </div>
    </main>
  );
}
```

- [ ] **Step 8: Replace styles with complete responsive layout**

Replace `src/styles.css` with:

```css
:root {
  color: #172018;
  background: #f6f4ee;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
select {
  font: inherit;
}

button {
  border: 0;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.app-shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 32px 0;
}

.app-header {
  margin-bottom: 24px;
}

.eyebrow,
.section-kicker {
  margin: 0 0 6px;
  color: #3f6f56;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(2rem, 5vw, 4.2rem);
  line-height: 1;
  letter-spacing: 0;
}

h2 {
  margin: 0;
  font-size: 1.15rem;
  letter-spacing: 0;
}

.workspace {
  display: grid;
  grid-template-columns: minmax(240px, 0.85fr) minmax(360px, 1.35fr) minmax(280px, 1fr);
  gap: 16px;
  align-items: start;
}

.panel {
  min-width: 0;
  border: 1px solid #d8d3c3;
  border-radius: 8px;
  background: #fffdf8;
  padding: 18px;
  box-shadow: 0 10px 30px rgb(44 52 37 / 8%);
}

.panel-heading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.count-pill {
  min-width: 32px;
  border-radius: 999px;
  background: #e1eadf;
  color: #244732;
  padding: 4px 9px;
  text-align: center;
  font-weight: 700;
}

label {
  display: grid;
  gap: 6px;
  color: #465145;
  font-size: 0.88rem;
  font-weight: 700;
}

input,
select {
  width: 100%;
  min-height: 42px;
  border: 1px solid #c9c4b6;
  border-radius: 6px;
  background: white;
  color: #172018;
  padding: 9px 10px;
}

.inline-form,
.expense-form {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.inline-form button,
.form-actions button {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 6px;
  background: #244732;
  color: white;
  padding: 0 14px;
  font-weight: 800;
}

.secondary-button {
  background: #e8e2d2 !important;
  color: #172018 !important;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.person-list,
.expense-list,
.settlement-list {
  display: grid;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.person-list li,
.expense-list li,
.settlement-list li,
.balance-row,
.split-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid #e2ddcf;
  border-radius: 7px;
  background: #fbf8ef;
  padding: 10px;
}

.expense-list li {
  align-items: flex-start;
}

.expense-list span {
  display: block;
  margin-top: 3px;
  color: #667064;
  font-size: 0.88rem;
}

.icon-button {
  display: inline-grid;
  width: 34px;
  height: 34px;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 6px;
  background: #e8e2d2;
  color: #172018;
}

.row-actions {
  display: flex;
  gap: 6px;
}

.split-list {
  display: grid;
  gap: 8px;
}

.split-row {
  align-items: end;
}

.split-row > label:last-child {
  width: 92px;
}

.checkbox-label {
  display: flex;
  flex: 1;
  grid-template-columns: none;
  align-items: center;
  gap: 8px;
}

.checkbox-label input {
  width: 18px;
  min-height: 18px;
}

.balance-list {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
}

.positive {
  color: #1e6b43;
}

.negative {
  color: #a33d2d;
}

.settlement-list li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
}

.empty-state {
  border: 1px dashed #cac1ac;
  border-radius: 8px;
  padding: 14px;
  color: #667064;
}

.empty-state p {
  margin: 5px 0 0;
}

.warning {
  border-radius: 7px;
  background: #fff1cd;
  color: #6d4a00;
  padding: 10px;
}

@media (max-width: 980px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .app-shell {
    width: min(100% - 20px, 1180px);
    padding: 20px 0;
  }

  .panel {
    padding: 14px;
  }

  .split-row {
    align-items: stretch;
    flex-direction: column;
  }

  .split-row > label:last-child {
    width: 100%;
  }
}
```

- [ ] **Step 9: Run integration tests**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 10: Optional repo hygiene commit**

If appropriate for the current worktree, run:

```bash
git add src/App.tsx src/App.test.tsx src/styles.css src/components
git commit -m "feat: build trip workspace UI"
```

Paperclip issue completion is canonical. Do not fail the task solely because a local commit is not appropriate for the current worktree.

## Task 6: Final Verification And Polish

**Files:**
- Modify: files only if verification reveals defects.

- [ ] **Step 1: Run full test suite**

Run:

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: TypeScript compiles and Vite builds production assets into `dist/`.

- [ ] **Step 3: Start dev server**

Run:

```bash
npm run dev
```

Expected: Vite prints a local URL, normally `http://localhost:5173/`.

- [ ] **Step 4: Manually verify core flows**

In the browser:

1. Add `Alex`, `Mina`, and `Sam`.
2. Add a `Dinner` expense for `$60.00`, paid by `Alex`, split equally across all three.
3. Confirm settlement shows `Mina pays Alex $20.00` and `Sam pays Alex $20.00`.
4. Add a `Boat tickets` expense for `$80.00`, paid by `Mina`, with Alex weight `2`, Mina weight `1`, and Sam weight `1`.
5. Confirm balances and settlement update immediately.
6. Edit an expense amount and confirm settlement changes.
7. Delete an expense and confirm settlement changes.
8. Reload the page and confirm people and expenses persist.
9. Resize to mobile width and confirm forms and lists remain usable without overlap.

- [ ] **Step 5: Optional repo hygiene commit if fixes were needed**

If any files changed during verification and the local worktree is clean enough, run:

```bash
git add src
git commit -m "fix: polish travel split workspace"
```

Expected: commit is created only when verification required code or style fixes and a local commit is appropriate.

## Self-Review

- Spec coverage: people, expenses, weighted participants, equal default weights, balances, settlement suggestions, localStorage persistence, mobile-friendly layout, validation, and split tests are covered by Tasks 2 through 6.
- Scope: the plan intentionally excludes accounts, backend collaboration, receipt upload, multiple cloud trips, and currency conversion.
- Placeholder scan: this plan contains no incomplete implementation markers.
- Type consistency: the plan uses `amountCents` consistently instead of the original design's decimal `amount`, matching the integer-cent rule added during spec review.
