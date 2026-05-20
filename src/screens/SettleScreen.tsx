import { useCallback, useEffect, useState } from 'react';
import { useTripData } from '../data/TripDataProvider';
import { formatCentsAbs } from '../domain/money';
import { balanceLabel } from '../domain/split';
import type { Balance, Settlement } from '../domain/types';
import { useAnimatedCollection } from '../ui/useAnimatedCollection';
import { useNavigation } from '../ui/NavigationContext';
import { getSettleEmptyAction, type EmptyStateTarget } from './emptyStateAction';

export function SettleScreen() {
  const { trip, selectors } = useTripData();
  const { goTo, layout } = useNavigation();
  const [expandedId, setExpandedId] = useState<string | null>(selectors.settlements[0]?.id ?? null);
  const animatedBalances = useAnimatedCollection(
    selectors.balances,
    useCallback((balance: Balance) => balance.personId, []),
    useCallback((balance: Balance) => `${balance.name}:${balance.cents}`, []),
  );
  const animatedSettlements = useAnimatedCollection(
    selectors.settlements,
    useCallback((settlement: Settlement) => settlement.id, []),
    useCallback((settlement: Settlement) => `${settlement.from}:${settlement.to}:${settlement.cents}:${settlement.explanation}`, []),
  );

  useEffect(() => {
    if (!expandedId && selectors.settlements[0]) setExpandedId(selectors.settlements[0].id);
  }, [expandedId, selectors.settlements]);

  const settleEmptyAction = getSettleEmptyAction(trip);
  const showMobileEmptyAction = layout === 'mobile' && settleEmptyAction != null;

  return (
    <div className="screen-body">
      <div className="panel">
        <div className="panel-inner">
          <div className="panel-head">
            <div>
              <p className="section-eyebrow">Settlement</p>
              <h2 className="panel-title">Who pays whom</h2>
            </div>
          </div>

          <p className="section-label">Net balances</p>

          {settleEmptyAction ? (
            showMobileEmptyAction ? (
              <button type="button" className="empty-state empty-state-action" onClick={() => goTo(settleEmptyAction.target)}>
                <SettleEmptyContent target={settleEmptyAction.target} />
                <span className="empty-state-cta">{settleEmptyAction.label} →</span>
              </button>
            ) : (
              <div className="empty-state">
                <SettleEmptyContent target={settleEmptyAction.target} />
              </div>
            )
          ) : (
            <div className="motion-list" aria-live="polite">
              {animatedBalances.map(({ item: balance, key, phase }) => {
                const isPos = balance.cents > 0;
                const isNeg = balance.cents < 0;
                return (
                  <div key={key} className={`balance-row motion-row is-${phase}`}>
                    <div className="flex items-center gap-2.5">
                      <div className="avatar" style={{ background: balance.avatarBg }}>{balance.name[0]}</div>
                      <span className="text-[15px] font-medium text-ink-primary">{balance.name}</span>
                    </div>
                    <span className={`font-mono text-[14px] font-medium flex items-center gap-1 ${isPos ? 'text-positive' : isNeg ? 'text-negative' : 'text-ink-subtle'}`}>
                      <span className="text-[10px] font-bold">{isPos ? '▲' : isNeg ? '▼' : '◦'}</span>
                      {balanceLabel(balance.cents)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="section-divider" />
          <p className="section-label">Suggested payments</p>

          {selectors.settlements.length === 0 && animatedSettlements.length === 0 ? (
            <p className="text-xs text-ink-subtle">{trip.expenses.length === 0 ? 'Suggested payments will appear after an expense.' : 'All settled up.'}</p>
          ) : (
            <div className="motion-list" aria-live="polite">
              {animatedSettlements.map(({ item: settlement, key, phase }) => {
                const isExpanded = expandedId === settlement.id;
                return (
                  <div key={key} className={`motion-row is-${phase}`}>
                    {isExpanded ? (
                      <div className="receipt-card receipt-enter cursor-pointer" onClick={() => setExpandedId(null)}>
                        <div className="receipt-head">
                          <div className="flex items-center gap-2 text-white text-sm font-semibold">
                            <span>{settlement.from}</span>
                            <span className="opacity-60">→</span>
                            <span>{settlement.to}</span>
                          </div>
                          <span className="font-mono text-base font-medium text-white">{formatCentsAbs(settlement.cents)}</span>
                        </div>
                        <div className="receipt-body">{settlement.explanation}</div>
                      </div>
                    ) : (
                      <button type="button" className="settlement-row w-full" onClick={() => setExpandedId(settlement.id)}>
                        <span className="text-[14px] font-semibold text-ink-primary">{settlement.from}</span>
                        <span className="text-ink-subtle text-sm">→</span>
                        <span className="text-[14px] font-semibold text-ink-primary">{settlement.to}</span>
                        <span className="flex-1" />
                        <span className="font-mono text-[14px] font-medium text-ink-primary">{formatCentsAbs(settlement.cents)}</span>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="text-ink-subtle flex-shrink-0" aria-hidden="true">
                          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="info-callout mt-3">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="flex-shrink-0 mt-px" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Tap a payment to see the receipt explanation. All amounts precise to the cent.
          </div>
        </div>
      </div>
    </div>
  );
}

function SettleEmptyContent({ target }: { target: EmptyStateTarget }) {
  const body = target === 'people'
    ? 'Add travelers and a few expenses to see who pays whom.'
    : 'Record at least one expense to see the split.';

  return (
    <>
      <div className="empty-state-icon" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l3 3 5-6" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-ink-muted mb-1">Nothing to settle yet</p>
      <p className="text-xs text-ink-subtle leading-relaxed">{body}</p>
    </>
  );
}
