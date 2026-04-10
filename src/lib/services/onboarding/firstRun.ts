export interface FirstRunStatus {
  accountCount: number;
  hasAccounts: boolean;
  shouldShowOnboarding: boolean;
  databasePresent: boolean;
  canLoadExampleFleet: boolean;
  recommendedStartPath: "create" | "example" | "resume";
}

export function deriveFirstRunStatus(accountCount: number, databasePresent = true): FirstRunStatus {
  const safeCount = Number(accountCount || 0);
  const hasAccounts = safeCount > 0;

  return {
    accountCount: safeCount,
    hasAccounts,
    shouldShowOnboarding: !hasAccounts,
    databasePresent,
    canLoadExampleFleet: true,
    recommendedStartPath: hasAccounts ? "resume" : "example"
  };
}
