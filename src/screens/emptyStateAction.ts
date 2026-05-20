import type { TripState } from '../domain/types';

export type EmptyStateTarget = 'people' | 'expenses';
export type EmptyStateAction = { label: string; target: EmptyStateTarget } | null;

export function getExpensesEmptyAction(trip: TripState): EmptyStateAction {
  if (trip.people.length > 0) return null;
  return { label: 'Go to People', target: 'people' };
}

export function getSettleEmptyAction(trip: TripState): EmptyStateAction {
  if (trip.people.length === 0) return { label: 'Add people', target: 'people' };
  if (trip.expenses.length === 0) return { label: 'Record an expense', target: 'expenses' };
  return null;
}
