import { useState } from 'react';
import { useTripData } from '../data/TripDataProvider';

type NavBarProps = {
  showCopy?: boolean;
};

export function NavBar({ showCopy = false }: NavBarProps) {
  const { shareSummary } = useTripData();
  const [copyStatus, setCopyStatus] = useState<string>('');

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(shareSummary);
      setCopyStatus('Copied');
    } catch {
      setCopyStatus('Copy failed');
    }
  }

  return (
    <div className="nav-bar">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-forest rounded-[6px] flex items-center justify-center flex-shrink-0">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 12l9-9 9 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 21V9h6v12" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="font-display text-[17px] font-bold text-ink-primary tracking-tight">Travel Split</span>
      </div>

      {showCopy && (
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-ink-subtle" role="status" aria-live="polite">{copyStatus}</span>
          <button className="nav-icon-btn" title="Copy settlement summary" aria-label="Copy settlement summary" onClick={copySummary}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
