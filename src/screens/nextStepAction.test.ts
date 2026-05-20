import { describe, expect, it } from 'vitest';
import { tripReducer } from '../domain/tripReducer';
import { createEmptyTrip, type TripState } from '../domain/types';
import { getExpensesNextStepAction, getPeopleNextStepAction } from './nextStepAction';

const now = '2026-05-20T00:00:00.000Z';

describe('getPeopleNextStepAction', () => {
  it('returns null before any people are added', () => {
    expect(getPeopleNextStepAction(createEmptyTrip(now))).toBeNull();
  });

  it('routes to expenses once at least one person exists', () => {
    expect(getPeopleNextStepAction(withPerson())).toEqual({ label: 'Record an expense', target: 'expenses' });
  });
});

describe('getExpensesNextStepAction', () => {
  it('returns null before any expenses are recorded', () => {
    expect(getExpensesNextStepAction(withPerson())).toBeNull();
  });

  it('routes to settlement once at least one expense exists', () => {
    expect(getExpensesNextStepAction(withPeopleAndExpenses())).toEqual({ label: 'Review settlement', target: 'settle' });
  });

  it('returns null again when the last expense is deleted', () => {
    const trip = withPeopleAndExpenses();
    const afterDelete = tripReducer(trip, { type: 'expense.delete', expenseId: 'dinner' }).state;

    expect(getExpensesNextStepAction(afterDelete)).toBeNull();
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
