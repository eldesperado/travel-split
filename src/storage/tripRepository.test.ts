import { describe, expect, it } from 'vitest';
import 'fake-indexeddb/auto';
import { createEmptyTrip } from '../domain/types';
import { IndexedDbTripRepository, parseTripState } from './tripRepository';

describe('IndexedDbTripRepository', () => {
  it('saves and reloads the active trip snapshot', async () => {
    const repo = new IndexedDbTripRepository();
    await repo.resetTrip('active-trip');
    const trip = {
      ...createEmptyTrip('t'),
      people: [{ id: 'alex', tripId: 'active-trip', name: 'Alex', avatarBg: '#aaa', createdAt: 't' }],
    };

    await repo.saveTrip(trip);
    await expect(repo.loadActiveTrip()).resolves.toMatchObject({ id: 'active-trip', people: [{ id: 'alex' }] });
  });

  it('resets the active trip', async () => {
    const repo = new IndexedDbTripRepository();
    const trip = createEmptyTrip('t');
    await repo.saveTrip(trip);
    await repo.resetTrip(trip.id);
    await expect(repo.loadActiveTrip()).resolves.toBeNull();
  });
});

describe('parseTripState', () => {
  it('rejects structurally invalid snapshots', () => {
    expect(parseTripState({ people: 'Alex' })).toBeNull();
  });

  it('keeps structurally valid but semantically invalid expenses for domain warnings', () => {
    const parsed = parseTripState({
      ...createEmptyTrip('t'),
      expenses: [{
        id: 'bad',
        tripId: 'active-trip',
        title: 'Bad',
        amountCents: 100,
        payerId: 'missing',
        participants: [{ personId: 'missing', weight: 1 }],
        createdAt: 't',
        updatedAt: 't',
      }],
    });
    expect(parsed?.expenses).toHaveLength(1);
  });
});
