import type { Expense, Person } from '../domain/types';

export type EditPreparation = {
  title: string;
  amount: string;
  paidBy: string;
  customizeOpen: boolean;
  included: Record<string, boolean>;
  weights: Record<string, string>;
  skipNextSaveScroll: boolean;
};

export function prepareEditState(expense: Expense, people: Person[], customizeOpenBefore: boolean): EditPreparation {
  const weighted = expense.participants.some((participant) => participant.weight !== 1);
  const participantMap = new Map(expense.participants.map((participant) => [participant.personId, participant.weight]));
  return {
    title: expense.title,
    amount: (expense.amountCents / 100).toFixed(2),
    paidBy: expense.payerId,
    customizeOpen: weighted,
    included: Object.fromEntries(people.map((person) => [person.id, participantMap.has(person.id)])),
    weights: Object.fromEntries(people.map((person) => [person.id, String(participantMap.get(person.id) ?? 1)])),
    skipNextSaveScroll: weighted && !customizeOpenBefore,
  };
}

export function isStaleEditTarget(editingId: string | null, expenses: Expense[]): boolean {
  if (!editingId) return false;
  return !expenses.some((expense) => expense.id === editingId);
}
