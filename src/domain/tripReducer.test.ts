import { describe, expect, it } from 'vitest';
import { tripReducer } from './tripReducer';
import { createEmptyTrip } from './types';

const now = '2026-05-19T00:00:00.000Z';

describe('tripReducer', () => {
  it('adds trimmed people with stable ids when provided', () => {
    const result = tripReducer(createEmptyTrip(now), { type: 'person.add', id: 'alex', name: ' Alex ', now });
    expect(result.error).toBeUndefined();
    expect(result.state.people).toMatchObject([{ id: 'alex', name: 'Alex', tripId: 'active-trip' }]);
  });

  it('rejects empty people', () => {
    const result = tripReducer(createEmptyTrip(now), { type: 'person.add', name: '   ', now });
    expect(result.error?.code).toBe('person.name.empty');
    expect(result.state.people).toHaveLength(0);
  });

  it('upserts expenses and blocks deleting referenced people', () => {
    let state = createEmptyTrip(now);
    state = tripReducer(state, { type: 'person.add', id: 'alex', name: 'Alex', now }).state;
    state = tripReducer(state, { type: 'person.add', id: 'mina', name: 'Mina', now }).state;

    const expenseResult = tripReducer(state, {
      type: 'expense.upsert',
      now,
      expense: {
        id: 'dinner',
        title: ' Dinner ',
        amountCents: 4000,
        payerId: 'alex',
        participants: [
          { personId: 'alex', weight: 1 },
          { personId: 'mina', weight: 1 },
        ],
      },
    });

    expect(expenseResult.error).toBeUndefined();
    expect(expenseResult.state.expenses).toMatchObject([{ id: 'dinner', title: 'Dinner', amountCents: 4000 }]);

    const removeResult = tripReducer(expenseResult.state, { type: 'person.remove', personId: 'mina' });
    expect(removeResult.error?.code).toBe('person.remove.referenced');
    expect(removeResult.state.people).toHaveLength(2);
  });

  it('rejects invalid expenses', () => {
    const state = tripReducer(createEmptyTrip(now), { type: 'person.add', id: 'alex', name: 'Alex', now }).state;
    expect(tripReducer(state, {
      type: 'expense.upsert',
      expense: { title: '', amountCents: 100, payerId: 'alex', participants: [{ personId: 'alex', weight: 1 }] },
    }).error?.code).toBe('expense.title.empty');
    expect(tripReducer(state, {
      type: 'expense.upsert',
      expense: { title: 'Bad', amountCents: 0, payerId: 'alex', participants: [{ personId: 'alex', weight: 1 }] },
    }).error?.code).toBe('expense.amount.invalid');
    expect(tripReducer(state, {
      type: 'expense.upsert',
      expense: { title: 'Bad', amountCents: 100, payerId: 'missing', participants: [{ personId: 'alex', weight: 1 }] },
    }).error?.code).toBe('expense.payer.invalid');
    expect(tripReducer(state, {
      type: 'expense.upsert',
      expense: { title: 'Bad', amountCents: 100, payerId: 'alex', participants: [] },
    }).error?.code).toBe('expense.participants.empty');
    expect(tripReducer(state, {
      type: 'expense.upsert',
      expense: { title: 'Bad', amountCents: 100, payerId: 'alex', participants: [{ personId: 'missing', weight: 1 }] },
    }).error?.code).toBe('expense.participant.invalid');
    const invalidWeight = tripReducer(state, {
      type: 'expense.upsert',
      expense: { title: 'Bad', amountCents: 100, payerId: 'alex', participants: [{ personId: 'alex', weight: -1 }] },
    });
    expect(invalidWeight.error?.code).toBe('expense.weight.invalid');
    expect(invalidWeight.error?.message).toBe('Each share weight must be more than zero.');
    expect(tripReducer(state, {
      type: 'expense.upsert',
      expense: { title: 'Bad', amountCents: 100, payerId: 'alex', participants: [{ personId: 'alex', weight: 1 }, { personId: 'alex', weight: 1 }] },
    }).error?.code).toBe('expense.participant.duplicate');
  });

  it('deletes expenses', () => {
    let state = createEmptyTrip(now);
    state = tripReducer(state, { type: 'person.add', id: 'alex', name: 'Alex', now }).state;
    state = tripReducer(state, {
      type: 'expense.upsert',
      now,
      expense: { id: 'coffee', title: 'Coffee', amountCents: 500, payerId: 'alex', participants: [{ personId: 'alex', weight: 1 }] },
    }).state;
    expect(tripReducer(state, { type: 'expense.delete', expenseId: 'coffee' }).state.expenses).toHaveLength(0);
  });
});
