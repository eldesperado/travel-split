import { domainError } from './errors';
import { getInvalidExpenseIds } from './split';
import type { DomainError, Expense, ExpenseDraft, Person, TripCommand, TripCommandResult, TripState } from './types';

const AVATAR_COLORS = ['#e1eadf', '#deebd9', '#ede8df', '#e8e3d8', '#dce7e2', '#eee2d5'];

function makeId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function touch(state: TripState, now: string): TripState {
  return { ...state, updatedAt: now };
}

export function tripReducer(state: TripState, command: TripCommand): TripCommandResult {
  const now = 'now' in command && command.now ? command.now : new Date().toISOString();

  switch (command.type) {
    case 'person.add': {
      const name = command.name.trim();
      if (!name) return { state, error: domainError('person.name.empty') };
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
          error: domainError('person.remove.referenced'),
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
        return { state, error: domainError('expense.invalid') };
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
  if (!title) return { error: domainError('expense.title.empty') };
  if (!Number.isSafeInteger(draft.amountCents) || draft.amountCents <= 0) {
    return { error: domainError('expense.amount.invalid') };
  }

  const personIds = new Set(state.people.map((person) => person.id));
  if (!personIds.has(draft.payerId)) {
    return { error: domainError('expense.payer.invalid') };
  }

  const participants = draft.participants;
  if (participants.length === 0) {
    return { error: domainError('expense.participants.empty') };
  }

  const participantIds = new Set<string>();
  for (const participant of participants) {
    if (!personIds.has(participant.personId)) {
      return { error: domainError('expense.participant.invalid') };
    }
    if (participantIds.has(participant.personId)) {
      return { error: domainError('expense.participant.duplicate') };
    }
    participantIds.add(participant.personId);
    if (!Number.isFinite(participant.weight) || participant.weight <= 0) {
      return { error: domainError('expense.weight.invalid') };
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
