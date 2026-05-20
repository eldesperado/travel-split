export type Person = {
  id: string;
  tripId: string;
  name: string;
  avatarBg: string;
  createdAt: string;
};

export type ExpenseParticipant = {
  personId: string;
  weight: number;
};

export type Expense = {
  id: string;
  tripId: string;
  title: string;
  amountCents: number;
  payerId: string;
  participants: ExpenseParticipant[];
  createdAt: string;
  updatedAt: string;
};

export type TripState = {
  id: string;
  name: string;
  people: Person[];
  expenses: Expense[];
  createdAt: string;
  updatedAt: string;
};

export type ExpenseDraft = {
  id?: string;
  title: string;
  amountCents: number;
  payerId: string;
  participants: ExpenseParticipant[];
};

export type Balance = {
  personId: string;
  name: string;
  avatarBg: string;
  cents: number;
};

export type Settlement = {
  id: string;
  fromPersonId: string;
  from: string;
  toPersonId: string;
  to: string;
  cents: number;
  explanation: string;
};

export type DomainError = {
  code: string;
  message: string;
};

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: DomainError };

export type TripCommand =
  | { type: 'person.add'; name: string; id?: string; now?: string }
  | { type: 'person.remove'; personId: string }
  | { type: 'expense.upsert'; expense: ExpenseDraft; now?: string }
  | { type: 'expense.delete'; expenseId: string };

export type TripCommandResult = {
  state: TripState;
  error?: DomainError;
};

export const ACTIVE_TRIP_ID = 'active-trip';

export function createEmptyTrip(now = new Date().toISOString()): TripState {
  return {
    id: ACTIVE_TRIP_ID,
    name: 'Trip',
    people: [],
    expenses: [],
    createdAt: now,
    updatedAt: now,
  };
}
