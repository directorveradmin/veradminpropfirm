import type { CalendarReadModel } from "@/lib/services/read-models";

import { formatDateTime, mapDegradedState, type DegradedStateViewModel } from "./common";

export interface CalendarMarkerViewModel {
  id: string;
  accountLabel: string;
  kind: string;
  title: string;
  startsAt: string;
  endsAt: string;
}

export interface CalendarScreenViewModel {
  rangeSummary: Array<{ label: string; value: string }>;
  laneGroups: Array<{
    label: string;
    markers: CalendarMarkerViewModel[];
  }>;
  degradedState: DegradedStateViewModel | null;
}

export function mapCalendarViewModel(readModel: CalendarReadModel): CalendarScreenViewModel {
  const markers: CalendarMarkerViewModel[] = readModel.stored.rotations.map((rotation) => ({
    id: rotation.id,
    accountLabel: readModel.stored.accountsById[rotation.accountId]?.label ?? rotation.accountId,
    kind: rotation.kind,
    title: rotation.title,
    startsAt: formatDateTime(rotation.startsAt),
    endsAt: formatDateTime(rotation.endsAt),
  }));

  return {
    rangeSummary: [
      { label: "Rotation markers", value: String(readModel.stored.rotations.length) },
      { label: "Payout markers", value: String(readModel.stored.payouts.length) },
      { label: "Timing alerts", value: String(readModel.stored.alerts.length) },
    ],
    laneGroups: [
      {
        label: "All accounts",
        markers,
      },
    ],
    degradedState: mapDegradedState(readModel.degradedState),
  };
}
