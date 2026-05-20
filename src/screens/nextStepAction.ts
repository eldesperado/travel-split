import type { TripState } from '../domain/types';

export type NextStepTarget = 'expenses' | 'settle';
export type NextStepAction = { label: string; target: NextStepTarget } | null;

export function getPeopleNextStepAction(trip: TripState): NextStepAction {
  if (trip.people.length === 0) return null;
  return { label: 'Record an expense', target: 'expenses' };
}

export function getExpensesNextStepAction(trip: TripState): NextStepAction {
  if (trip.expenses.length === 0) return null;
  return { label: 'Review settlement', target: 'settle' };
}
