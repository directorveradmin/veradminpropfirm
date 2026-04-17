import { simpleCache } from '../../cache/simpleCache';
import {
  accountsRepository,
  type AccountRepositoryRecord,
  type AccountsRepository,
} from '../../db/repositories/accountsRepository';
import { evaluateOperationalTruth } from '../../domain/rules/evaluator';
import type { OperationalTruthInput } from '../../domain/rules/inputTypes';
import type { OperationalTruth } from '../../domain/rules/types';
import type { RequestCorrelationContext } from '../../observability/requestCorrelation';
import {
  logOperationalTruthCacheHit,
  logOperationalTruthCacheMiss,
  logOperationalTruthCacheStore,
  logOperationalTruthServiceFailure,
  logOperationalTruthServiceStart,
  logOperationalTruthServiceSuccess,
  logOperationalTruthStageTransition,
} from '../../observability/operationalTruthLogger';
import {
  assembleOperationalTruthInput,
  type AssembleOperationalTruthInputOptions,
} from './assembleOperationalTruthInput';
import {
  OperationalTruthServiceError,
  isOperationalTruthServiceError,
  safeEvaluateOperationalTruth,
  toSafeEvaluationMode,
  toSafeIsoString,
} from './safeEvaluateOperationalTruth';

export type AccountOperationalTruthResult = {
  evaluatedAt: string;
  account: AccountRepositoryRecord;
  input: OperationalTruthInput;
  truth: OperationalTruth;
};

export type EvaluateAccountOperationalTruthOptions = {
  accountId: string;
  repository?: Pick<AccountsRepository, 'getAccountById'>;
  assembleInput?: (
    options: AssembleOperationalTruthInputOptions,
  ) => OperationalTruthInput;
  evaluate?: (input: OperationalTruthInput) => OperationalTruth;
  context?: OperationalTruthInput['context'];
  requestContext?: RequestCorrelationContext;
};

const ACCOUNT_OPERATIONAL_TRUTH_CACHE_TTL_MS = 5_000;

function toCacheBucket(timestamp: string, ttlMs: number): number {
  const parsedTimestamp = Date.parse(timestamp);

  if (!Number.isFinite(parsedTimestamp)) {
    return 0;
  }

  return Math.floor(parsedTimestamp / ttlMs);
}

function toCacheKeyPart(value: string): string {
  return encodeURIComponent(value.trim());
}

function buildAccountOperationalTruthCacheKey(
  accountId: string,
  evaluationMode: string,
  evaluatedAt: string,
): string {
  return [
    'operational-truth',
    'account',
    toCacheKeyPart(accountId),
    'mode',
    toCacheKeyPart(evaluationMode),
    'bucket',
    String(toCacheBucket(evaluatedAt, ACCOUNT_OPERATIONAL_TRUTH_CACHE_TTL_MS)),
  ].join(':');
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown failure';
}

