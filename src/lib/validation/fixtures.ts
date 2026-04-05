import { z } from 'zod';

export const fixtureManifestSchema = z.object({
  fixtureId: z.string().min(1),
  fixtureName: z.string().min(1),
  purpose: z.string().min(1),
  fixtureCategory: z.enum(['demo', 'edge', 'messy', 'stress', 'onboarding', 'broken']),
  version: z.number().int().positive(),
  schemaCompatibility: z.string().min(1),
  createdAt: z.string().date(),
  containsProfiles: z.array(z.string().min(1)),
  containsAccounts: z.number().int().nonnegative(),
  containsAlerts: z.boolean(),
  containsPayouts: z.boolean(),
  containsKnownEdges: z.array(z.string().min(1)),
  notes: z.array(z.string()),
});
