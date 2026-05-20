import { describe, expect, it } from 'vitest';
import { selectTrip } from './selectors';
import { createEmptyTrip, type TripState } from './types';

function trip(): TripState {
  return {
    ...createEmptyTrip('t'),
    people: [
      { id: 'alex', tripId: 'active-trip', name: 'Alex', avatarBg: '#aaa', createdAt: 't' },
      { id: 'mina', tripId: 'active-trip', name: 'Mina', avatarBg: '#bbb', createdAt: 't' },
    ],
    expenses: [{
      id: 'dinner',
      tripId: 'active-trip',
      title: 'Dinner',
      amountCents: 4000,
      payerId: 'alex',
      participants: [
        { personId: 'alex', weight: 1 },
        { personId: 'mina', weight: 1 },
      ],
      createdAt: 't',
      updatedAt: 't',
    }],
  };
}

describe('selectTrip', () => {
  it('derives balances, settlements, invalid ids, and referenced people', () => {
    const selected = selectTrip(trip());
    expect(selected.balances).toMatchObject([{ personId: 'alex', cents: 2000 }, { personId: 'mina', cents: -2000 }]);
    expect(selected.settlements).toMatchObject([{ fromPersonId: 'mina', toPersonId: 'alex', cents: 2000 }]);
    expect(selected.invalidExpenseIds).toEqual([]);
    expect([...selected.referencedPersonIds].sort()).toEqual(['alex', 'mina']);
  });
});
