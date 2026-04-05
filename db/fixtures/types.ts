import {
  accountDayState,
  accountNotes,
  accountRuleProfileAssignments,
  accounts,
  accountTagLinks,
  alerts,
  auditEvents,
  balanceSnapshots,
  calendarRotations,
  firms,
  fleetSettings,
  importsExportsLog,
  newsEvents,
  payoutRequests,
  refundTasks,
  ruleProfiles,
  ruleProfileVersions,
  tags,
  tradeLogs,
} from '../schema';

type InsertOf<T> = T extends { $inferInsert: infer I } ? I : never;

export interface FixtureManifest {
  fixtureId: string;
  fixtureName: string;
  purpose: string;
  fixtureCategory: 'demo' | 'edge' | 'messy' | 'stress' | 'onboarding' | 'broken';
  version: number;
  schemaCompatibility: string;
  createdAt: string;
  containsProfiles: string[];
  containsAccounts: number;
  containsAlerts: boolean;
  containsPayouts: boolean;
  containsKnownEdges: string[];
  notes: string[];
}

export interface FixturePack {
  manifest: FixtureManifest;
  firms: Array<InsertOf<typeof firms>>;
  ruleProfiles: Array<InsertOf<typeof ruleProfiles>>;
  ruleProfileVersions: Array<InsertOf<typeof ruleProfileVersions>>;
  fleetSettings: Array<InsertOf<typeof fleetSettings>>;
  tags: Array<InsertOf<typeof tags>>;
  accounts: Array<InsertOf<typeof accounts>>;
  accountRuleProfileAssignments: Array<InsertOf<typeof accountRuleProfileAssignments>>;
  accountDayState: Array<InsertOf<typeof accountDayState>>;
  tradeLogs: Array<InsertOf<typeof tradeLogs>>;
  balanceSnapshots: Array<InsertOf<typeof balanceSnapshots>>;
  payoutRequests: Array<InsertOf<typeof payoutRequests>>;
  refundTasks: Array<InsertOf<typeof refundTasks>>;
  newsEvents: Array<InsertOf<typeof newsEvents>>;
  calendarRotations: Array<InsertOf<typeof calendarRotations>>;
  alerts: Array<InsertOf<typeof alerts>>;
  accountNotes: Array<InsertOf<typeof accountNotes>>;
  auditEvents: Array<InsertOf<typeof auditEvents>>;
  accountTagLinks: Array<InsertOf<typeof accountTagLinks>>;
  importsExportsLog: Array<InsertOf<typeof importsExportsLog>>;
}
