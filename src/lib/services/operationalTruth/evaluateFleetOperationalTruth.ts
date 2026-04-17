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

export type FleetOperationalTruthRecord = {
  account: AccountRepositoryRecord;
  input: OperationalTruthInput;
  truth: OperationalTruth;
};

export type FleetOperationalTruthResult = {
  evaluatedAt: string;
  accounts: FleetOperationalTruthRecord[];
};

export type EvaluateFleetOperationalTruthOptions = {
  repository?: Pick<AccountsRepository, 'listAccountsForFleetStats'>;
  assembleInput?: (
    options: AssembleOperationalTruthInputOptions,
  ) => OperationalTruthInput;
  evaluate?: (input: OperationalTruthInput) => OperationalTruth;
  context?: OperationalTruthInput['context'];
  requestContext?: RequestCorrelationContext;
};

const FLEET_OPERATIONAL_TRUTH_CACHE_TTL_MS = 5_000;

function toCacheBucket(timestamp: string, ttlMs: number): number {
  const parsedTimestamp = Date.parse(timestamp);

  if (!Number.isFinite(parsedTimestamp)) {
    return 0;
  }

  return Math.floor(parsedTimestamp / ttlMs);
}

function buildFleetOperationalTruthCacheKey(
  evaluationMode: string,
  evaluatedAt: string,
): string {
  return [
    'operational-truth',
    'fleet',
    'mode',
    encodeURIComponent(evaluationMode),
    'bucket',
    String(toCacheBucket(evaluatedAt, FLEET_OPERATIONAL_TRUTH_CACHE_TTL_MS)),
  ].join(':');
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown failure';
}

