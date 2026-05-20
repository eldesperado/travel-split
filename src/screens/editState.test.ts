import { describe, expect, it } from 'vitest';
import type { Expense, Person } from '../domain/types';
import { isStaleEditTarget, prepareEditState } from './editState';

const tripId = 'trip-1';
const now = '2026-05-19T00:00:00.000Z';

function person(id: string, name: string): Person {
  return { id, tripId, name, avatarBg: '#e1eadf', createdAt: now };
}

function expense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: 'exp-1',
    tripId,
    title: 'Welcome dinner',
    amountCents: 12000,
    payerId: 'alex',
    participants: [
      { personId: 'alex', weight: 1 },
      { personId: 'mina', weight: 1 },
      { personId: 'jordan', weight: 1 },
    ],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

const people: Person[] = [person('alex', 'Alex'), person('mina', 'Mina'), person('jordan', 'Jordan')];

describe('prepareEditState', () => {
  it('prefills form fields from the expense', () => {
    const state = prepareEditState(expense(), people, false);
    expect(state.title).toBe('Welcome dinner');
    expect(state.amount).toBe('120.00');
    expect(state.paidBy).toBe('alex');
  });

  it('leaves customize closed for equal-weight splits', () => {
    const state = prepareEditState(expense(), people, false);
    expect(state.customizeOpen).toBe(false);
    expect(state.skipNextSaveScroll).toBe(false);
  });

  it('opens customize and sets the skip sentinel when a weighted expense opens it from closed', () => {
    const state = prepareEditState(
      expense({ participants: [
        { personId: 'alex', weight: 2 },
        { personId: 'mina', weight: 1 },
        { personId: 'jordan', weight: 1 },
      ] }),
      people,
      false,
    );
    expect(state.customizeOpen).toBe(true);
    // Regression: bug 1 — title scroll was being overridden by the 320ms save-scroll
    // when startEdit opened customize. The skip sentinel suppresses that single fire.
    expect(state.skipNextSaveScroll).toBe(true);
  });

  it('does not strand the skip sentinel when customize was already open', () => {
    const state = prepareEditState(
      expense({ participants: [
        { personId: 'alex', weight: 2 },
        { personId: 'mina', weight: 1 },
        { personId: 'jordan', weight: 1 },
      ] }),
      people,
      true,
    );
    // The state setter is a no-op when value is unchanged, so the customizeOpen
    // useEffect would not fire to consume the sentinel — leaving it true would
    // wrongly skip the next user-initiated toggle.
    expect(state.skipNextSaveScroll).toBe(false);
  });

  it('marks only the expense participants as included', () => {
    const state = prepareEditState(
      expense({ participants: [
        { personId: 'alex', weight: 1 },
        { personId: 'mina', weight: 1 },
      ] }),
      people,
      false,
    );
    expect(state.included).toEqual({ alex: true, mina: true, jordan: false });
  });

  it('rounds amount to dollars-and-cents', () => {
    expect(prepareEditState(expense({ amountCents: 4 }), people, false).amount).toBe('0.04');
    expect(prepareEditState(expense({ amountCents: 4099 }), people, false).amount).toBe('40.99');
    expect(prepareEditState(expense({ amountCents: 100000 }), people, false).amount).toBe('1000.00');
  });

  it('serializes participant weights and defaults excluded people to 1', () => {
    const state = prepareEditState(
      expense({ participants: [
        { personId: 'alex', weight: 2.5 },
        { personId: 'mina', weight: 1 },
      ] }),
      people,
      false,
    );
    expect(state.weights).toEqual({ alex: '2.5', mina: '1', jordan: '1' });
  });
});

describe('isStaleEditTarget', () => {
  it('returns false when nothing is being edited', () => {
    expect(isStaleEditTarget(null, [expense()])).toBe(false);
  });

  it('returns false when the editing target still exists', () => {
    expect(isStaleEditTarget('exp-1', [expense({ id: 'exp-1' })])).toBe(false);
  });

  it('returns true when the editing target is gone — regression for the zombie re-add bug', () => {
    // Bug 2: user clicked Edit on row X, then Delete on row X. editingId still
    // pointed at X; clicking Update would re-append the expense via upsert's
    // append-when-no-match branch. This guard cancels edit when the target
    // disappears.
    expect(isStaleEditTarget('exp-1', [expense({ id: 'exp-2' })])).toBe(true);
    expect(isStaleEditTarget('exp-1', [])).toBe(true);
  });
});
