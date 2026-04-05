import type { JournalReadModel } from "@/lib/services/read-models";

import { formatDateTime, mapDegradedState, type DegradedStateViewModel } from "./common";

export interface JournalEventRowViewModel {
  id: string;
  createdAt: string;
  accountLabel: string;
  eventType: string;
  summary: string;
  source: string;
  importance: string;
}

export interface JournalScreenViewModel {
  summaryStrip: Array<{ label: string; value: string }>;
  events: JournalEventRowViewModel[];
  selectedEvent: JournalEventRowViewModel | null;
  degradedState: DegradedStateViewModel | null;
}

export function mapJournalViewModel(readModel: JournalReadModel): JournalScreenViewModel {
  const events = readModel.stored.events.map((event) => ({
    id: event.id,
    createdAt: formatDateTime(event.createdAt),
    accountLabel:
      event.accountId && readModel.stored.accountsById[event.accountId]
        ? readModel.stored.accountsById[event.accountId].label
        : "System",
    eventType: event.eventType,
    summary: event.summary,
    source: event.source,
    importance: event.importance,
  }));

  return {
    summaryStrip: [
      { label: "Events", value: String(events.length) },
      {
        label: "Accounts in scope",
        value: String(new Set(events.map((event) => event.accountLabel)).size),
      },
    ],
    events,
    selectedEvent: events[0] ?? null,
    degradedState: mapDegradedState(readModel.degradedState),
  };
}
