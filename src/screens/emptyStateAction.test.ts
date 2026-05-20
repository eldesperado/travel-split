import { describe, expect, it } from 'vitest';
import { tripReducer } from '../domain/tripReducer';
import { createEmptyTrip, type TripState } from '../domain/types';
import { getExpensesEmptyAction, getSettleEmptyAction } from './emptyStateAction';

const now = '2026-05-20T00:00:00.000Z';

describe('getExpensesEmptyAction', () => {
  it('returns Go to People when roster is empty', () => {
    expect(getExpensesEmptyAction(createEmptyTrip(now))).toEqual({ label: 'Go to People', target: 'people' });
  });

  it('returns null when at least one person exists', () => {
    expect(getExpensesEmptyAction(withPerson())).toBeNull();
  });

  it('returns Go to People again after the last person is removed', () => {
    const trip = withPerson();
    const afterRemoval = tripReducer(trip, { type: 'person.remove', personId: 'alex' }).state;

    expect(getExpensesEmptyAction(afterRemoval)).toEqual({ label: 'Go to People', target: 'people' });
  });
});

describe('getSettleEmptyAction', () => {
  it('returns Add people when roster is empty', () => {
    expect(getSettleEmptyAction(createEmptyTrip(now))).toEqual({ label: 'Add people', target: 'people' });
  });

  it('returns Record an expense when roster exists but no expenses exist', () => {
    expect(getSettleEmptyAction(withPerson())).toEqual({ label: 'Record an expense', target: 'expenses' });
  });

  it('returns null when expenses exist', () => {
    expect(getSettleEmptyAction(withPeopleAndExpenses())).toBeNull();
  });

  it('targets expenses when the last expense is deleted but people remain', () => {
    const trip = withPeopleAndExpenses();
    const afterDelete = tripReducer(trip, { type: 'expense.delete', expenseId: 'dinner' }).state;

    expect(getSettleEmptyAction(afterDelete)).toEqual({ label: 'Record an expense', target: 'expenses' });
  });
});

function withPerson(): TripState {
  return tripReducer(createEmptyTrip(now), { type: 'person.add', id: 'alex', name: 'Alex', now }).state;
}

function withPeopleAndExpenses(): TripState {
  let state = withPerson();
  state = tripReducer(state, { type: 'person.add', id: 'mina', name: 'Mina', now }).state;
  return tripReducer(state, {
    type: 'expense.upsert',
    now,
    expense: {
      id: 'dinner',
      title: 'Dinner',
      amountCents: 4000,
      payerId: 'alex',
      participants: [
        { personId: 'alex', weight: 1 },
        { personId: 'mina', weight: 1 },
      ],
    },
  }).state;
}
