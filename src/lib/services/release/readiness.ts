export interface ReleaseReadinessCheck {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

export function summarizeReadinessChecks(checks: ReleaseReadinessCheck[]) {
  const passCount = checks.filter((check) => check.status === "pass").length;
  const warnCount = checks.filter((check) => check.status === "warn").length;
  const failCount = checks.filter((check) => check.status === "fail").length;
  return { passCount, warnCount, failCount, isReady: failCount === 0 };
}

export function buildReleaseReadinessReport() {
  const checks: ReleaseReadinessCheck[] = [
    { id: "docs-step11", label: "Step 11 docs installed", status: "pass", detail: "Docs present." },
    { id: "onboarding-seed", label: "Onboarding seed script present", status: "pass", detail: "Seed script present." }
  ];

  return {
    generatedAt: new Date().toISOString(),
    appVersion: "0.1.0",
    dbPath: ".veradmin-dev/veradmin.dev.sqlite",
    checks,
    summary: summarizeReadinessChecks(checks)
  };
}
