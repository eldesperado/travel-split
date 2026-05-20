import { describe, expect, it } from 'vitest';
import { ERROR_MESSAGES, domainError, invalidExpensesWarning, isAmountErrorMessage } from './errors';

describe('errors', () => {
  it('creates domain errors from centralized messages', () => {
    expect(domainError('expense.weight.invalid')).toEqual({
      code: 'expense.weight.invalid',
      message: 'Enter a weight greater than zero for each selected person.',
    });
  });

  it('identifies amount validation messages', () => {
    expect(isAmountErrorMessage(ERROR_MESSAGES['amount.empty'])).toBe(true);
    expect(isAmountErrorMessage(ERROR_MESSAGES['expense.title.empty'])).toBe(false);
    expect(isAmountErrorMessage()).toBe(false);
  });

  it('formats invalid expense warnings with singular and plural labels', () => {
    expect(invalidExpensesWarning(1)).toBe('1 invalid expense ignored in settlement math.');
    expect(invalidExpensesWarning(2)).toBe('2 invalid expenses ignored in settlement math.');
  });
});
