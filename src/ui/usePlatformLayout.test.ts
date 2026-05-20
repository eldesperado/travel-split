import { afterEach, describe, expect, it } from 'vitest';
import { isMobileBrowserPlatform } from './usePlatformLayout';

const originalNavigator = globalThis.navigator;

function setNavigator(value: Partial<Navigator> & { userAgentData?: { mobile?: boolean; platform?: string } }) {
  Object.defineProperty(globalThis, 'navigator', {
    value,
    configurable: true,
  });
}

describe('isMobileBrowserPlatform', () => {
  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      configurable: true,
    });
  });

  it('prefers userAgentData.mobile when available', () => {
    setNavigator({ userAgent: 'Desktop string with Mobile token', userAgentData: { mobile: false } });
    expect(isMobileBrowserPlatform()).toBe(false);

    setNavigator({ userAgent: 'Desktop Chrome', userAgentData: { mobile: true } });
    expect(isMobileBrowserPlatform()).toBe(true);
  });

  it('falls back to mobile user agent detection', () => {
    setNavigator({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148' });
    expect(isMobileBrowserPlatform()).toBe(true);
  });

  it('treats desktop browser platforms as desktop even at narrow widths', () => {
    setNavigator({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 Chrome/124 Safari/537.36' });
    expect(isMobileBrowserPlatform()).toBe(false);
  });
});
