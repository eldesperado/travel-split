import { useMemo } from 'react';

export type PlatformLayout = 'mobile' | 'desktop';

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: {
    mobile?: boolean;
    platform?: string;
  };
};

export function usePlatformLayout(): PlatformLayout {
  return useMemo(() => (isMobileBrowserPlatform() ? 'mobile' : 'desktop'), []);
}

export function isMobileBrowserPlatform(): boolean {
  // Presentation-only detector. Do not use this for permissions, persistence, or security decisions.
  if (typeof navigator === 'undefined') return false;

  const nav = navigator as NavigatorWithUserAgentData;
  if (typeof nav.userAgentData?.mobile === 'boolean') return nav.userAgentData.mobile;

  const userAgent = navigator.userAgent || '';
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent);
}
