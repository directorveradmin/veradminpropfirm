import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { evaluateAccount } from '../../src/lib/domain/rules/engine';
import { getDemoFixtureInput, getEdgeFixtureInput } from '../../tests/fixtures/ruleEngineScenarioFixtures';

const scenarios = [
  ['demo_alpha_001', '2026-04-05T10:00:00Z', getDemoFixtureInput('acct_alpha_001')],
  ['demo_alpha_002', '2026-04-05T10:00:00Z', getDemoFixtureInput('acct_alpha_002')],
  ['demo_beta_001', '2026-04-05T10:00:00Z', getDemoFixtureInput('acct_beta_001')],
  ['demo_beta_003', '2026-04-05T10:00:00Z', getDemoFixtureInput('acct_beta_003')],
  ['edge_alpha_exact_floor', '2026-04-05T10:00:00Z', getEdgeFixtureInput('edge_alpha_exact_floor')],
  ['edge_alpha_above_floor', '2026-04-05T10:00:00Z', getEdgeFixtureInput('edge_alpha_above_floor')],
  ['edge_beta_below_floor', '2026-04-05T10:00:00Z', getEdgeFixtureInput('edge_beta_below_floor')],
  ['edge_beta_collision', '2026-04-05T12:20:00Z', getEdgeFixtureInput('edge_beta_collision')],
] as const;

const output = Object.fromEntries(
  scenarios.map(([key, nowIso, input]) => [
    key,
    evaluateAccount({ ...input, nowIso }),
  ]),
);

const destination = resolve(process.cwd(), 'step4_pipeline_outputs.json');
writeFileSync(destination, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Wrote ${destination}`);
console.log(JSON.stringify(output, null, 2));
