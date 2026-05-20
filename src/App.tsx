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

function DesktopHeader() {
  const { shareSummary } = useTripData();
  const [copyStatus, setCopyStatus] = useState('');

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(shareSummary);
      setCopyStatus('Copied');
    } catch {
      setCopyStatus('Copy failed');
    }
  }

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

      <div className="desktop-header-actions">
        <span className="text-[12px] text-ink-subtle" role="status" aria-live="polite">{copyStatus}</span>
        <button className="btn-secondary desktop-copy-button" type="button" onClick={copySummary}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" />
          </svg>
          Copy summary
        </button>
      </div>
    </header>
  );
}
