# Guizang PPT Adaptation Plan: Travel Split × Agentic Engineering

## Decision from deck-discover

- **Visual direction:** Swiss discipline with a warmer product story.
- **Implementation constraint:** `guizang-ppt-skill` Swiss mode only supports its preset Swiss themes. Do not invent a custom warm theme.
- **Recommended compliant implementation:** Use **Style B · Swiss Internationalism** with **IKB blue** as the single accent. Let warmth come from the Travel Split screenshots, human story, and concise speaker notes—not from custom colors.
- **Narrative spine:** 10-slide method story.
- **Primary layout strategy:** Swiss locked mode with registered `Sxx` layouts.

## Senior AI engineering angle

This deck should not sell “AI wrote my app.” It should sell a stronger engineering claim:

> Agentic engineering works when agents are placed inside evidence-producing loops.

The story should make the audience feel three shifts:

1. **From prompt to process** — AI is not the process; AI operates inside the process.
2. **From output to evidence** — code is not done when it exists; it is done when verified.
3. **From human memory to external artifacts** — visuals, specs, tests, commits, logs, and screenshots become shared working memory.

## What must change from the current outline

The current outline is good as a document, but too explanatory for slides. For guizang:

- Reduce from 14 detailed sections to **10 visual slides**.
- Use one punchline per slide.
- Convert bullet-heavy sections into diagrams, comparisons, timelines, and evidence screens.
- Keep the concrete Travel Split implementation as the proof case.
- Avoid generic AI philosophy; every claim should connect to a project artifact.

## Theme and style rules

Use `template-swiss.html`.

Recommended theme: **IKB / International Klein Blue**.

Why:

- AI + engineering + evidence fits Swiss/IKB better than magazine warmth.
- Screenshots, tests, loops, matrices, and architecture diagrams map naturally to Swiss layouts.
- IKB gives strong visual contrast for a non-expert audience.

Hard rules:

- One accent color only.
- No gradients, shadows, rounded corners, or decorative emoji.
- Use registered Swiss layouts only.
- Every body slide needs `data-layout="Sxx"`.
- SVG can draw geometry, but visible labels should be HTML.
- Large title text should be light weight, not bold.

## Proposed 10-slide deck

| # | Slide title | Core job | Guizang layout | Visual / asset |
|---|---|---|---|---|
| 1 | Building Travel Split with Agentic Engineering | Open with thesis | `SWISS-COVER-ASCII` | No image; ASCII / bold thesis |
| 2 | Not vibe coding | Define contrast | `S08 Duo Compare` | Vibe coding vs agentic engineering |
| 3 | The problem had to stay small | Explain product boundary | `S21 Tech Spec Sheet` | Constraints: local-first, one trip, no backend |
| 4 | Specs are easy for agents, hard for humans | Show understanding phase | `S22 Image Hero` | `assets/spec-visualization-example.png` |
| 5 | The loop: understand → plan → implement → verify | Introduce method | `S11 Horizontal Timeline` | 5-step engineering loop |
| 6 | Planning is option design | Show research/tradeoffs | `S15 Matrix + Hero Stat` | Criteria matrix: risk, effort, maintainability, UX |
| 7 | Journeys became interface decisions | Show flow/design bridge | `S22 Image Hero` | `assets/user-journey-wireframe-example.png` |
| 8 | Implementation needed a clean memory | Explain Git + tests | `S17 System Diagram` | Agent + Git + tests + domain modules |
| 9 | Agents need senses | Explain runtime validation | `S14 Loop Form` | Eyes/hands/ears feedback loop |
| 10 | Faster feedback, not just faster code | Closing takeaway | `S10 Split Closing` | Final maxim + reusable loop |

## Slide-by-slide brainstorm

### 1. Building Travel Split with Agentic Engineering

**Punchline:** The app was built by a loop, not by a prompt.

**Content shape:**

- Title: `Building Travel Split with Agentic Engineering`
- Subtitle: `How agents helped me understand, plan, implement, verify, and iterate.`
- Bottom note: `Travel Split · local-first expense sharing app`

**Senior-engineer framing:** Start by lowering hype. “This is not a talk about magic. It is a talk about feedback loops.”

### 2. Not vibe coding

**Punchline:** Vibe coding produces code. Agentic engineering produces evidence.

**Left column:** Vibe coding

