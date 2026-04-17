export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export type LogContext = Record<string, unknown>;

export type LogRecord = {
  timestamp: string;
  level: Exclude<LogLevel, 'silent'>;
  namespace: string;
  event: string;
  context?: LogContext;
};

export type Logger = {
  debug(event: string, context?: LogContext): void;
  info(event: string, context?: LogContext): void;
  warn(event: string, context?: LogContext): void;
  error(event: string, context?: LogContext): void;
};

export type CreateLoggerOptions = {
  minLevel?: LogLevel;
};

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 50,
};

function normalizeLogLevel(value?: string | null): LogLevel {
  switch ((value ?? '').toLowerCase()) {
    case 'debug':
      return 'debug';
    case 'info':
      return 'info';
    case 'warn':
      return 'warn';
    case 'error':
      return 'error';
    case 'silent':
      return 'silent';
    default:
      return 'error';
  }
}

function getDefaultLogLevel(): LogLevel {
  const configured = process.env.VERADMIN_LOG_LEVEL;

  if (configured) {
    return normalizeLogLevel(configured);
  }

  if (process.env.NODE_ENV === 'test') {
    return 'silent';
  }

  return 'error';
}

function shouldLog(
  level: Exclude<LogLevel, 'silent'>,
  minLevel: LogLevel,
): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[minLevel];
}

export function serializeError(
  error: unknown,
  seen: WeakSet<object> = new WeakSet(),
): Record<string, unknown> {
  if (!(error instanceof Error)) {
    return {
      message: String(error),
    };
  }

  if (seen.has(error)) {
    return {
      name: error.name,
      message: error.message,
      circular: true,
    };
  }

  seen.add(error);

  const serialized: Record<string, unknown> = {
    name: error.name,
    message: error.message,
  };

  if (error.stack) {
    serialized.stack = error.stack;
  }

  const code = (error as { code?: unknown }).code;
  if (code !== undefined) {
    serialized.code = toSerializableValue(code, seen);
  }

  const stage = (error as { stage?: unknown }).stage;
  if (stage !== undefined) {
    serialized.stage = toSerializableValue(stage, seen);
  }

  const cause = (error as { cause?: unknown }).cause;
  if (cause !== undefined) {
    serialized.cause = toSerializableValue(cause, seen);
  }

  return serialized;
}

function toSerializableValue(
  value: unknown,
  seen: WeakSet<object> = new WeakSet(),
): unknown {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return serializeError(value, seen);
  }

  if (Array.isArray(value)) {
    return value.map((item) => toSerializableValue(item, seen));
  }

  if (typeof value === 'object') {
    if (seen.has(value)) {
      return '[Circular]';
    }

    seen.add(value);

    const normalized: Record<string, unknown> = {};

    for (const [key, entryValue] of Object.entries(
      value as Record<string, unknown>,
    )) {
      normalized[key] = toSerializableValue(entryValue, seen);
    }

    return normalized;
  }

  return String(value);
}

export function sanitizeLogContext(context?: LogContext): LogContext | undefined {
  if (!context) {
    return undefined;
  }

  const sanitized = toSerializableValue(context);

  if (
    sanitized &&
    typeof sanitized === 'object' &&
    !Array.isArray(sanitized)
  ) {
    return sanitized as LogContext;
  }

  return {
    value: sanitized,
  };
}

function getConsoleMethod(level: Exclude<LogLevel, 'silent'>) {
  switch (level) {
    case 'debug':
      return typeof console.debug === 'function'
        ? console.debug.bind(console)
        : console.log.bind(console);
    case 'info':
      return typeof console.info === 'function'
        ? console.info.bind(console)
        : console.log.bind(console);
    case 'warn':
      return console.warn.bind(console);
    case 'error':
      return console.error.bind(console);
  }
}

export function createLogger(
  namespace: string,
  options: CreateLoggerOptions = {},
): Logger {
  const minLevel = options.minLevel ?? getDefaultLogLevel();

  function emit(
    level: Exclude<LogLevel, 'silent'>,
    event: string,
    context?: LogContext,
  ): void {
    if (!shouldLog(level, minLevel)) {
      return;
    }

    const record: LogRecord = {
      timestamp: new Date().toISOString(),
      level,
      namespace,
      event,
    };

    const sanitizedContext = sanitizeLogContext(context);

    if (sanitizedContext && Object.keys(sanitizedContext).length > 0) {
      record.context = sanitizedContext;
    }

    const write = getConsoleMethod(level);
    write(record);
  }

  return {
    debug(event, context) {
      emit('debug', event, context);
    },
    info(event, context) {
      emit('info', event, context);
    },
    warn(event, context) {
      emit('warn', event, context);
    },
    error(event, context) {
      emit('error', event, context);
    },
  };
}