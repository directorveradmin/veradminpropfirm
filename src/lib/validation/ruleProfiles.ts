import { z } from 'zod';

const stageTypeValues = ['evaluation', 'funded', 'live', 'retired'] as const;
const accountClassValues = [
  'evaluation_standard',
  'funded_standard',
  'funded_static',
  'funded_trailing',
] as const;
const drawdownTypeValues = ['static', 'trailing'] as const;
const moneyModeValues = ['absolute', 'percent'] as const;

const moneyRuleSchema = z.object({
  mode: z.enum(moneyModeValues),
  value: z.number().nonnegative(),
  referenceBasis: z.string().min(1),
});

const dailyDrawdownSchema = z.object({
  enabled: z.boolean(),
  mode: z.enum(moneyModeValues),
  value: z.number().nonnegative(),
  referenceBasis: z.string().min(1),
  resetBehavior: z.string().min(1),
});

const requestWindowSchema = z.object({
  type: z.string().min(1),
  value: z.union([z.number().nonnegative(), z.string().min(1)]),
});

const consistencyRulesSchema = z.object({
  enabled: z.boolean(),
  capMode: z.string().nullable().optional(),
  capValue: z.number().nullable().optional(),
  basisType: z.string().nullable().optional(),
  rollingWindowSize: z.number().int().positive().nullable().optional(),
});

export const ruleProfilePayloadSchema = z.object({
  metadata: z.object({
    profileKey: z.string().min(1),
    displayName: z.string().min(1),
    firmLabel: z.string().min(1),
    stageType: z.enum(stageTypeValues),
    accountClass: z.enum(accountClassValues),
  }),
  drawdownRules: z.object({
    drawdownType: z.enum(drawdownTypeValues),
    maxDrawdown: moneyRuleSchema,
    dailyDrawdown: dailyDrawdownSchema,
  }),
  stageTargetRules: z.object({
    profitTarget: z.object({
      enabled: z.boolean(),
      mode: z.enum(moneyModeValues),
      value: z.number().nonnegative(),
    }),
  }),
  tradingDayRules: z.object({
    minimumTradingDaysEnabled: z.boolean(),
    minimumTradingDays: z.number().int().nonnegative(),
    qualifyingDayDefinition: z.string().min(1),
  }),
  payoutRules: z.object({
    payoutEligibilityEnabled: z.boolean(),
    waitingPeriodDays: z.number().int().nonnegative(),
    payoutCadenceDays: z.number().int().nonnegative(),
    requestWindows: z.array(requestWindowSchema),
    payoutBlockers: z.array(z.string()),
    payoutProtectionRelevant: z.boolean(),
  }),
  consistencyRules: consistencyRulesSchema,
  rotationEligibility: z.object({
    fundedRotationEligible: z.boolean(),
    cooldownCompatible: z.boolean(),
  }),
  specialRestrictions: z.object({
    weekendRestriction: z.boolean(),
    firmDefinedNewsRestriction: z.boolean(),
    notes: z.array(z.string()),
  }),
});

export const operatorOverlayCompatibilitySchema = z.object({
  allowCustomPreservationThreshold: z.boolean(),
  allowNewsAvoidanceOverlay: z.boolean(),
  allowRestRhythmOverlay: z.boolean(),
  allowAlertPriorityTuning: z.boolean(),
});

export const normalizedSummarySchema = z.object({
  drawdownType: z.string().min(1),
  maxDrawdownDefinition: z.string().min(1),
  dailyDrawdownDefinition: z.string().min(1),
  payoutPolicyType: z.string().min(1),
  targetPolicyType: z.string().min(1),
  consistencyPolicyType: z.string().min(1),
  tradingDayPolicyType: z.string().min(1),
  rotationEligible: z.boolean(),
  overlayAllowed: z.boolean(),
});

export const ruleProfileVersionCreateSchema = z.object({
  id: z.string().min(1),
  ruleProfileId: z.string().min(1),
  versionNumber: z.number().int().positive(),
  versionLabel: z.string().min(1),
  isActive: z.boolean(),
  effectiveFrom: z.string().date(),
  effectiveTo: z.string().date().nullable().optional(),
  supersedesVersionId: z.string().nullable().optional(),
  firmRulesJson: z.string().transform((value, ctx) => {
    try {
      const parsed = JSON.parse(value);
      ruleProfilePayloadSchema.parse(parsed);
      return value;
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid firmRulesJson: ${String(error)}`,
      });
      return z.NEVER;
    }
  }),
  operatorOverlayCompatibilityJson: z.string().transform((value, ctx) => {
    try {
      const parsed = JSON.parse(value);
      operatorOverlayCompatibilitySchema.parse(parsed);
      return value;
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid operatorOverlayCompatibilityJson: ${String(error)}`,
      });
      return z.NEVER;
    }
  }),
  normalizedSummaryJson: z.string().nullable().optional().transform((value, ctx) => {
    if (value === null || value === undefined) {
      return value;
    }

    try {
      const parsed = JSON.parse(value);
      normalizedSummarySchema.parse(parsed);
      return value;
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid normalizedSummaryJson: ${String(error)}`,
      });
      return z.NEVER;
    }
  }),
  notes: z.string().nullable().optional(),
});
