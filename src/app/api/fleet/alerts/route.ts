import { NextResponse } from 'next/server';

import type {
  FleetAlertsResponse,
  FleetAlertsRouteErrorCode,
  FleetAlertsRouteResponseBody,
} from '../../../../lib/api/contracts';
import { mapOperationalTruthRouteError } from '../../../../lib/api/routeErrorResponse';
import { resolveRequestCorrelationId } from '../../../../lib/observability/requestCorrelation';
import { evaluateFleetOperationalTruth } from '../../../../lib/services/operationalTruth/evaluateFleetOperationalTruth';
import { buildAlertsReadModel } from '../../../../lib/services/read-models/alertsReadModel';

const ROUTE_PATH = '/api/fleet/alerts';
const ROUTE_METHOD = 'GET';

export async function GET(
  request: Request,
): Promise<NextResponse<FleetAlertsRouteResponseBody>> {
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

    const readModel = buildAlertsReadModel(fleetTruth);

    return NextResponse.json<FleetAlertsResponse>(readModel);
  } catch (error) {
    return mapOperationalTruthRouteError<FleetAlertsRouteErrorCode>(error, {
      route: {
        route: ROUTE_PATH,
        method: ROUTE_METHOD,
        durationMs: Date.now() - startedAt,
        correlationId,
      },
      fallback: {
        status: 500,
        code: 'FLEET_ALERTS_LOAD_FAILED',
        error: 'Failed to load fleet alerts.',
      },
    });
  }
}