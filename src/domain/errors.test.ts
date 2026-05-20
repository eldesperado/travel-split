import { describe, expect, it } from 'vitest';
import { ERROR_MESSAGES, domainError, errorSource, invalidExpensesWarning, isAmountErrorMessage, type ErrorCode } from './errors';

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

describe('errorSource', () => {
  it('routes person.* codes to the people surface', () => {
    expect(errorSource('person.name.empty')).toBe('people');
    expect(errorSource('person.remove.referenced')).toBe('people');
  });

  it('routes expense.* and amount.* codes to the expenses surface', () => {
    expect(errorSource('expense.title.empty')).toBe('expenses');
    expect(errorSource('expense.amount.invalid')).toBe('expenses');
    expect(errorSource('expense.payer.invalid')).toBe('expenses');
    expect(errorSource('expense.weight.invalid')).toBe('expenses');
    expect(errorSource('amount.empty')).toBe('expenses');
    expect(errorSource('amount.positive')).toBe('expenses');
  });

  it('treats storage.* codes as global so neither screen swallows them silently', () => {
    expect(errorSource('storage.save.failed')).toBe('global');
  });

  it('covers every ErrorCode (no message left unrouted)', () => {
    const codes = Object.keys(ERROR_MESSAGES) as ErrorCode[];
    for (const code of codes) {
      expect(['people', 'expenses', 'global']).toContain(errorSource(code));
    }
  });
});