export async function evaluateAccountOperationalTruth(
  options: EvaluateAccountOperationalTruthOptions,
): Promise<AccountOperationalTruthResult> {
  const serviceStartedAt = Date.now();
  const repository = options.repository ?? accountsRepository;
  const assembleInput = options.assembleInput ?? assembleOperationalTruthInput;
  const evaluate = options.evaluate ?? evaluateOperationalTruth;
  const correlationId = options.requestContext?.correlationId;

  const evaluationMode = toSafeEvaluationMode(options.context?.evaluationMode);
  const evaluatedAt = toSafeIsoString(options.context?.evaluationTimestamp);

  const cacheKey = buildAccountOperationalTruthCacheKey(
    options.accountId,
    evaluationMode,
    evaluatedAt,
  );

  logOperationalTruthServiceStart({
    service: 'evaluateAccountOperationalTruth',
    accountId: options.accountId,
    evaluationMode,
    evaluatedAt,
    cacheKey,
    cacheTtlMs: ACCOUNT_OPERATIONAL_TRUTH_CACHE_TTL_MS,
    correlationId,
  });

  const cached = simpleCache.get<AccountOperationalTruthResult>(cacheKey);

  if (cached !== null) {
    const durationMs = Date.now() - serviceStartedAt;

    logOperationalTruthCacheHit({
      service: 'evaluateAccountOperationalTruth',
      accountId: options.accountId,
      evaluationMode,
      evaluatedAt: cached.evaluatedAt,
      cacheKey,
      cacheTtlMs: ACCOUNT_OPERATIONAL_TRUTH_CACHE_TTL_MS,
      durationMs,
      correlationId,
    });

    logOperationalTruthServiceSuccess({
      service: 'evaluateAccountOperationalTruth',
      accountId: options.accountId,
      evaluationMode,
      evaluatedAt: cached.evaluatedAt,
      cacheKey,
      cacheTtlMs: ACCOUNT_OPERATIONAL_TRUTH_CACHE_TTL_MS,
      durationMs,
      fromCache: true,
      correlationId,
    });

    return cached;
  }

  logOperationalTruthCacheMiss({
    service: 'evaluateAccountOperationalTruth',
    accountId: options.accountId,
    evaluationMode,
    evaluatedAt,
    cacheKey,
    cacheTtlMs: ACCOUNT_OPERATIONAL_TRUTH_CACHE_TTL_MS,
    correlationId,
  });

  try {
    const repositoryStartedAt = Date.now();

    logOperationalTruthStageTransition({
      service: 'evaluateAccountOperationalTruth',
      stage: 'repository',
      phase: 'start',
      accountId: options.accountId,
      evaluationMode,
      evaluatedAt,
      correlationId,
    });

    let account: AccountRepositoryRecord | null | undefined;

    try {
      account = repository.getAccountById(options.accountId);

      logOperationalTruthStageTransition({
        service: 'evaluateAccountOperationalTruth',
        stage: 'repository',
        phase: 'success',
        accountId: options.accountId,
        evaluationMode,
        evaluatedAt,
        durationMs: Date.now() - repositoryStartedAt,
        correlationId,
      });
    } catch (error) {
      logOperationalTruthStageTransition({
        service: 'evaluateAccountOperationalTruth',
        stage: 'repository',
        phase: 'failure',
        accountId: options.accountId,
        evaluationMode,
        evaluatedAt,
        durationMs: Date.now() - repositoryStartedAt,
        correlationId,
      });

      throw new OperationalTruthServiceError(
        `Failed to load account for operational truth evaluation: ${toErrorMessage(
          error,
        )}`,
        {
          code: 'OPERATIONAL_TRUTH_ACCOUNT_LOAD_FAILED',
          stage: 'repository',
          cause: error,
        },
      );
    }

    if (!account) {
      logOperationalTruthStageTransition({
        service: 'evaluateAccountOperationalTruth',
        stage: 'repository',
        phase: 'failure',
        accountId: options.accountId,
        evaluationMode,
        evaluatedAt,
        durationMs: Date.now() - repositoryStartedAt,
        correlationId,
      });

      throw new OperationalTruthServiceError(
        `Account not found: ${options.accountId}`,
        {
          code: 'OPERATIONAL_TRUTH_ACCOUNT_NOT_FOUND',
          stage: 'repository',
        },
      );
    }

    const assemblyStartedAt = Date.now();

    logOperationalTruthStageTransition({
      service: 'evaluateAccountOperationalTruth',
      stage: 'assembly',
      phase: 'start',
      accountId: options.accountId,
      evaluationMode,
      evaluatedAt,
      correlationId,
    });

    let assembledInput: OperationalTruthInput;

    try {
      assembledInput = assembleInput({
        account,
        context: {
          evaluationMode,
          evaluationTimestamp: evaluatedAt,
        },
      });

      logOperationalTruthStageTransition({
        service: 'evaluateAccountOperationalTruth',
        stage: 'assembly',
        phase: 'success',
        accountId: options.accountId,
        evaluationMode,
        evaluatedAt,
        durationMs: Date.now() - assemblyStartedAt,
        correlationId,
      });
    } catch (error) {
      logOperationalTruthStageTransition({
        service: 'evaluateAccountOperationalTruth',
        stage: 'assembly',
        phase: 'failure',
        accountId: options.accountId,
        evaluationMode,
        evaluatedAt,
        durationMs: Date.now() - assemblyStartedAt,
        correlationId,
      });

      throw new OperationalTruthServiceError(
        `Failed to assemble account operational truth input: ${toErrorMessage(
          error,
        )}`,
        {
          code: 'OPERATIONAL_TRUTH_ACCOUNT_ASSEMBLY_FAILED',
          stage: 'assembly',
          cause: error,
        },
      );
    }

    const { input, truth } = safeEvaluateOperationalTruth({
      input: assembledInput,
      evaluate,
      requestContext: options.requestContext,
    });

    const result: AccountOperationalTruthResult = {
      evaluatedAt,
      account,
      input,
      truth,
    };

    simpleCache.set(
      cacheKey,
      result,
      ACCOUNT_OPERATIONAL_TRUTH_CACHE_TTL_MS,
    );

    const durationMs = Date.now() - serviceStartedAt;

    logOperationalTruthCacheStore({
      service: 'evaluateAccountOperationalTruth',
      accountId: options.accountId,
      evaluationMode,
      evaluatedAt,
      cacheKey,
      cacheTtlMs: ACCOUNT_OPERATIONAL_TRUTH_CACHE_TTL_MS,
      durationMs,
      correlationId,
    });

    logOperationalTruthServiceSuccess({
      service: 'evaluateAccountOperationalTruth',
      accountId: options.accountId,
      evaluationMode,
      evaluatedAt,
      cacheKey,
      cacheTtlMs: ACCOUNT_OPERATIONAL_TRUTH_CACHE_TTL_MS,
      durationMs,
      fromCache: false,
      correlationId,
    });

    return result;
  } catch (error) {
    const durationMs = Date.now() - serviceStartedAt;
    const serviceError = isOperationalTruthServiceError(error) ? error : null;

    logOperationalTruthServiceFailure({
      service: 'evaluateAccountOperationalTruth',
      stage: serviceError?.stage ?? 'service',
      accountId: options.accountId,
      evaluationMode,
      evaluatedAt,
      cacheKey,
      cacheTtlMs: ACCOUNT_OPERATIONAL_TRUTH_CACHE_TTL_MS,
      durationMs,
      errorCode: serviceError?.code,
      errorStage: serviceError?.stage,
      error,
      correlationId,
    });

    throw error;
  }
}