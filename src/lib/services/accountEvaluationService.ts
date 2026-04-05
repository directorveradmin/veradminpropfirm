import { evaluateAccount } from '../domain/rules/index';
import type { EvaluationInput, EvaluationResult } from '../domain/rules/index';

type AccountsRepositoryLike = {
  getEvaluationInputBundle(accountId: string): {
    account: EvaluationInput['account'];
    openAssignment?: EvaluationInput['openAssignment'];
    latestDayState?: EvaluationInput['latestDayState'];
    recentPayouts?: EvaluationInput['recentPayouts'];
    recentRotations?: EvaluationInput['recentRotations'];
    upcomingNews?: EvaluationInput['upcomingNews'];
  } | null;
};

type RuleProfilesRepositoryLike = {
  getVersionById(versionId: string): EvaluationInput['ruleProfileVersion'];
  getFamilyById(ruleProfileId: string): EvaluationInput['ruleProfileFamily'];
};

export function evaluateAccountFromRepositories(
  accountId: string,
  repositories: {
    accountsRepository: AccountsRepositoryLike;
    ruleProfilesRepository: RuleProfilesRepositoryLike;
  },
  options?: Pick<EvaluationInput, 'nowIso' | 'evaluationMode' | 'recentTradeLogs'>,
): EvaluationResult | null {
  const bundle = repositories.accountsRepository.getEvaluationInputBundle(accountId);
  if (!bundle) {
    return null;
  }

  const ruleProfileVersion = repositories.ruleProfilesRepository.getVersionById(
    bundle.account.currentRuleProfileVersionId,
  );
  const ruleProfileFamily = repositories.ruleProfilesRepository.getFamilyById(
    bundle.account.currentRuleProfileId,
  );

  return evaluateAccount({
    account: bundle.account,
    openAssignment: bundle.openAssignment ?? null,
    latestDayState: bundle.latestDayState ?? null,
    recentPayouts: bundle.recentPayouts ?? [],
    recentRotations: bundle.recentRotations ?? [],
    upcomingNews: bundle.upcomingNews ?? [],
    ruleProfileVersion,
    ruleProfileFamily,
    recentTradeLogs: options?.recentTradeLogs,
    nowIso: options?.nowIso,
    evaluationMode: options?.evaluationMode,
  });
}
