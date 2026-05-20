import type { DomainError } from './types';

export const ERROR_MESSAGES = {
  'amount.empty': 'Enter an amount.',
  'amount.invalid': 'Use dollars and cents, like 40 or 40.50.',
  'amount.too_large': 'Amount is too large.',
  'amount.positive': 'Amount must be greater than zero.',
  'person.name.empty': 'Enter a name to add someone.',
  'person.remove.referenced': 'Remove that person from expenses before deleting them.',
  'expense.title.empty': 'Enter an expense title.',
  'expense.amount.invalid': 'Enter an amount greater than zero.',
  'expense.payer.invalid': 'Choose who paid.',
  'expense.participants.empty': 'Choose at least one person to split this expense with.',
  'expense.participant.invalid': 'Split includes someone who is not on this trip.',
  'expense.participant.duplicate': 'Split includes the same person twice.',
  'expense.weight.invalid': 'Enter a weight greater than zero for each selected person.',
  'expense.invalid': 'Expense has an invalid payer or split.',
  'storage.save.failed': 'Could not save this change locally. Try again.',
} as const;

export const WARNING_MESSAGES = {
  'trip.started': 'Started a new local trip.',
  'storage.load.failed': 'Local database was unavailable, so an empty trip was opened.',
} as const;

export type ErrorCode = keyof typeof ERROR_MESSAGES;
export type WarningCode = keyof typeof WARNING_MESSAGES;

const AMOUNT_ERROR_CODES = ['amount.empty', 'amount.invalid', 'amount.too_large', 'amount.positive'] satisfies ErrorCode[];
const AMOUNT_ERROR_MESSAGES: ReadonlySet<string> = new Set(AMOUNT_ERROR_CODES.map((code) => ERROR_MESSAGES[code]));

export function domainError(code: ErrorCode): DomainError {
  return { code, message: ERROR_MESSAGES[code] };
}

export function isAmountErrorMessage(message?: string): boolean {
  return message ? AMOUNT_ERROR_MESSAGES.has(message) : false;
}

export function invalidExpensesWarning(count: number): string {
  const label = count === 1 ? 'expense' : 'expenses';
  return `${count} invalid ${label} ignored in settlement math.`;
}
