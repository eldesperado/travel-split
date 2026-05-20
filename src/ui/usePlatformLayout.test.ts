import { describe, expect, it } from 'vitest';
import { DESKTOP_LAYOUT_MIN_WIDTH, getLayoutForViewport } from './usePlatformLayout';

describe('getLayoutForViewport', () => {
  it('uses mobile layout below the desktop breakpoint', () => {
    expect(getLayoutForViewport(320)).toBe('mobile');
    expect(getLayoutForViewport(461)).toBe('mobile');
    expect(getLayoutForViewport(DESKTOP_LAYOUT_MIN_WIDTH - 1)).toBe('mobile');
  });

  it('uses desktop layout at and above the desktop breakpoint', () => {
    expect(getLayoutForViewport(DESKTOP_LAYOUT_MIN_WIDTH)).toBe('desktop');
    expect(getLayoutForViewport(1280)).toBe('desktop');
  });
});
