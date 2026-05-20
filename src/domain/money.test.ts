import { describe, expect, it } from 'vitest';
import { formatCents, formatCentsAbs, parseAmountToCents } from './money';

function cents(input: string): number {
  const result = parseAmountToCents(input);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}

describe('money', () => {
  it('parses user-entered decimal amounts to integer cents', () => {
    expect(cents('40')).toBe(4000);
    expect(cents('40.50')).toBe(4050);
    expect(cents('$1,234.05')).toBe(123405);
  });

  it('rejects malformed or non-positive amounts', () => {
    expect(parseAmountToCents('').ok).toBe(false);
    expect(parseAmountToCents('0').ok).toBe(false);
    expect(parseAmountToCents('12.345').ok).toBe(false);
    expect(parseAmountToCents('abc').ok).toBe(false);
  });

  it('formats signed and absolute cents', () => {
    expect(formatCents(1234)).toBe('+$12.34');
    expect(formatCents(-50)).toBe('−$0.50');
    expect(formatCentsAbs(-500)).toBe('$5.00');
  });
});