- prompt → code
- plausible output
- weak memory
- hard rollback

**Right column:** Agentic engineering

- specs → plan → tests → code → runtime validation
- explicit artifacts
- Git history
- reversible steps

### 3. The problem had to stay small

**Punchline:** Agents are safer when scope is explicit.

**Use real constraints:**

- One active trip
- Browser-only storage
- People, expenses, weighted splits, balances, settlements
- No accounts, backend, cloud sync, payments, OCR, multi-currency conversion

**KPI-style cards:**

- `1` trip
- `0` backend services
- `100%` local-first MVP boundary

Avoid fake precision. If a number is not literal, do not use it.

### 4. Specs are easy for agents, hard for humans

**Punchline:** Spend tokens to save cognition.

**Use asset:** `docs/slides/assets/spec-visualization-example.png`

**Key line:**

> I used agents to transform long Markdown into an interactive artifact I could inspect.

**Why it matters:** Human cognitive load is scarce; tokens are cheap.

### 5. The engineering loop

**Punchline:** Agentic engineering is a loop with verification at every turn.

**Timeline nodes:**

1. Understand
2. Plan
3. Implement
4. Verify
5. Iterate

**Under each node:** one artifact.

- Understand → visual spec
- Plan → tradeoff deck
- Implement → atomic commits
- Verify → tests + browser run
- Iterate → human/metric feedback

### 6. Planning is option design

**Punchline:** The agent’s job is to expand options; the engineer’s job is to choose tradeoffs.

**Matrix candidates:**

Rows:

- Domain logic location
- Persistence strategy
- UI structure
- Verification strategy

Columns:

- Risk
- Effort
- Maintenance
- Evidence

**Hero stat idea:**

- `4` decision axes
- `1` implementation plan

### 7. Journeys became interface decisions

**Punchline:** User journeys turned requirements into UI structure.

**Use asset:** `docs/slides/assets/user-journey-wireframe-example.png`

**Three labels:**

- People → who is on the trip
- Expenses → what happened
- Settlement → what to do next

**Point:** The UI was not generated randomly; it emerged from accepted journeys.

### 8. Implementation needed a clean memory

**Punchline:** Git is the agent’s audit log.

**System diagram:**

```text
Spec / Plan
   ↓
Tests → Agent → Code
   ↓       ↓
Git commits ← Review
   ↓
Runtime validation
```

**Mention:** Atomic commits made rollback, diff review, and root-cause tracing possible.

### 9. Agents need senses

**Punchline:** The agent is the brain; tools provide eyes, hands, and ears.

**Loop structure:**

- Eyes → screenshots
- Hands → browser automation
- Ears → logs and errors
- Brain → coding agent

**Travel Split proof:**

- mobile flow clicked through
- desktop flow checked
- reload persistence verified
- screenshots saved as artifacts

### 10. Faster feedback, not just faster code

**Punchline:** The durable advantage is feedback speed.

**Closing contrast:**

- Vibe coding asks: `Can AI write this?`
- Agentic engineering asks: `Can we build a loop that makes trustworthy progress?`

**Final line:**

> The future is not faster code. It is faster feedback.

## What to cut from the original outline

Cut or move to speaker notes:

- Full lists of every test file.
- Detailed command list beyond a small `verify` evidence line.
- Repeated explanation of the same loop.
- Too many repo paths on slides.

Keep as appendix or speaker notes:

- Specific file references.
- Exact test names.
- Completion policies.
- Detailed phase 1 spec boundaries.

## Asset handling for guizang

Copy final assets into the PPT folder when generating the HTML:

```text
docs/slides/ppt/images/
  04-spec-visualization.png
  07-user-journey-wireframe.png
  09-iteration-loop.png   # optional if used as source/reference
```

For Swiss S22:

- Preferred slot: `21:9` hero strip.
- Current screenshots are not 21:9, so use screenshot framing instead of raw crop.
- Do not stretch images.
- If preserving text is important, use `object-fit:contain` or create a framed 21:9 canvas.
- **GIF rule:** if an animated GIF is evidence, make it large and easy to read. Use an S22 hero slot or another dominant image slot; do not bury it as a small matrix/card thumbnail.

## Open decision

Before generating the actual HTML, confirm one thing:

> Use strict Swiss IKB, or switch to magazine style for a warmer narrative feel?

My recommendation: **strict Swiss IKB** for this talk.
