import { NextResponse } from 'next/server';

import type {
  FleetStatsResponse,
  FleetStatsRouteErrorCode,
  FleetStatsRouteResponseBody,
} from '../../../../lib/api/contracts';
import { mapOperationalTruthRouteError } from '../../../../lib/api/routeErrorResponse';
import { resolveRequestCorrelationId } from '../../../../lib/observability/requestCorrelation';
import { evaluateFleetOperationalTruth } from '../../../../lib/services/operationalTruth/evaluateFleetOperationalTruth';
import { buildDashboardReadModel } from '../../../../lib/services/read-models/dashboardReadModel';

const ROUTE_PATH = '/api/fleet/stats';
const ROUTE_METHOD = 'GET';

export async function GET(
  request: Request,
): Promise<NextResponse<FleetStatsRouteResponseBody>> {
  const startedAt = Date.now();
  const correlationId = resolveRequestCorrelationId(request);

  try {
    const fleetTruth = await evaluateFleetOperationalTruth({
      context: {
        evaluationMode: 'live',
        evaluationTimestamp: new Date().toISOString(),
      },
      requestContext: {
        correlationId,
      },
    });

    const readModel = buildDashboardReadModel(fleetTruth);

    return NextResponse.json<FleetStatsResponse>(readModel);
  } catch (error) {
    return mapOperationalTruthRouteError<FleetStatsRouteErrorCode>(error, {
      route: {
        route: ROUTE_PATH,
        method: ROUTE_METHOD,
        durationMs: Date.now() - startedAt,
        correlationId,
      },
      fallback: {
        status: 500,
        code: 'FLEET_STATS_LOAD_FAILED',
        error: 'Failed to load fleet stats.',
      },
    });
  }
}