import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from 'react';
import type { TabId } from '../components/TabBar';
import type { AppLayout } from './usePlatformLayout';

export type NavigationTarget = 'people' | 'expenses';
type NavigationInputKey = 'peopleName' | 'expenseTitle';

type NavigationContextValue = {
  layout: AppLayout;
  goTo: (target: NavigationTarget) => void;
  registerInput: (key: NavigationInputKey, element: HTMLInputElement | null) => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({
  children,
  layout,
  onMobileTabChange,
}: {
  children: ReactNode;
  layout: AppLayout;
  onMobileTabChange: (tab: TabId) => void;
}) {
  const inputsRef = useRef<Record<NavigationInputKey, HTMLInputElement | null>>({
    peopleName: null,
    expenseTitle: null,
  });

  const focusTarget = useCallback((target: NavigationTarget) => {
    const key = target === 'people' ? 'peopleName' : 'expenseTitle';
    const input = inputsRef.current[key];
    input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input?.focus({ preventScroll: true });
  }, []);

  const goTo = useCallback((target: NavigationTarget) => {
    if (layout === 'mobile') {
      onMobileTabChange(target);
      window.setTimeout(() => focusTarget(target), 80);
      return;
    }

    focusTarget(target);
  }, [focusTarget, layout, onMobileTabChange]);

  const registerInput = useCallback((key: NavigationInputKey, element: HTMLInputElement | null) => {
    inputsRef.current[key] = element;
  }, []);

  const value = useMemo(() => ({ layout, goTo, registerInput }), [goTo, layout, registerInput]);

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation() {
  const value = useContext(NavigationContext);
  if (!value) throw new Error('useNavigation must be used inside NavigationProvider');
  return value;
}
