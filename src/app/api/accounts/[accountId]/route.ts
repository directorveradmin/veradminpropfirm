import { NextResponse } from 'next/server';

import type {
  AccountDetailsResponse,
  AccountDetailsRouteResponseBody,
  AccountRouteErrorCode,
} from '../../../../lib/api/contracts';
import {
  createLoggedApiErrorResponse,
  mapOperationalTruthRouteError,
} from '../../../../lib/api/routeErrorResponse';
import { resolveRequestCorrelationId } from '../../../../lib/observability/requestCorrelation';
import { evaluateAccountOperationalTruth } from '../../../../lib/services/operationalTruth/evaluateAccountOperationalTruth';
import { buildSingleAccountAlertsReadModel } from '../../../../lib/services/read-models/alertsReadModel';
import { buildAccountDashboardReadModel } from '../../../../lib/services/read-models/accountDashboardReadModel';

type RouteContext = {
  params:
    | Promise<{
        accountId?: string;
      }>
    | {
        accountId?: string;
      };
};

const ROUTE_PATH = '/api/accounts/[accountId]';
const ROUTE_METHOD = 'GET';

export async function GET(
  request: Request,
  context: RouteContext,
): Promise<NextResponse<AccountDetailsRouteResponseBody>> {
  const startedAt = Date.now();
  const correlationId = resolveRequestCorrelationId(request);
  let accountId: string | undefined;

  try {
    const params = await Promise.resolve(context.params);
    accountId = params.accountId?.trim();

    if (!accountId) {
      return createLoggedApiErrorResponse<AccountRouteErrorCode>({
        status: 400,
        code: 'ACCOUNT_ID_REQUIRED',
        error: 'Account id is required.',
        route: {
          route: ROUTE_PATH,
          method: ROUTE_METHOD,
          durationMs: Date.now() - startedAt,
          correlationId,
        },
        kind: 'validation',
      });
    }

    const result = await evaluateAccountOperationalTruth({
      accountId,
      context: {
        evaluationMode: 'live',
        evaluationTimestamp: new Date().toISOString(),
      },
      requestContext: {
        correlationId,
      },
    });

    const alertsReadModel = buildSingleAccountAlertsReadModel(result);
    const dashboard = buildAccountDashboardReadModel(
      result,
      alertsReadModel.alerts.length,
    );

    const responseBody: AccountDetailsResponse = {
      account: result.account,
      operationalTruth: result.truth,
      alerts: alertsReadModel.alerts,
      summary: dashboard,
    };

    return NextResponse.json<AccountDetailsResponse>(responseBody);
  } catch (error) {
    return mapOperationalTruthRouteError<AccountRouteErrorCode>(error, {
      route: {
        route: ROUTE_PATH,
        method: ROUTE_METHOD,
        accountId,
        durationMs: Date.now() - startedAt,
        correlationId,
      },
      fallback: {
        status: 500,
        code: 'ACCOUNT_DETAILS_LOAD_FAILED',
        error: 'Failed to load account details.',
      },
      accountNotFound: {
        code: 'ACCOUNT_NOT_FOUND',
      },
    });
  }
}