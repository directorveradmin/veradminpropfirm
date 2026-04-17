import { NextResponse } from 'next/server';

import {
  logApiRouteFailure,
  type ApiRouteFailureKind,
  type ApiRouteLogContext,
} from '../observability/routeLogger';
import {
  isOperationalTruthServiceError,
  type OperationalTruthServiceError,
} from '../services/operationalTruth/safeEvaluateOperationalTruth';

export type ApiErrorResponseBody<TCode extends string = string> = {
  error: string;
  code: TCode;
};

export type ApiErrorDescriptor<TCode extends string = string> = {
  status: number;
  code: TCode;
  error: string;
};

export type LoggedApiErrorDescriptor<TCode extends string = string> =
  ApiErrorDescriptor<TCode> & {
    route: ApiRouteLogContext;
    kind?: ApiRouteFailureKind;
    cause?: unknown;
  };

export type MapOperationalTruthRouteErrorOptions<
  TCode extends string = string,
> = {
  route: ApiRouteLogContext;
  fallback: ApiErrorDescriptor<TCode>;
  accountNotFound?: {
    code: TCode;
    toErrorMessage?: (error: OperationalTruthServiceError) => string;
  };
};

export function createApiErrorResponse<TCode extends string>(
  descriptor: ApiErrorDescriptor<TCode>,
): NextResponse<ApiErrorResponseBody<TCode>> {
  return NextResponse.json(
    {
      error: descriptor.error,
      code: descriptor.code,
    },
    {
      status: descriptor.status,
    },
  );
}

export function createLoggedApiErrorResponse<TCode extends string>(
  descriptor: LoggedApiErrorDescriptor<TCode>,
): NextResponse<ApiErrorResponseBody<TCode>> {
  logApiRouteFailure({
    route: descriptor.route.route,
    method: descriptor.route.method,
    accountId: descriptor.route.accountId,
    durationMs: descriptor.route.durationMs,
    correlationId: descriptor.route.correlationId,
    status: descriptor.status,
    responseCode: descriptor.code,
    kind: descriptor.kind,
    error: descriptor.cause,
  });

  return createApiErrorResponse({
    status: descriptor.status,
    code: descriptor.code,
    error: descriptor.error,
  });
}

export function mapOperationalTruthRouteError<TCode extends string>(
  error: unknown,
  options: MapOperationalTruthRouteErrorOptions<TCode>,
): NextResponse<ApiErrorResponseBody<TCode>> {
  if (
    isOperationalTruthServiceError(error) &&
    error.code === 'OPERATIONAL_TRUTH_ACCOUNT_NOT_FOUND' &&
    options.accountNotFound
  ) {
    return createLoggedApiErrorResponse({
      status: 404,
      code: options.accountNotFound.code,
      error: options.accountNotFound.toErrorMessage?.(error) ?? error.message,
      route: options.route,
      kind: 'not_found',
      cause: error,
    });
  }

  return createLoggedApiErrorResponse({
    status: options.fallback.status,
    code: options.fallback.code,
    error: options.fallback.error,
    route: options.route,
    kind: 'failure',
    cause: error,
  });
}