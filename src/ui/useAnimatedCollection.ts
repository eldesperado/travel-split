import { useEffect, useMemo, useRef, useState } from 'react';

type MotionPhase = 'entering' | 'stable' | 'leaving' | 'updated';

export type AnimatedCollectionItem<T> = {
  item: T;
  key: string;
  phase: MotionPhase;
};

type AnimatedRecord<T> = AnimatedCollectionItem<T> & {
  signature: string;
};

const EXIT_MS = 170;
const UPDATE_MS = 190;
const ENTER_MS = 210;

export function useAnimatedCollection<T>(
  items: T[],
  getKey: (item: T) => string,
  getSignature: (item: T) => string = (item) => JSON.stringify(item),
): AnimatedCollectionItem<T>[] {
  const firstRender = useRef(true);
  const timers = useRef<number[]>([]);
  const [records, setRecords] = useState<AnimatedRecord<T>[]>(() =>
    items.map((item) => ({ item, key: getKey(item), signature: getSignature(item), phase: 'stable' })),
  );

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    const incoming = new Map(items.map((item) => [getKey(item), { item, signature: getSignature(item) }]));
    const previous = new Map(records.map((record) => [record.key, record]));
    const next: AnimatedRecord<T>[] = [];

    items.forEach((item) => {
      const key = getKey(item);
      const signature = getSignature(item);
      const existing = previous.get(key);
      if (!existing) {
        next.push({ item, key, signature, phase: firstRender.current ? 'stable' : 'entering' });
        return;
      }

      const changed = existing.signature !== signature;
      next.push({
        ...existing,
        item,
        signature,
        phase: existing.phase === 'leaving' ? 'stable' : changed ? 'updated' : existing.phase,
      });
    });

    records.forEach((record) => {
      if (!incoming.has(record.key) && record.phase !== 'leaving') {
        next.push({ ...record, phase: 'leaving' });
      }
    });

    firstRender.current = false;
    setRecords(next);

    const hasTransient = next.some((record) => record.phase !== 'stable');
    if (hasTransient) {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
      const timer = window.setTimeout(() => {
        setRecords((current) => current
          .filter((record) => record.phase !== 'leaving')
          .map((record) => ({ ...record, phase: 'stable' })));
        timers.current = [];
      }, Math.max(EXIT_MS, UPDATE_MS, ENTER_MS));
      timers.current.push(timer);
    }
  // Intentionally depend on items/records: this hook owns the transient copy until CSS exit completes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, getKey, getSignature]);

  return useMemo(() => records.map(({ item, key, phase }) => ({ item, key, phase })), [records]);
}
