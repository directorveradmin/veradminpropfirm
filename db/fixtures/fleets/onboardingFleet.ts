export const onboardingFleetFixture = {
  manifest: {
    fixtureId: "onboarding_fleet_v1",
    fixtureName: "Onboarding Fleet v1",
    purpose: "Educational example fleet for first-run learning and calm product understanding.",
    fixtureCategory: "onboarding",
    version: 1,
    schemaCompatibility: "step3-foundation-v1",
    createdAt: "2026-04-10",
    containsProfiles: ["funded_trailing_v1", "eval_static_target_v1", "funded_consistency_v1"],
    containsAccounts: 5,
    containsAlerts: true,
    containsPayouts: true,
    containsKnownEdges: [
      "payout_ready_example",
      "preservation_sensitive_example",
      "restricted_or_stopped_example",
      "rotation_example"
    ],
    notes: [
      "Load this fleet only when the operator explicitly wants guided first-run understanding.",
      "This pack is educational and compact rather than exhaustive."
    ]
  },
  firms: [],
  ruleProfiles: [],
  ruleProfileVersions: [],
  fleetSettings: [],
  tags: [],
  accounts: [
    {
      id: "acct_onb_alpha_tradable",
      accountLabel: "ONB-ALPHA-TRADABLE",
      lifecycleStage: "funded_active",
      accountStatus: "active",
      notesSummary: "Healthy tradable example account."
    },
    {
      id: "acct_onb_alpha_preservation",
      accountLabel: "ONB-ALPHA-PRESERVATION",
      lifecycleStage: "funded_active",
      accountStatus: "active",
      notesSummary: "Preservation-sensitive example account."
    },
    {
      id: "acct_onb_beta_payout",
      accountLabel: "ONB-BETA-PAYOUT",
      lifecycleStage: "funded_payout_active",
      accountStatus: "active",
      notesSummary: "Payout-ready example account."
    },
    {
      id: "acct_onb_beta_stopped",
      accountLabel: "ONB-BETA-STOPPED",
      lifecycleStage: "paused_inactive",
      accountStatus: "paused",
      notesSummary: "Stopped or restricted example account."
    },
    {
      id: "acct_onb_beta_rotation",
      accountLabel: "ONB-BETA-ROTATION",
      lifecycleStage: "evaluation_step1",
      accountStatus: "active",
      notesSummary: "Rotation and future-rhythm example account."
    }
  ],
  accountRuleProfileAssignments: [],
  accountDayState: [],
  tradeLogs: [],
  balanceSnapshots: [],
  payoutRequests: [
    {
      id: "payout_onb_beta_payout",
      accountId: "acct_onb_beta_payout",
      status: "planned"
    }
  ],
  refundTasks: [],
  newsEvents: [],
  calendarRotations: [
    {
      id: "rotation_onb_beta_rotation",
      accountId: "acct_onb_beta_rotation",
      rotationType: "funded_rest_window",
      state: "planned"
    }
  ],
  alerts: [
    {
      id: "alert_onb_beta_payout",
      accountId: "acct_onb_beta_payout",
      severity: "medium",
      status: "active",
      title: "Payout window approaching"
    },
    {
      id: "alert_onb_beta_stopped",
      accountId: "acct_onb_beta_stopped",
      severity: "high",
      status: "active",
      title: "Restricted account is paused"
    }
  ],
  accountNotes: [],
  auditEvents: [],
  accountTagLinks: [],
  importsExportsLog: []
};