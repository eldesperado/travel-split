import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { parseAmountToCents } from '../domain/money';
import { selectTrip, type TripSelectors } from '../domain/selectors';
import { tripReducer } from '../domain/tripReducer';
import { createEmptyTrip, type DomainError, type ExpenseParticipant, type TripCommand, type TripState } from '../domain/types';
import { logger } from '../logging/logger';
import { IndexedDbTripRepository, type TripRepository } from '../storage/tripRepository';

export type ExpenseFormInput = {
  id?: string;
  title: string;
  amount: string;
  payerId: string;
  participants: ExpenseParticipant[];
};

type TripDataContextValue = {
  status: 'loading' | 'ready';
  trip: TripState;
  selectors: TripSelectors;
  error?: string;
  warning?: string;
  addPerson: (name: string) => Promise<boolean>;
  removePerson: (personId: string) => Promise<boolean>;
  upsertExpense: (input: ExpenseFormInput) => Promise<boolean>;
  deleteExpense: (expenseId: string) => Promise<boolean>;
  clearMessage: () => void;
  shareSummary: string;
};

const TripDataContext = createContext<TripDataContextValue | null>(null);

export function TripDataProvider({ children, repository }: { children: ReactNode; repository?: TripRepository }) {
  const repositoryRef = useRef<TripRepository>(repository ?? new IndexedDbTripRepository(logger));
  const activeRepository = repositoryRef.current;
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');
  const [trip, setTrip] = useState<TripState>(() => createEmptyTrip());
  const [error, setError] = useState<string>();
  const [warning, setWarning] = useState<string>();
  const tripRef = useRef(trip);

  useEffect(() => {
    tripRef.current = trip;
  }, [trip]);

  useEffect(() => {
    let alive = true;
    async function load() {
      logger.info('trip.load.start');
      try {
        const loaded = await activeRepository.loadActiveTrip();
        const next = loaded ?? createEmptyTrip();
        if (!loaded) await activeRepository.saveTrip(next);
        if (!alive) return;
        setTrip(next);
        setWarning(loaded ? undefined : 'Started a new local trip.');
        logger.info('trip.load.success', { tripId: next.id });
      } catch (loadError) {
        if (!alive) return;
        const fallback = createEmptyTrip();
        setTrip(fallback);
        setWarning('Local database was unavailable, so an empty trip was opened.');
        logger.error('trip.load.failed', { error: loadError });
      } finally {
        if (alive) setStatus('ready');
      }
    }
    void load();
    return () => { alive = false; };
  }, [activeRepository]);

  const runCommand = useCallback(async (command: TripCommand): Promise<boolean> => {
    logger.info('trip.command.start', { type: command.type, tripId: tripRef.current.id });
    setError(undefined);
    const result = tripReducer(tripRef.current, command);
    if (result.error) {
      setError(result.error.message);
      logger.warn('trip.command.validation_failed', { type: command.type, code: result.error.code });
      return false;
    }

    try {
      await activeRepository.saveTrip(result.state);
      tripRef.current = result.state;
      setTrip(result.state);
      logger.info('trip.command.success', { type: command.type, tripId: result.state.id });
      return true;
    } catch (saveError) {
      setError('Could not save this change locally. Try again.');
      logger.error('trip.command.failed', { type: command.type, error: saveError });
      return false;
    }
  }, [activeRepository]);

  const addPerson = useCallback((name: string) => runCommand({ type: 'person.add', name }), [runCommand]);
  const removePerson = useCallback((personId: string) => runCommand({ type: 'person.remove', personId }), [runCommand]);
  const deleteExpense = useCallback((expenseId: string) => runCommand({ type: 'expense.delete', expenseId }), [runCommand]);

  const upsertExpense = useCallback(async (input: ExpenseFormInput) => {
    const amount = parseAmountToCents(input.amount);
    if (!amount.ok) {
      setError(amount.error.message);
      logger.warn('expense.validation.failed', { code: amount.error.code });
      return false;
    }

    return runCommand({
      type: 'expense.upsert',
      expense: {
        id: input.id,
        title: input.title,
        amountCents: amount.value,
        payerId: input.payerId,
        participants: input.participants,
      },
    });
  }, [runCommand]);

  const selectors = useMemo(() => selectTrip(trip), [trip]);
  const shareSummary = useMemo(() => buildShareSummary(trip, selectors), [trip, selectors]);
  const contextValue = useMemo<TripDataContextValue>(() => ({
    status,
    trip,
    selectors,
    error,
    warning: selectors.invalidExpenseIds.length > 0
      ? `${selectors.invalidExpenseIds.length} invalid expense${selectors.invalidExpenseIds.length === 1 ? '' : 's'} ignored in settlement math.`
      : warning,
    addPerson,
    removePerson,
    upsertExpense,
    deleteExpense,
    clearMessage: () => { setError(undefined); setWarning(undefined); },
    shareSummary,
  }), [addPerson, deleteExpense, error, removePerson, selectors, shareSummary, status, trip, upsertExpense, warning]);

  return <TripDataContext.Provider value={contextValue}>{children}</TripDataContext.Provider>;
}

export function useTripData(): TripDataContextValue {
  const value = useContext(TripDataContext);
  if (!value) throw new Error('useTripData must be used inside TripDataProvider');
  return value;
}

function buildShareSummary(trip: TripState, selectors: TripSelectors): string {
  const lines = [`${trip.name} settlement summary`, ''];
  if (selectors.settlements.length === 0) {
    lines.push('All settled up.');
  } else {
    selectors.settlements.forEach((settlement) => {
      lines.push(`${settlement.from} pays ${settlement.to} ${settlement.cents >= 0 ? '' : '-'}$${(settlement.cents / 100).toFixed(2)}`);
    });
  }
  lines.push('', `${trip.people.length} people · ${trip.expenses.length} expenses`);
  return lines.join('\n');
}
