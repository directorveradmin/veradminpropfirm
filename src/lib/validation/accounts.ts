import { z } from 'zod';

const lifecycleStageValues = [
  'draft',
  'evaluation_step1',
  'evaluation_step2',
  'funded_active',
  'funded_payout_active',
  'paused_inactive',
  'breached_failed',
  'retired_archived',
] as const;

const accountStatusValues = ['active', 'paused', 'stopped', 'breached', 'archived'] as const;
const noteTypeValues = ['general', 'risk', 'payout', 'admin', 'system'] as const;
const tradeSessionValues = ['asia', 'london', 'new_york', 'custom'] as const;
const tradeDirectionValues = ['long', 'short', 'both', 'n_a'] as const;
const tradeResultTypeValues = ['win', 'loss', 'custom'] as const;

export const accountCreateSchema = z.object({
  id: z.string().min(1),
  firmId: z.string().min(1),
  currentRuleProfileId: z.string().min(1),
  currentRuleProfileVersionId: z.string().min(1),
  accountLabel: z.string().min(1),
  externalAccountRef: z.string().min(1).nullable().optional(),
  lifecycleStage: z.enum(lifecycleStageValues),
  accountStatus: z.enum(accountStatusValues),
  startingBalanceCents: z.number().int().positive(),
  currentBalanceCents: z.number().int().nonnegative(),
  peakBalanceCents: z.number().int().nonnegative(),
  daysTradedReference: z.number().int().nonnegative().nullable().optional(),
  lastPayoutDate: z.string().date().nullable().optional(),
  feeRefunded: z.boolean().default(false),
  manuallyPaused: z.boolean().default(false),
  archivedAt: z.string().datetime().nullable().optional(),
  breachedAt: z.string().datetime().nullable().optional(),
  notesSummary: z.string().nullable().optional(),
});

export const accountNoteSchema = z.object({
  accountId: z.string().min(1),
  noteType: z.enum(noteTypeValues),
  body: z.string().min(1),
});

export const tradeLogInputSchema = z.object({
  accountId: z.string().min(1),
  tradingTimestamp: z.string().datetime(),
  tradeDate: z.string().date(),
  session: z.enum(tradeSessionValues),
  direction: z.enum(tradeDirectionValues),
  resultType: z.enum(tradeResultTypeValues),
  points: z.number().nullable().optional(),
  pnlAmountCents: z.number().int(),
  riskUnitFraction: z.number().nonnegative().nullable().optional(),
  wasRuleFollowing: z.boolean().default(true),
  wasNearNews: z.boolean().default(false),
  setupTagId: z.string().nullable().optional(),
  screenshotPath: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
});
