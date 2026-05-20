import { calculateBalances, calculateSettlements, getInvalidExpenseIds } from './split';
import type { Balance, Settlement, TripState } from './types';

export type TripSelectors = {
  balances: Balance[];
  settlements: Settlement[];
  invalidExpenseIds: string[];
  referencedPersonIds: Set<string>;
};

export function selectTrip(state: TripState): TripSelectors {
  const invalidExpenseIds = getInvalidExpenseIds(state.people, state.expenses);
  const balances = calculateBalances(state.people, state.expenses);
  const settlements = calculateSettlements(balances);
  const referencedPersonIds = new Set<string>();

  state.expenses.forEach((expense) => {
    referencedPersonIds.add(expense.payerId);
    expense.participants.forEach((participant) => referencedPersonIds.add(participant.personId));
  });

  return { balances, settlements, invalidExpenseIds, referencedPersonIds };
}
