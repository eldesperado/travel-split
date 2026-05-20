import { afterEach, describe, expect, it, vi } from 'vitest';
import { logger } from './logger';

describe('logger', () => {
  afterEach(() => vi.restoreAllMocks());

  it('writes structured info logs and redacts object state', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    logger.info('trip.command.start', { tripState: { secret: true }, type: 'person.add' });
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      event: 'trip.command.start',
      tripState: '[redacted]',
      type: 'person.add',
    }));
  });

  it('writes warning and error logs', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    logger.warn('storage.validation.failed');
    logger.error('idb.write.failed', { error: new Error('nope') });
    expect(warn).toHaveBeenCalledWith(expect.objectContaining({ event: 'storage.validation.failed' }));
    expect(error).toHaveBeenCalledWith(expect.objectContaining({ event: 'idb.write.failed', error: 'nope' }));
  });
});
