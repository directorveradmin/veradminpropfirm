import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAccount } from '../../src/lib/domain/rules/engine';
import { getDemoFixtureInput, getEdgeFixtureInput } from '../fixtures/ruleEngineScenarioFixtures';

const NOW = '2026-04-05T10:00:00Z';

test('exact hard floor is stopped but not breached', () => {
  const result = evaluateAccount({ ...getEdgeFixtureInput('edge_alpha_exact_floor'), nowIso: NOW });

  assert.equal(result.mode.value, 'stopped');
  assert.equal(result.permissions.mustNotTrade, true);
  assert.equal(result.restrictions.active.includes('hard_floor_reached'), true);
  assert.equal(result.restrictions.active.includes('hard_floor_breached'), false);
  assert.equal(result.lives.effectiveFractionalLives, 0);
});

test('one cent below hard floor is breached', () => {
  const result = evaluateAccount({ ...getEdgeFixtureInput('edge_beta_below_floor'), nowIso: NOW });

  assert.equal(result.mode.value, 'breached');
  assert.equal(result.permissions.mustNotTrade, true);
  assert.equal(result.restrictions.active.includes('hard_floor_breached'), true);
});

test('funded payout-active account can become payout ready', () => {
  const result = evaluateAccount({ ...getDemoFixtureInput('acct_alpha_002'), nowIso: NOW });

  assert.equal(result.payout.relevant, true);
  assert.equal(result.payout.state, 'pending');
  assert.equal(result.mode.value, 'payout_protection');
  assert.equal(result.permissions.mayRequestPayout, false);
});

test('evaluation account tracks target progress and minimum day completion separately', () => {
  const result = evaluateAccount({ ...getDemoFixtureInput('acct_beta_001'), nowIso: NOW });

  assert.equal(result.progression.targetEnabled, true);
  assert.equal(result.progression.minimumTradingDaysMet, false);
  assert.equal(result.progression.targetMet, false);
  assert.equal(result.mode.value, 'attack');
});

test('manually paused account resolves to cooldown with no trading permission', () => {
  const result = evaluateAccount({ ...getDemoFixtureInput('acct_beta_003'), nowIso: NOW });

  assert.equal(result.mode.value, 'cooldown');
  assert.equal(result.permissions.mayTrade, false);
  assert.equal(result.permissions.mayResume, true);
});

test('news lock collision blocks funded payout account even before breach', () => {
  const result = evaluateAccount({ ...getEdgeFixtureInput('edge_beta_collision'), nowIso: '2026-04-05T12:20:00Z' });

  assert.equal(result.restrictions.newsLockActive, true);
  assert.equal(result.permissions.mayTrade, false);
  assert.equal(result.restrictions.active.includes('news_lock_active'), true);
  assert.equal(result.payout.state, 'pending');
});
