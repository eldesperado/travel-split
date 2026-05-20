import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { createEmptyTrip, type Expense, type Person, type TripState } from '../domain/types';
import type { Logger } from '../logging/logger';

const DB_NAME = 'travel-split';
const DB_VERSION = 1;
const ACTIVE_TRIP_KEY = 'activeTripId';
const SNAPSHOT_VERSION = 1;

export interface TripRepository {
  loadActiveTrip(): Promise<TripState | null>;
  saveTrip(trip: TripState): Promise<void>;
  resetTrip(tripId: string): Promise<void>;
}

type MetadataRecord = { key: string; value: string };
type TripSnapshotRecord = { tripId: string; schemaVersion: number; state: unknown; updatedAt: string };

interface TravelSplitDb extends DBSchema {
  metadata: {
    key: string;
    value: MetadataRecord;
  };
  tripSnapshots: {
    key: string;
    value: TripSnapshotRecord;
  };
}

export class IndexedDbTripRepository implements TripRepository {
  private dbPromise?: Promise<IDBPDatabase<TravelSplitDb>>;

  constructor(private readonly logger?: Logger) {}

  async loadActiveTrip(): Promise<TripState | null> {
    const db = await this.db();
    const metadata = await db.get('metadata', ACTIVE_TRIP_KEY);
    if (!metadata?.value) return null;

    const snapshot = await db.get('tripSnapshots', metadata.value);
    if (!snapshot) return null;

    const state = parseTripState(snapshot.state);
    if (!state) {
      this.logger?.warn('storage.validation.failed', { tripId: metadata.value });
      return createEmptyTrip();
    }

    return state;
  }

  async saveTrip(trip: TripState): Promise<void> {
    const db = await this.db();
    const tx = db.transaction(['metadata', 'tripSnapshots'], 'readwrite');
    await tx.objectStore('metadata').put({ key: ACTIVE_TRIP_KEY, value: trip.id });
    await tx.objectStore('tripSnapshots').put({
      tripId: trip.id,
      schemaVersion: SNAPSHOT_VERSION,
      state: trip,
      updatedAt: new Date().toISOString(),
    });
    await tx.done;
  }

  async resetTrip(tripId: string): Promise<void> {
    const db = await this.db();
    const tx = db.transaction(['metadata', 'tripSnapshots'], 'readwrite');
    await tx.objectStore('tripSnapshots').delete(tripId);
    const metadata = await tx.objectStore('metadata').get(ACTIVE_TRIP_KEY);
    if (metadata?.value === tripId) await tx.objectStore('metadata').delete(ACTIVE_TRIP_KEY);
    await tx.done;
  }

  private db(): Promise<IDBPDatabase<TravelSplitDb>> {
    this.dbPromise ??= openDB<TravelSplitDb>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('metadata')) db.createObjectStore('metadata', { keyPath: 'key' });
        if (!db.objectStoreNames.contains('tripSnapshots')) db.createObjectStore('tripSnapshots', { keyPath: 'tripId' });
      },
    });
    return this.dbPromise;
  }
}

export function parseTripState(value: unknown): TripState | null {
  if (!isRecord(value)) return null;
  if (!isString(value.id) || !isString(value.name) || !isString(value.createdAt) || !isString(value.updatedAt)) return null;
  if (!Array.isArray(value.people) || !Array.isArray(value.expenses)) return null;

  const people = value.people.filter(isPerson);
  const expenses = value.expenses.filter(isExpense);
  if (people.length !== value.people.length) return null;

  return {
    id: value.id,
    name: value.name,
    people,
    expenses,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

function isPerson(value: unknown): value is Person {
  return isRecord(value)
    && isString(value.id)
    && isString(value.tripId)
    && isString(value.name)
    && isString(value.avatarBg)
    && isString(value.createdAt);
}

function isExpense(value: unknown): value is Expense {
  return isRecord(value)
    && isString(value.id)
    && isString(value.tripId)
    && isString(value.title)
    && Number.isSafeInteger(value.amountCents)
    && isString(value.payerId)
    && Array.isArray(value.participants)
    && value.participants.every((participant) => isRecord(participant)
      && isString(participant.personId)
      && typeof participant.weight === 'number');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}
