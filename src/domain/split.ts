import { formatCents, formatCentsAbs } from './money';
import type { Balance, Expense, ExpenseParticipant, Person, Settlement } from './types';

export function getInvalidExpenseIds(people: Person[], expenses: Expense[]): string[] {
  const personIds = new Set(people.map((person) => person.id));
  return expenses
    .filter((expense) => !isValidExpense(expense, personIds))
    .map((expense) => expense.id);
}

function isValidExpense(expense: Expense, personIds: Set<string>): boolean {
  if (!expense.id || !expense.tripId || !expense.title.trim()) return false;
  if (!Number.isSafeInteger(expense.amountCents) || expense.amountCents <= 0) return false;
  if (!personIds.has(expense.payerId)) return false;
  if (expense.participants.length === 0) return false;

  const seen = new Set<string>();
  return expense.participants.every((participant) => {
    if (!personIds.has(participant.personId)) return false;
    if (seen.has(participant.personId)) return false;
    seen.add(participant.personId);
    return Number.isFinite(participant.weight) && participant.weight > 0;
  });
}

export function allocateShares(amountCents: number, participants: ExpenseParticipant[]): Record<string, number> {
  const totalWeight = participants.reduce((sum, participant) => sum + participant.weight, 0);
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0 || totalWeight <= 0) return {};

  const rawShares = participants.map((participant, index) => {
    const raw = (amountCents * participant.weight) / totalWeight;
    const floor = Math.floor(raw);
    return {
      personId: participant.personId,
      cents: floor,
      remainder: raw - floor,
      index,
    };
  });

  let remaining = amountCents - rawShares.reduce((sum, share) => sum + share.cents, 0);
  const ranked = [...rawShares].sort((a, b) => b.remainder - a.remainder || a.index - b.index);

  for (let index = 0; index < ranked.length && remaining > 0; index += 1, remaining -= 1) {
    ranked[index].cents += 1;
  }

  return rawShares.reduce<Record<string, number>>((shares, share) => {
    shares[share.personId] = share.cents;
    return shares;
  }, {});
}

export function calculateBalances(people: Person[], expenses: Expense[]): Balance[] {
  const balances = new Map<string, number>();
  const personIds = new Set(people.map((person) => person.id));
  people.forEach((person) => balances.set(person.id, 0));

  expenses.forEach((expense) => {
    if (!isValidExpense(expense, personIds)) return;

    balances.set(expense.payerId, (balances.get(expense.payerId) ?? 0) + expense.amountCents);
    const shares = allocateShares(expense.amountCents, expense.participants);
    Object.entries(shares).forEach(([personId, shareCents]) => {
      balances.set(personId, (balances.get(personId) ?? 0) - shareCents);
    });
  });

  return people.map((person) => ({
    personId: person.id,
    name: person.name,
    avatarBg: person.avatarBg,
    cents: balances.get(person.id) ?? 0,
  }));
}

export function calculateSettlements(balances: Balance[]): Settlement[] {
  const debtors = balances
    .filter((balance) => balance.cents < 0)
    .map((balance) => ({ ...balance, remaining: -balance.cents }));
  const creditors = balances
    .filter((balance) => balance.cents > 0)
    .map((balance) => ({ ...balance, remaining: balance.cents }));

  const settlements: Settlement[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const cents = Math.min(debtor.remaining, creditor.remaining);

    if (cents > 0) {
      const settlement = {
        id: `${debtor.personId}->${creditor.personId}-${settlements.length}`,
        fromPersonId: debtor.personId,
        from: debtor.name,
        toPersonId: creditor.personId,
        to: creditor.name,
        cents,
        explanation: '',
      };
      settlement.explanation = explainSettlement(settlement);
      settlements.push(settlement);
      debtor.remaining -= cents;
      creditor.remaining -= cents;
    }

    if (debtor.remaining === 0) debtorIndex += 1;
    if (creditor.remaining === 0) creditorIndex += 1;
  }

  return settlements;
}

export function explainSettlement(settlement: Omit<Settlement, 'explanation'>): string {
  return `${settlement.from} pays ${settlement.to} ${formatCentsAbs(settlement.cents)} to reduce ${settlement.from}'s debt and ${settlement.to}'s credit.`;
}

export function balancesReconcile(balances: Balance[]): boolean {
  return balances.reduce((sum, balance) => sum + balance.cents, 0) === 0;
}

export function balanceLabel(cents: number): string {
  if (cents === 0) return '$0.00';
  return formatCents(cents);
}
