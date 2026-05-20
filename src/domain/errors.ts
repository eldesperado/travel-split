import type { DomainError } from './types';

export const ERROR_MESSAGES = {
  'amount.empty': 'Add an amount.',
  'amount.invalid': 'Use a number like 40 or 40.50.',
  'amount.too_large': 'That amount is too large to track.',
  'amount.positive': 'Amount must be more than zero.',
  'person.name.empty': 'Type a name to add someone.',
  'person.remove.referenced': 'Remove this person from their expenses first.',
  'expense.title.empty': 'Give this expense a name.',
  'expense.amount.invalid': 'Amount must be more than zero.',
  'expense.payer.invalid': 'Pick who paid.',
  'expense.participants.empty': 'Pick someone to split this with.',
  'expense.participant.invalid': 'One person in the split is no longer on this trip.',
  'expense.participant.duplicate': 'Each person can only be in the split once.',
  'expense.weight.invalid': 'Each share weight must be more than zero.',
  'expense.invalid': "Something doesn't add up — check the payer and split.",
  'storage.save.failed': "Couldn't save that change. Try again.",
} as const;

export const WARNING_MESSAGES = {
  'trip.started': 'New trip ready. Add people to get started.',
  'storage.load.failed': "Couldn't open your saved trip — starting fresh.",
} as const;

export type ErrorCode = keyof typeof ERROR_MESSAGES;
export type WarningCode = keyof typeof WARNING_MESSAGES;
export type ErrorSource = 'people' | 'expenses' | 'global';

export function errorSource(code: string): ErrorSource {
  if (code.startsWith('person.')) return 'people';
  if (code.startsWith('expense.') || code.startsWith('amount.')) return 'expenses';
  return 'global';
}

const AMOUNT_ERROR_CODES = ['amount.empty', 'amount.invalid', 'amount.too_large', 'amount.positive'] satisfies ErrorCode[];
const AMOUNT_ERROR_MESSAGES: ReadonlySet<string> = new Set(AMOUNT_ERROR_CODES.map((code) => ERROR_MESSAGES[code]));

export function domainError(code: ErrorCode): DomainError {
  return { code, message: ERROR_MESSAGES[code] };
}

export function isAmountErrorMessage(message?: string): boolean {
  return message ? AMOUNT_ERROR_MESSAGES.has(message) : false;
}

export function invalidExpensesWarning(count: number): string {
  if (count === 1) return "1 expense couldn't be split — check its payer and shares.";
  return `${count} expenses couldn't be split — check their payer and shares.`;
}
