import { useMemo } from 'react';

type MotionPhase = 'stable';

export type AnimatedCollectionItem<T> = {
  item: T;
  key: string;
  phase: MotionPhase;
};

export function useAnimatedCollection<T>(
  items: T[],
  getKey: (item: T) => string,
  _getSignature: (item: T) => string = (item) => JSON.stringify(item),
): AnimatedCollectionItem<T>[] {
  return useMemo(
    () => items.map((item) => ({ item, key: getKey(item), phase: 'stable' })),
    [getKey, items],
  );
}
