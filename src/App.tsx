import { useState } from 'react';
import { NavBar } from './components/NavBar';
import { TabBar, type TabId } from './components/TabBar';
import { TripDataProvider, useTripData } from './data/TripDataProvider';
import { ExpensesScreen } from './screens/ExpensesScreen';
import { PeopleScreen } from './screens/PeopleScreen';
import { SettleScreen } from './screens/SettleScreen';
import { useResponsiveLayout } from './ui/usePlatformLayout';

export default function App() {
  return (
    <TripDataProvider>
      <TravelSplitShell />
    </TripDataProvider>
  );
}

function TravelSplitShell() {
  const [activeTab, setActiveTab] = useState<TabId>('expenses');
  const { trip, status } = useTripData();
  const layout = useResponsiveLayout();

  if (layout === 'mobile') {
    return (
      <div className="app-shell mobile-app-shell" data-layout="mobile">
        <NavBar showCopy={activeTab === 'settle'} />
        <TripBanner />

        {status === 'loading' ? (
          <div className="screen-body flex items-center justify-center text-sm text-ink-subtle">Loading your trip…</div>
        ) : (
          <div key={activeTab} className="flex-1 min-h-0 overflow-hidden screen-enter">
            {activeTab === 'people' && <PeopleScreen />}
            {activeTab === 'expenses' && <ExpensesScreen />}
            {activeTab === 'settle' && <SettleScreen />}
          </div>
        )}

        <TabBar active={activeTab} onSelect={setActiveTab} expenseCount={trip.expenses.length} />
      </div>
    );
  }

  return (
    <div className="desktop-app-shell" data-layout="desktop">
      <DesktopHeader />
      <TripBanner />
      {status === 'loading' ? (
        <div className="desktop-loading">Loading your trip…</div>
      ) : (
        <main className="desktop-workspace" aria-label="Travel Split workspace">
          <PeopleScreen />
          <ExpensesScreen />
          <SettleScreen />
        </main>
      )}
    </div>
  );
}

function TripBanner() {
  const { warning, clearMessage } = useTripData();
  if (!warning) return null;
  return (
    <div className="trip-banner" role="status" aria-live="polite">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
      <span className="trip-banner-msg">{warning}</span>
      <button className="trip-banner-dismiss" onClick={clearMessage} aria-label="Dismiss notification">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function DesktopHeader() {
  return (
    <header className="desktop-header">
      <div>
        <div className="desktop-brand-lockup">
          <div className="desktop-brand-icon" aria-hidden="true">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M3 12l9-9 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 21V9h6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="desktop-title">Travel Split</h1>
        </div>
        <p className="desktop-tagline">One screen · No accounts · Stays on your device</p>
      </div>


    </header>
  );
}
