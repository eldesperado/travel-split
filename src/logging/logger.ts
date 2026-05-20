export type LogLevel = 'info' | 'warn' | 'error';

export type LogMeta = Record<string, unknown>;

export type Logger = {
  info: (event: string, meta?: LogMeta) => void;
  warn: (event: string, meta?: LogMeta) => void;
  error: (event: string, meta?: LogMeta) => void;
};

function redact(meta: LogMeta = {}): LogMeta {
  const safe: LogMeta = {};
  Object.entries(meta).forEach(([key, value]) => {
    if (/state|trip|people|expenses/i.test(key) && typeof value === 'object') {
      safe[key] = '[redacted]';
    } else if (value instanceof Error) {
      safe[key] = value.message;
    } else {
      safe[key] = value;
    }
  });
  return safe;
}

function write(level: LogLevel, event: string, meta?: LogMeta) {
  const entry = { event, at: new Date().toISOString(), ...redact(meta) };
  if (level === 'error') console.error(entry);
  else if (level === 'warn') console.warn(entry);
  else console.info(entry);
}

export const logger: Logger = {
  info: (event, meta) => write('info', event, meta),
  warn: (event, meta) => write('warn', event, meta),
  error: (event, meta) => write('error', event, meta),
};
