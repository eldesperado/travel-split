import { useEffect, useState } from 'react';

export type AppLayout = 'mobile' | 'desktop';

export const DESKTOP_LAYOUT_MIN_WIDTH = 980;

export function getLayoutForViewport(width: number): AppLayout {
  return width >= DESKTOP_LAYOUT_MIN_WIDTH ? 'desktop' : 'mobile';
}

export function useResponsiveLayout(): AppLayout {
  const [layout, setLayout] = useState<AppLayout>(() => {
    if (typeof window === 'undefined') return 'desktop';
    return getLayoutForViewport(window.innerWidth);
  });

  useEffect(() => {
    const updateLayout = () => setLayout(getLayoutForViewport(window.innerWidth));
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  return layout;
}
