import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ErrorCallout } from '../components/ErrorCallout';
import { useScopedError, useTripData } from '../data/TripDataProvider';
import { isAmountErrorMessage } from '../domain/errors';
import { formatCentsAbs, parseAmountToCents } from '../domain/money';
import type { Expense, ExpenseParticipant } from '../domain/types';
import { useAnimatedCollection } from '../ui/useAnimatedCollection';
import { useNavigation } from '../ui/NavigationContext';
import { isStaleEditTarget, prepareEditState } from './editState';
import { getExpensesEmptyAction } from './emptyStateAction';
import { getExpensesNextStepAction } from './nextStepAction';

export function ExpensesScreen() {
  const titleId = useId();
  const amountId = useId();
  const payerId = useId();
  const weightPrefix = useId();
  const { trip, upsertExpense, deleteExpense, clearMessage } = useTripData();
  const { goTo, layout, registerInput, registerPanel } = useNavigation();
  const error = useScopedError('expenses');
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const amountInputRef = useRef<HTMLInputElement | null>(null);
  const weightInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [included, setIncluded] = useState<Record<string, boolean>>({});
  const [weights, setWeights] = useState<Record<string, string>>({});
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const skipNextSaveScrollRef = useRef(false);
  const animatedExpenses = useAnimatedCollection(
    trip.expenses,
    useCallback((expense: Expense) => expense.id, []),
    useCallback((expense: Expense) => `${expense.title}:${expense.amountCents}:${expense.payerId}:${expense.participants.map((participant: ExpenseParticipant) => `${participant.personId}-${participant.weight}`).join('|')}`, []),
  );

  useEffect(() => {
    if (!paidBy && trip.people[0]) setPaidBy(trip.people[0].id);
    setIncluded((current) => Object.fromEntries(trip.people.map((person) => [person.id, current[person.id] ?? true])));
    setWeights((current) => Object.fromEntries(trip.people.map((person) => [person.id, current[person.id] ?? '1'])));
  }, [paidBy, trip.people]);

  const selectedPeople = useMemo(() => {
    return trip.people.filter((person) => !customizeOpen || included[person.id]);
  }, [customizeOpen, included, trip.people]);

  const selectedParticipants = useMemo(() => {
    return selectedPeople.map((person) => ({ personId: person.id, weight: customizeOpen ? Number(weights[person.id]) : 1 }));
  }, [customizeOpen, selectedPeople, weights]);

  const invalidWeightPersonId = useMemo(() => {
    if (!customizeOpen) return undefined;
    return selectedPeople.find((person) => {
      const weight = Number(weights[person.id]);
      return !Number.isFinite(weight) || weight <= 0;
    })?.id;
  }, [customizeOpen, selectedPeople, weights]);

  async function saveExpense() {
    const titleInvalidBeforeSave = !title.trim();
    const amountInvalidBeforeSave = !parseAmountToCents(amount).ok;
    const invalidWeightBeforeSave = invalidWeightPersonId != null;
    const saved = await upsertExpense({ id: editingId ?? undefined, title, amount, payerId: paidBy, participants: selectedParticipants });
    if (saved) {
      setTitle('');
      setAmount('');
      setCustomizeOpen(false);
      setEditingId(null);
      return;
    }

    if (amountInvalidBeforeSave) {
      focusInput(amountInputRef.current);
      return;
    }

    if (titleInvalidBeforeSave) {
      focusInput(titleInputRef.current);
      return;
    }

    if (invalidWeightBeforeSave && invalidWeightPersonId) {
      focusInput(weightInputRefs.current[invalidWeightPersonId]);
    }
  }

  function startEdit(expense: Expense) {
    const next = prepareEditState(expense, trip.people, customizeOpen);
    setEditingId(expense.id);
    setTitle(next.title);
    setAmount(next.amount);
    setPaidBy(next.paidBy);
    if (next.skipNextSaveScroll) skipNextSaveScrollRef.current = true;
    setCustomizeOpen(next.customizeOpen);
    setIncluded(next.included);
    setWeights(next.weights);
    clearMessage();
    requestAnimationFrame(() => {
      titleInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      titleInputRef.current?.focus({ preventScroll: true });
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle('');
    setAmount('');
    setCustomizeOpen(false);
    clearMessage();
  }

  useEffect(() => {
    if (!customizeOpen) return;
    if (skipNextSaveScrollRef.current) {
      skipNextSaveScrollRef.current = false;
      return;
    }
    const id = window.setTimeout(() => {
      saveButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 320);
    return () => window.clearTimeout(id);
  }, [customizeOpen]);

  useEffect(() => {
    if (isStaleEditTarget(editingId, trip.expenses)) {
      setEditingId(null);
      setTitle('');
      setAmount('');
      setCustomizeOpen(false);
    }
  }, [editingId, trip.expenses]);

  const amountHasError = isAmountErrorMessage(error);
  const selectedWeightTotal = selectedParticipants.reduce((sum, participant) => {
    if (!Number.isFinite(participant.weight) || participant.weight <= 0) return sum;
    return sum + participant.weight;
  }, 0);
  const selectedSummary = getSelectedSummary({
    customizeOpen,
    invalidWeightPersonId,
    selectedCount: selectedPeople.length,
    selectedWeightTotal,
    tripPeopleCount: trip.people.length,
  });
  const expensesEmptyAction = getExpensesEmptyAction(trip);
  const nextStepAction = getExpensesNextStepAction(trip);
  const showMobileEmptyAction = layout === 'mobile' && expensesEmptyAction != null && !editingId;

  function registerTitleInput(element: HTMLInputElement | null) {
    titleInputRef.current = element;
    registerInput('expenseTitle', element);
  }

  return (
    <div className="screen-body" ref={(element) => registerPanel('expenses', element)} tabIndex={-1}>
      <div className="panel">
        <div className="panel-inner">
          <div className="panel-head">
            <div>
              <p className="section-eyebrow">{editingId ? 'Editing expense' : 'Expenses'}</p>
              <h2 className="panel-title">{editingId ? 'Update details' : 'Activities & costs'}</h2>
            </div>
            {editingId ? (
              <button type="button" className="btn-secondary h-9 text-[12px] px-3" onClick={cancelEdit}>Cancel</button>
            ) : (
              <span className="count-badge">{trip.expenses.length}</span>
            )}
          </div>

          <ErrorCallout message={error} onDismiss={clearMessage} />

          {trip.people.length === 0 ? (
            showMobileEmptyAction ? (
              <button type="button" className="empty-state empty-state-action" onClick={() => goTo(expensesEmptyAction.target)}>
                <ExpensesEmptyContent />
                <span className="empty-state-cta">{expensesEmptyAction.label} →</span>
              </button>
            ) : (
              <div className="empty-state">
                <ExpensesEmptyContent />
              </div>
            )
          ) : (
            <>
              <div className="field">
                <label className="field-label" htmlFor={titleId}>Title</label>
                <input id={titleId} ref={registerTitleInput} className="field-input" type="text" placeholder="e.g. Dinner, Boat tickets…" value={title} onChange={(event) => setTitle(event.target.value)} />
              </div>

              <div className="field">
                <label className="field-label" htmlFor={amountId}>Amount</label>
                <div className="amount-wrap">
                  <span className="amount-prefix">$</span>
                  <input id={amountId} ref={amountInputRef} className="field-input" type="text" inputMode="decimal" placeholder="e.g. 120.00" value={amount} onChange={(event) => setAmount(event.target.value)} aria-invalid={amountHasError ? 'true' : undefined} />
                </div>
              </div>

              <div className="field">
                <label className="field-label" htmlFor={payerId}>Paid by</label>
                <div className="select-wrap">
                  <select id={payerId} className="field-select" value={paidBy} onChange={(event) => setPaidBy(event.target.value)}>
                    {trip.people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="split-hint" aria-live="polite">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {customizeOpen ? `Custom weighted split · ${selectedSummary}` : selectedSummary}
              </div>

              <button className="disclosure-trigger" type="button" aria-expanded={customizeOpen} onClick={() => setCustomizeOpen((value) => !value)} style={customizeOpen ? { background: '#e1eadf', borderColor: '#3f6f56', borderStyle: 'solid', color: '#244732' } : undefined}>
                <span className={customizeOpen ? 'font-semibold' : ''}>Customize split</span>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true" style={{ transform: customizeOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }}>
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={`disclosure-panel ${customizeOpen ? 'is-open' : ''}`}>
                <div className="border-[1.5px] border-forest-pill rounded-xl overflow-hidden mb-3 bg-brand-row">
                  {trip.people.map((person, index) => (
                    <div key={person.id} className={`flex items-center gap-2.5 px-3.5 py-2.5 ${index < trip.people.length - 1 ? 'border-b border-border-row' : ''}`}>
                      <label className="flex items-center gap-2 flex-1 cursor-pointer text-[13px] font-medium text-ink-primary">
                        <input type="checkbox" checked={included[person.id] ?? true} onChange={(event) => setIncluded((current) => ({ ...current, [person.id]: event.target.checked }))} className="w-4 h-4 accent-forest" />
                        <div className="avatar w-6 h-6 text-[11px]" style={{ background: person.avatarBg }}>{person.name[0]}</div>
                        {person.name}
                      </label>
                      <div className="flex items-center gap-1.5">
                        <label className="text-[11px] text-ink-subtle" htmlFor={`${weightPrefix}-${person.id}`}>Weight</label>
                        <input
                          id={`${weightPrefix}-${person.id}`}
                          ref={(element) => { weightInputRefs.current[person.id] = element; }}
                          type="number"
                          value={weights[person.id] ?? '1'}
                          min="0.25"
                          step="0.25"
                          disabled={!(included[person.id] ?? true)}
                          onChange={(event) => setWeights((current) => ({ ...current, [person.id]: event.target.value }))}
                          aria-invalid={invalidWeightPersonId === person.id ? 'true' : undefined}
                          className="w-14 h-[34px] border-[1.5px] border-border-input rounded-lg text-center font-mono text-sm bg-white disabled:bg-brand-row disabled:opacity-40"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="px-3.5 py-2 bg-forest-pill border-t border-border-row flex items-center gap-1.5 text-[11px] text-forest font-medium">{selectedSummary}</div>
                </div>
              </div>

              <button ref={saveButtonRef} className="btn-primary" type="button" onClick={saveExpense}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {editingId ? 'Update expense' : 'Save expense'}
              </button>
            </>
          )}

          <div className="section-divider" />
          <p className="section-label">Recent</p>

          {trip.expenses.length === 0 && animatedExpenses.length === 0 ? (
            <p className="text-xs text-ink-subtle">No expenses yet.</p>
          ) : (
            <>
              <div className="motion-list" aria-live="polite">
              {animatedExpenses.map(({ item: expense, key, phase }) => {
                const payer = trip.people.find((person) => person.id === expense.payerId);
                const weighted = expense.participants.some((participant) => participant.weight !== 1);
                return (
                  <div key={key} className={`list-row motion-row is-${phase} items-start`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-ink-primary truncate">{expense.title}</p>
                      <p className="text-xs text-ink-subtle mt-0.5">Paid by {payer?.name ?? 'Unknown'} · {expense.participants.length} people{weighted && ' · weighted'}</p>
                    </div>
                    <span className="font-mono text-[14px] font-medium text-ink-primary whitespace-nowrap">{formatCentsAbs(expense.amountCents)}</span>
                    <button className="btn-icon w-[30px] h-[30px] text-ink-muted" aria-label={`Edit ${expense.title}`} onClick={() => startEdit(expense)}>
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button className="btn-icon w-[30px] h-[30px] text-negative/80" aria-label={`Delete ${expense.title}`} onClick={() => void deleteExpense(expense.id)}>
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                );
              })}
              </div>
              {nextStepAction && !editingId && (
                <div className="next-step-card">
                  <div>
                    <p className="next-step-title">Ready to settle up?</p>
                    <p className="next-step-body">Review who pays whom after recording expenses.</p>
                  </div>
                  <button type="button" className="next-step-button" onClick={() => goTo(nextStepAction.target)}>
                    {nextStepAction.label} →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ExpensesEmptyContent() {
  return (
    <>
      <div className="empty-state-icon" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-ink-muted mb-1">Add people first</p>
      <p className="text-xs text-ink-subtle leading-relaxed">Expenses need a payer and split participants before they can be saved.</p>
    </>
  );
}

type SelectedSummaryInput = {
  customizeOpen: boolean;
  invalidWeightPersonId?: string;
  selectedCount: number;
  selectedWeightTotal: number;
  tripPeopleCount: number;
};

function getSelectedSummary({ customizeOpen, invalidWeightPersonId, selectedCount, selectedWeightTotal, tripPeopleCount }: SelectedSummaryInput): string {
  if (!customizeOpen) return `Split equally across ${tripPeopleCount} people`;
  if (invalidWeightPersonId) return `${selectedCount} selected · fix weights`;
  return `${selectedCount} selected · total weight ${selectedWeightTotal}`;
}

function focusInput(input?: HTMLInputElement | null) {
  input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  input?.focus({ preventScroll: true });
}

