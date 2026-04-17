import { createLogger, serializeError, type LogContext } from './logger';

export type ApiRouteFailureKind = 'validation' | 'not_found' | 'failure';

export type ApiRouteLogContext = {
  route: string;
  method: string;
  accountId?: string;
  durationMs?: number;
  correlationId?: string;
};

export type ApiRouteFailureLogContext = ApiRouteLogContext & {
  status: number;
  responseCode: string;
  kind?: ApiRouteFailureKind;
  error?: unknown;
};

type OperationalTruthServiceErrorLike = Error & {
  code: string;
  stage: string;
};

const logger = createLogger('apiRoute');

function isOperationalTruthServiceErrorLike(
  error: unknown,
): error is OperationalTruthServiceErrorLike {
  if (!(error instanceof Error)) {
    return false;
  }

  const candidate = error as Partial<OperationalTruthServiceErrorLike>;

  return (
    candidate.name === 'OperationalTruthServiceError' &&
    typeof candidate.code === 'string' &&
    typeof candidate.stage === 'string'
  );
}

function resolveFailureKind(
  context: ApiRouteFailureLogContext,
): ApiRouteFailureKind {
  if (context.kind) {
    return context.kind;
  }

  if (context.status === 404) {
    return 'not_found';
  }

  if (context.status >= 400 && context.status < 500) {
    return 'validation';
  }

  return 'failure';
}

function resolveFailureEvent(kind: ApiRouteFailureKind): string {
  switch (kind) {
    case 'validation':
      return 'request.validation_failed';
    case 'not_found':
      return 'request.not_found';
    default:
      return 'request.failed';
  }
}

function buildServiceErrorContext(
  error: OperationalTruthServiceErrorLike,
): LogContext {
  return {
    serviceErrorCode: error.code,
    serviceErrorStage: error.stage,
  };
}

function buildContext(
  context: ApiRouteFailureLogContext,
  kind: ApiRouteFailureKind,
  extras?: LogContext,
): LogContext {
  const result: LogContext = {
    route: context.route,
    method: context.method,
    status: context.status,
    responseCode: context.responseCode,
    failureKind: kind,
  };

  if (context.accountId !== undefined) {
    result.accountId = context.accountId;
  }

  if (context.durationMs !== undefined) {
    result.durationMs = context.durationMs;
  }

  if (context.correlationId !== undefined) {
    result.correlationId = context.correlationId;
  }

  if (extras) {
    Object.assign(result, extras);
  }

  return result;
}

export function logApiRouteFailure(
  context: ApiRouteFailureLogContext,
): void {
  const kind = resolveFailureKind(context);
  const event = resolveFailureEvent(kind);
  const extras: LogContext = {};

  if (isOperationalTruthServiceErrorLike(context.error)) {
    Object.assign(extras, buildServiceErrorContext(context.error));
  }

  if (context.error !== undefined) {
    extras.error = serializeError(context.error);
  }

  const payload = buildContext(context, kind, extras);

  if (context.status >= 500) {
    logger.error(event, payload);
    return;
  }

  logger.warn(event, payload);
}