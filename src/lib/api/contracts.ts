import type { ApiErrorResponseBody } from './routeErrorResponse';

type EvaluateAccountOperationalTruthResult = Awaited<
  ReturnType<
    typeof import('../services/operationalTruth/evaluateAccountOperationalTruth').evaluateAccountOperationalTruth
  >
>;

type SingleAccountAlertsReadModel = ReturnType<
  typeof import('../services/read-models/alertsReadModel').buildSingleAccountAlertsReadModel
>;

type FleetStatsReadModel = ReturnType<
  typeof import('../services/read-models/dashboardReadModel').buildDashboardReadModel
>;

type FleetAlertsReadModel = ReturnType<
  typeof import('../services/read-models/alertsReadModel').buildAlertsReadModel
>;

type AccountSummaryReadModel = ReturnType<
  typeof import('../services/read-models/accountDashboardReadModel').buildAccountDashboardReadModel
>;

export type AccountRouteErrorCode =
  | 'ACCOUNT_ID_REQUIRED'
  | 'ACCOUNT_NOT_FOUND'
  | 'ACCOUNT_DETAILS_LOAD_FAILED';

export type FleetStatsRouteErrorCode = 'FLEET_STATS_LOAD_FAILED';

export type FleetAlertsRouteErrorCode = 'FLEET_ALERTS_LOAD_FAILED';

export type AccountDetailsResponse = {
  account: EvaluateAccountOperationalTruthResult['account'];
  operationalTruth: EvaluateAccountOperationalTruthResult['truth'];
  alerts: SingleAccountAlertsReadModel['alerts'];
  summary: AccountSummaryReadModel;
};

export type AccountDetailsErrorResponse =
  ApiErrorResponseBody<AccountRouteErrorCode>;

export type AccountDetailsRouteResponseBody =
  | AccountDetailsResponse
  | AccountDetailsErrorResponse;

export type FleetStatsResponse = FleetStatsReadModel;

export type FleetStatsErrorResponse =
  ApiErrorResponseBody<FleetStatsRouteErrorCode>;

export type FleetStatsRouteResponseBody =
  | FleetStatsResponse
  | FleetStatsErrorResponse;

export type FleetAlertsResponse = FleetAlertsReadModel;

export type FleetAlertsErrorResponse =
  ApiErrorResponseBody<FleetAlertsRouteErrorCode>;

export type FleetAlertsRouteResponseBody =
  | FleetAlertsResponse
  | FleetAlertsErrorResponse;