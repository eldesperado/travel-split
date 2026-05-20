export type TabId = 'people' | 'expenses' | 'settle';

type TabBarProps = {
  active: TabId;
  onSelect: (tab: TabId) => void;
  expenseCount?: number;
};

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: 'people',
    label: 'People',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'expenses',
    label: 'Expenses',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 7h6M9 11h6M9 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'settle',
    label: 'Settle',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function TabBar({ active, onSelect, expenseCount }: TabBarProps) {
  return (
    <div className="tab-bar" role="tablist" aria-label="App sections">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        const showBadge = tab.id === 'expenses' && expenseCount != null && expenseCount > 0;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            className={`tab-item ${isActive ? 'is-active' : ''}`}
            onClick={() => onSelect(tab.id)}
          >
            <span className="tab-selection-surface" data-active-surface={isActive ? 'true' : undefined}>
              <span className="tab-icon-surface">
                <span className="tab-icon">{tab.icon}</span>
                {showBadge && (
                  <span
                    key={expenseCount}
                    className="badge-pulse absolute -top-0.5 -right-1.5 min-w-[16px] h-4 bg-negative text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                    aria-label={`${expenseCount} expenses`}
                  >
                    {expenseCount}
                  </span>
                )}
              </span>
              <span className="tab-label">{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
