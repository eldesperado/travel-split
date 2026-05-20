import type { Result } from './types';

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err(code: string, message: string): Result<never> {
  return { ok: false, error: { code, message } };
}

export function parseAmountToCents(input: string): Result<number> {
  const normalized = input.trim().replace(/^\$/, '').replace(/,/g, '');

  if (!normalized) return err('amount.empty', 'Enter an amount.');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    return err('amount.invalid', 'Use dollars and cents, like 40 or 40.50.');
  }

  const [dollarsPart, centsPart = ''] = normalized.split('.');
  const dollars = Number(dollarsPart);
  if (!Number.isSafeInteger(dollars)) return err('amount.invalid', 'Amount is too large.');

  const cents = dollars * 100 + Number(centsPart.padEnd(2, '0'));
  if (cents <= 0) return err('amount.positive', 'Amount must be greater than zero.');
  if (!Number.isSafeInteger(cents)) return err('amount.invalid', 'Amount is too large.');

  return ok(cents);
}

export function formatCents(cents: number): string {
  const sign = cents < 0 ? '−' : '+';
  return `${sign}${formatCentsAbs(cents)}`;
}

export function formatCentsAbs(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = String(abs % 100).padStart(2, '0');
  return `$${dollars}.${remainder}`;
}