export async function evaluateFleetOperationalTruth(
  options: EvaluateFleetOperationalTruthOptions = {},
): Promise<FleetOperationalTruthResult> {
  const serviceStartedAt = Date.now();
  const repository = options.repository ?? accountsRepository;
  const assembleInput = options.assembleInput ?? assembleOperationalTruthInput;
  const evaluate = options.evaluate ?? evaluateOperationalTruth;
  const correlationId = options.requestContext?.correlationId;

  const evaluationMode = toSafeEvaluationMode(options.context?.evaluationMode);
  const evaluatedAt = toSafeIsoString(options.context?.evaluationTimestamp);

  const cacheKey = buildFleetOperationalTruthCacheKey(
    evaluationMode,
    evaluatedAt,
  );

  logOperationalTruthServiceStart({
    service: 'evaluateFleetOperationalTruth',
    evaluationMode,
    evaluatedAt,
    cacheKey,
    cacheTtlMs: FLEET_OPERATIONAL_TRUTH_CACHE_TTL_MS,
    correlationId,
  });

  const cached = simpleCache.get<FleetOperationalTruthResult>(cacheKey);

  if (cached !== null) {
    const durationMs = Date.now() - serviceStartedAt;

    logOperationalTruthCacheHit({
      service: 'evaluateFleetOperationalTruth',
      evaluationMode,
      evaluatedAt: cached.evaluatedAt,
      cacheKey,
      cacheTtlMs: FLEET_OPERATIONAL_TRUTH_CACHE_TTL_MS,
      durationMs,
      accountCount: cached.accounts.length,
      correlationId,
    });

    logOperationalTruthServiceSuccess({
      service: 'evaluateFleetOperationalTruth',
      evaluationMode,
      evaluatedAt: cached.evaluatedAt,
      cacheKey,
      cacheTtlMs: FLEET_OPERATIONAL_TRUTH_CACHE_TTL_MS,
      durationMs,
      fromCache: true,
      accountCount: cached.accounts.length,
      correlationId,
    });

    return cached;
  }

  logOperationalTruthCacheMiss({
    service: 'evaluateFleetOperationalTruth',
    evaluationMode,
    evaluatedAt,
    cacheKey,
    cacheTtlMs: FLEET_OPERATIONAL_TRUTH_CACHE_TTL_MS,
    correlationId,
  });

  try {
    const repositoryStartedAt = Date.now();

    logOperationalTruthStageTransition({
      service: 'evaluateFleetOperationalTruth',
      stage: 'repository',
      phase: 'start',
      evaluationMode,
      evaluatedAt,
      correlationId,
    });

    let accounts: AccountRepositoryRecord[];

    try {
      accounts = repository.listAccountsForFleetStats();

      logOperationalTruthStageTransition({
        service: 'evaluateFleetOperationalTruth',
        stage: 'repository',
        phase: 'success',
        evaluationMode,
        evaluatedAt,
        durationMs: Date.now() - repositoryStartedAt,
        accountCount: accounts.length,
        correlationId,
      });
    } catch (error) {
      logOperationalTruthStageTransition({
        service: 'evaluateFleetOperationalTruth',
        stage: 'repository',
        phase: 'failure',
        evaluationMode,
        evaluatedAt,
        durationMs: Date.now() - repositoryStartedAt,
        correlationId,
      });

      throw new OperationalTruthServiceError(
        `Failed to load fleet accounts for operational truth evaluation: ${toErrorMessage(
          error,
        )}`,
        {
          code: 'OPERATIONAL_TRUTH_FLEET_LOAD_FAILED',
          stage: 'repository',
          cause: error,
        },
      );
    }

    const records: FleetOperationalTruthRecord[] = accounts.map((account) => {
      const assemblyStartedAt = Date.now();

      logOperationalTruthStageTransition({
        service: 'evaluateFleetOperationalTruth',
        stage: 'assembly',
        phase: 'start',
        accountId: account.id,
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
          service: 'evaluateFleetOperationalTruth',
          stage: 'assembly',
          phase: 'success',
          accountId: account.id,
          evaluationMode,
          evaluatedAt,
          durationMs: Date.now() - assemblyStartedAt,
          correlationId,
        });
      } catch (error) {
        logOperationalTruthStageTransition({
          service: 'evaluateFleetOperationalTruth',
          stage: 'assembly',
          phase: 'failure',
          accountId: account.id,
          evaluationMode,
          evaluatedAt,
          durationMs: Date.now() - assemblyStartedAt,
          correlationId,
        });

        throw new OperationalTruthServiceError(
          `Failed to assemble fleet operational truth input for account ${account.id}: ${toErrorMessage(
            error,
          )}`,
          {
            code: 'OPERATIONAL_TRUTH_FLEET_ASSEMBLY_FAILED',
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

      return {
        account,
        input,
        truth,
      };
    });

    const result: FleetOperationalTruthResult = {
      evaluatedAt,
      accounts: records,
    };

    simpleCache.set(
      cacheKey,
      result,
      FLEET_OPERATIONAL_TRUTH_CACHE_TTL_MS,
    );

    const durationMs = Date.now() - serviceStartedAt;

    logOperationalTruthCacheStore({
      service: 'evaluateFleetOperationalTruth',
      evaluationMode,
      evaluatedAt,
      cacheKey,
      cacheTtlMs: FLEET_OPERATIONAL_TRUTH_CACHE_TTL_MS,
      durationMs,
      accountCount: records.length,
      correlationId,
    });

    logOperationalTruthServiceSuccess({
      service: 'evaluateFleetOperationalTruth',
      evaluationMode,
      evaluatedAt,
      cacheKey,
      cacheTtlMs: FLEET_OPERATIONAL_TRUTH_CACHE_TTL_MS,
      durationMs,
      fromCache: false,
      accountCount: records.length,
      correlationId,
    });

    return result;
  } catch (error) {
    const durationMs = Date.now() - serviceStartedAt;
    const serviceError = isOperationalTruthServiceError(error) ? error : null;

    logOperationalTruthServiceFailure({
      service: 'evaluateFleetOperationalTruth',
      stage: serviceError?.stage ?? 'service',
      evaluationMode,
      evaluatedAt,
      cacheKey,
      cacheTtlMs: FLEET_OPERATIONAL_TRUTH_CACHE_TTL_MS,
      durationMs,
      errorCode: serviceError?.code,
      errorStage: serviceError?.stage,
      error,
      correlationId,
    });

    throw error;
  }
}