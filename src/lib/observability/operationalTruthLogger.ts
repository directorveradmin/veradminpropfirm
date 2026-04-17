import { createLogger, serializeError, type LogContext } from './logger';

import type { OperationalTruthErrorStage } from '../services/operationalTruth/safeEvaluateOperationalTruth';

export type OperationalTruthServiceName =
  | 'evaluateAccountOperationalTruth'
  | 'evaluateFleetOperationalTruth'
  | 'safeEvaluateOperationalTruth';

export type OperationalTruthStageName =
  | 'service'
  | 'cache'
  | 'normalization'
  | 'repository'
  | 'assembly'
  | 'evaluation';

export type OperationalTruthStagePhase = 'start' | 'success' | 'failure';

export type OperationalTruthLogContext = {
  service: OperationalTruthServiceName;
  stage: OperationalTruthStageName;
  accountId?: string;
  accountCount?: number;
  evaluationMode?: string;
  evaluatedAt?: string;
  cacheKey?: string;
  cacheTtlMs?: number;
  durationMs?: number;
  fromCache?: boolean;
  correlationId?: string;
};

export type OperationalTruthFailureLogContext = OperationalTruthLogContext & {
  error: unknown;
  errorCode?: string;
  errorStage?: OperationalTruthErrorStage;
};

const logger = createLogger('operationalTruth');

function buildContext(
  context: OperationalTruthLogContext,
  extras?: LogContext,
): LogContext {
  const result: LogContext = {
    service: context.service,
    stage: context.stage,
  };

  if (context.accountId !== undefined) {
    result.accountId = context.accountId;
  }

  if (context.accountCount !== undefined) {
    result.accountCount = context.accountCount;
  }

  if (context.evaluationMode !== undefined) {
    result.evaluationMode = context.evaluationMode;
  }

  if (context.evaluatedAt !== undefined) {
    result.evaluatedAt = context.evaluatedAt;
  }

  if (context.cacheKey !== undefined) {
    result.cacheKey = context.cacheKey;
  }

  if (context.cacheTtlMs !== undefined) {
    result.cacheTtlMs = context.cacheTtlMs;
  }

  if (context.durationMs !== undefined) {
    result.durationMs = context.durationMs;
  }

  if (context.fromCache !== undefined) {
    result.fromCache = context.fromCache;
  }

  if (context.correlationId !== undefined) {
    result.correlationId = context.correlationId;
  }

  if (extras) {
    Object.assign(result, extras);
  }

  return result;
}

export function logOperationalTruthServiceStart(
  context: Omit<OperationalTruthLogContext, 'stage'>,
): void {
  logger.debug(
    'service.start',
    buildContext({
      ...context,
      stage: 'service',
    }),
  );
}

export function logOperationalTruthServiceSuccess(
  context: Omit<OperationalTruthLogContext, 'stage'>,
): void {
  logger.debug(
    'service.success',
    buildContext({
      ...context,
      stage: 'service',
    }),
  );
}

export function logOperationalTruthCacheHit(
  context: Omit<OperationalTruthLogContext, 'stage'>,
): void {
  logger.debug(
    'cache.hit',
    buildContext({
      ...context,
      stage: 'cache',
      fromCache: true,
    }),
  );
}

export function logOperationalTruthCacheMiss(
  context: Omit<OperationalTruthLogContext, 'stage'>,
): void {
  logger.debug(
    'cache.miss',
    buildContext({
      ...context,
      stage: 'cache',
      fromCache: false,
    }),
  );
}

export function logOperationalTruthCacheStore(
  context: Omit<OperationalTruthLogContext, 'stage'>,
): void {
  logger.debug(
    'cache.store',
    buildContext({
      ...context,
      stage: 'cache',
      fromCache: false,
    }),
  );
}

export function logOperationalTruthStageTransition(
  context: OperationalTruthLogContext & {
    phase: OperationalTruthStagePhase;
  },
): void {
  logger.debug(
    `stage.${context.stage}.${context.phase}`,
    buildContext(context, {
      phase: context.phase,
    }),
  );
}

export function logOperationalTruthServiceFailure(
  context: OperationalTruthFailureLogContext,
): void {
  logger.error(
    'service.failure',
    buildContext(context, {
      errorCode: context.errorCode,
      errorStage: context.errorStage,
      error: serializeError(context.error),
    }),
  );
}