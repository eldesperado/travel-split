import React, { useCallback, useId, useState } from 'react';
import { ErrorCallout } from '../components/ErrorCallout';
import { useScopedError, useTripData } from '../data/TripDataProvider';
import type { Person } from '../domain/types';
import { useAnimatedCollection } from '../ui/useAnimatedCollection';

export function PeopleScreen() {
  const inputId = useId();
  const [nameInput, setNameInput] = useState('');
  const { trip, selectors, addPerson, removePerson, clearMessage } = useTripData();
  const error = useScopedError('people');
  const animatedPeople = useAnimatedCollection(
    trip.people,
    useCallback((person: Person) => person.id, []),
    useCallback((person: Person) => `${person.name}:${person.avatarBg}`, []),
  );

  async function submitPerson() {
    const added = await addPerson(nameInput);
    if (added) setNameInput('');
  }

  return (
    <div className="screen-body">
      <div className="panel">
        <div className="panel-inner">
          <div className="panel-head">
            <div>
              <p className="section-eyebrow">People</p>
              <h2 className="panel-title">Trip group</h2>
            </div>
            <span className="count-badge">{trip.people.length}</span>
          </div>

          <ErrorCallout message={error} onDismiss={clearMessage} />

          <div className="field">
            <label className="field-label" htmlFor={inputId}>Add someone</label>
            <input
              id={inputId}
              className="field-input"
              type="text"
              placeholder="Name"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void submitPerson();
              }}
              autoFocus={trip.people.length === 0}
            />
          </div>

          <button className="btn-primary" type="button" onClick={submitPerson}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Add to trip
          </button>

          {trip.people.length === 0 && (
            <div className="empty-state">
              <p className="text-3xl mb-2">🧳</p>
              <p className="text-sm font-semibold text-ink-muted mb-1">No one added yet</p>
              <p className="text-xs text-ink-subtle leading-relaxed">Type a name above to add the first traveler. Add everyone before recording expenses.</p>
            </div>
          )}

          {animatedPeople.length > 0 && (
            <div className="mt-3">
              <div className="section-divider" />
              <div className="motion-list" aria-live="polite">
                {animatedPeople.map(({ item: person, key, phase }, index) => {
                  const isReferenced = selectors.referencedPersonIds.has(person.id);
                  return (
                    <div key={key} className={`list-row motion-row is-${phase}`} style={{ '--row-delay': `${index * 50}ms` } as React.CSSProperties}>
                      <div className="avatar" style={{ background: person.avatarBg }}>{person.name[0]}</div>
                      <span className="flex-1 text-[15px] font-medium text-ink-primary">{person.name}</span>
                      <button
                      className="btn-icon"
                      disabled={isReferenced}
                      style={isReferenced ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
                      title={isReferenced ? 'Used in an expense — remove that expense first' : `Remove ${person.name}`}
                      aria-label={`Remove ${person.name}`}
                      onClick={() => void removePerson(person.id)}
                      >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="info-callout">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="flex-shrink-0 mt-px" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Dimmed removes are blocked — that person is referenced by an expense.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

