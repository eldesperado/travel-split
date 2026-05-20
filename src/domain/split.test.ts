import { describe, expect, it } from 'vitest';
import { allocateShares, balancesReconcile, calculateBalances, calculateSettlements, getInvalidExpenseIds } from './split';
import type { Expense, Person } from './types';

const people: Person[] = [
  { id: 'alex', tripId: 'trip', name: 'Alex', avatarBg: '#aaa', createdAt: 't' },
  { id: 'mina', tripId: 'trip', name: 'Mina', avatarBg: '#bbb', createdAt: 't' },
  { id: 'sam', tripId: 'trip', name: 'Sam', avatarBg: '#ccc', createdAt: 't' },
];

function expense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: 'expense-1',
    tripId: 'trip',
    title: 'Dinner',
    amountCents: 10001,
    payerId: 'alex',
    participants: people.map((person) => ({ personId: person.id, weight: 1 })),
    createdAt: 't',
    updatedAt: 't',
    ...overrides,
  };
}

describe('split calculations', () => {
  it('allocates remainder cents deterministically by participant order', () => {
    expect(allocateShares(10001, people.map((person) => ({ personId: person.id, weight: 1 })))).toEqual({
      alex: 3334,
      mina: 3334,
      sam: 3333,
    });
  });

  it('allocates weighted shares and reconciles to the original amount', () => {
    const shares = allocateShares(10000, [
      { personId: 'alex', weight: 2 },
      { personId: 'mina', weight: 1 },
      { personId: 'sam', weight: 1 },
    ]);
    expect(shares).toEqual({ alex: 5000, mina: 2500, sam: 2500 });
    expect(Object.values(shares).reduce((sum, cents) => sum + cents, 0)).toBe(10000);
  });

  it('calculates balances and settlement suggestions', () => {
    const balances = calculateBalances(people, [expense({ amountCents: 9000 })]);
    expect(balances).toMatchObject([
      { personId: 'alex', cents: 6000 },
      { personId: 'mina', cents: -3000 },
      { personId: 'sam', cents: -3000 },
    ]);
    expect(balancesReconcile(balances)).toBe(true);

    const settlements = calculateSettlements(balances);
    expect(settlements).toMatchObject([
      { fromPersonId: 'mina', toPersonId: 'alex', cents: 3000 },
      { fromPersonId: 'sam', toPersonId: 'alex', cents: 3000 },
    ]);
  });

  it('ignores invalid expenses in balances and reports their ids', () => {
    const invalid = expense({ id: 'bad', payerId: 'missing' });
    expect(getInvalidExpenseIds(people, [invalid])).toEqual(['bad']);
    expect(calculateBalances(people, [invalid]).every((balance) => balance.cents === 0)).toBe(true);
  });

  it('detects common invalid expense shapes', () => {
    expect(getInvalidExpenseIds(people, [expense({ id: 'empty-title', title: ' ' })])).toEqual(['empty-title']);
    expect(getInvalidExpenseIds(people, [expense({ id: 'zero', amountCents: 0 })])).toEqual(['zero']);
    expect(getInvalidExpenseIds(people, [expense({ id: 'none', participants: [] })])).toEqual(['none']);
    expect(getInvalidExpenseIds(people, [expense({ id: 'missing-participant', participants: [{ personId: 'ghost', weight: 1 }] })])).toEqual(['missing-participant']);
    expect(getInvalidExpenseIds(people, [expense({ id: 'duplicate', participants: [{ personId: 'alex', weight: 1 }, { personId: 'alex', weight: 1 }] })])).toEqual(['duplicate']);
    expect(getInvalidExpenseIds(people, [expense({ id: 'bad-weight', participants: [{ personId: 'alex', weight: 0 }] })])).toEqual(['bad-weight']);
    expect(allocateShares(0, [{ personId: 'alex', weight: 1 }])).toEqual({});
    expect(allocateShares(100, [{ personId: 'alex', weight: 0 }])).toEqual({});
  });
});
