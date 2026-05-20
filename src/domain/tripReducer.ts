import { getInvalidExpenseIds } from './split';
import type { DomainError, Expense, ExpenseDraft, Person, TripCommand, TripCommandResult, TripState } from './types';

const AVATAR_COLORS = ['#e1eadf', '#deebd9', '#ede8df', '#e8e3d8', '#dce7e2', '#eee2d5'];

function makeId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function error(code: string, message: string): DomainError {
  return { code, message };
}

function touch(state: TripState, now: string): TripState {
  return { ...state, updatedAt: now };
}

export function tripReducer(state: TripState, command: TripCommand): TripCommandResult {
  const now = 'now' in command && command.now ? command.now : new Date().toISOString();

  switch (command.type) {
    case 'person.add': {
      const name = command.name.trim();
      if (!name) return { state, error: error('person.name.empty', 'Enter a name to add someone.') };
      const person: Person = {
        id: command.id ?? makeId('person'),
        tripId: state.id,
        name,
        avatarBg: AVATAR_COLORS[state.people.length % AVATAR_COLORS.length],
        createdAt: now,
      };
      return { state: touch({ ...state, people: [...state.people, person] }, now) };
    }

    case 'person.remove': {
      const referenced = state.expenses.some(
        (expense) => expense.payerId === command.personId || expense.participants.some((participant) => participant.personId === command.personId),
      );
      if (referenced) {
        return {
          state,
          error: error('person.remove.referenced', 'Remove that person from expenses before deleting them.'),
        };
      }
      return { state: touch({ ...state, people: state.people.filter((person) => person.id !== command.personId) }, now) };
    }

    case 'expense.upsert': {
      const draftResult = normalizeExpenseDraft(state, command.expense, now);
      if ('error' in draftResult) return { state, error: draftResult.error };

      const existing = state.expenses.some((expense) => expense.id === draftResult.expense.id);
      const expenses = existing
        ? state.expenses.map((expense) => (expense.id === draftResult.expense.id ? draftResult.expense : expense))
        : [...state.expenses, draftResult.expense];

      const invalidIds = getInvalidExpenseIds(state.people, expenses);
      if (invalidIds.includes(draftResult.expense.id)) {
        return { state, error: error('expense.invalid', 'Expense has an invalid payer or split.') };
      }

      return { state: touch({ ...state, expenses }, now) };
    }

    case 'expense.delete':
      return { state: touch({ ...state, expenses: state.expenses.filter((expense) => expense.id !== command.expenseId) }, now) };

    default:
      return { state };
  }
}

function normalizeExpenseDraft(
  state: TripState,
  draft: ExpenseDraft,
  now: string,
): { expense: Expense } | { error: DomainError } {
  const title = draft.title.trim();
  if (!title) return { error: error('expense.title.empty', 'Enter an expense title.') };
  if (!Number.isSafeInteger(draft.amountCents) || draft.amountCents <= 0) {
    return { error: error('expense.amount.invalid', 'Enter an amount greater than zero.') };
  }
  if (!state.people.some((person) => person.id === draft.payerId)) {
    return { error: error('expense.payer.invalid', 'Choose who paid.') };
  }

  const participants = draft.participants.filter((participant) => participant.weight > 0);
  if (participants.length === 0) {
    return { error: error('expense.participants.empty', 'Choose at least one person to split with.') };
  }

  const participantIds = new Set<string>();
  for (const participant of participants) {
    if (!state.people.some((person) => person.id === participant.personId)) {
      return { error: error('expense.participant.invalid', 'Split includes someone who is not on this trip.') };
    }
    if (participantIds.has(participant.personId)) {
      return { error: error('expense.participant.duplicate', 'Split includes the same person twice.') };
    }
    participantIds.add(participant.personId);
    if (!Number.isFinite(participant.weight) || participant.weight <= 0) {
      return { error: error('expense.weight.invalid', 'Weights must be greater than zero.') };
    }
  }

  const previous = state.expenses.find((expense) => expense.id === draft.id);
  return {
    expense: {
      id: draft.id ?? makeId('expense'),
      tripId: state.id,
      title,
      amountCents: draft.amountCents,
      payerId: draft.payerId,
      participants,
      createdAt: previous?.createdAt ?? now,
      updatedAt: now,
    },
  };
}
