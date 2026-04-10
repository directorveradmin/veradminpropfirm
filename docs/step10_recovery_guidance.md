# Step 10 — Recovery Guidance

Version: 1.0  
Status: Step 10 complete  
Audience: Serious single-operator desktop user  
Canonical inputs: `23-error-states-and-recovery-flows.md`, `24-data-migration-and-versioning-spec.md`, `17-security-and-local-data-protection.md`, `34-backup-restore-and-export-screen-spec.md`

---

## 1. Recovery posture

Veradmin’s recovery posture is built on four ideas:

1. the local dataset is the source of truth,
2. recovery is a product feature, not a hidden engineering fallback,
3. restore must protect current state before overwrite,
4. tactical trust matters more than pretending the app is always fine.

When continuity is uncertain, Veradmin should become clearer and more conservative, not more optimistic.

---

## 2. When the operator can keep working

Administrative issues do **not** always require a tactical stop.

The operator can usually continue using tactical surfaces when the issue is limited to:
- an export failure,
- stale backup reminders,
- diagnostics summary temporarily unavailable,
- a settings save failure that clearly left stored state unchanged.

In those cases, Veradmin should say the issue is administrative and that current tactical interpretation remains trusted.

---

## 3. When the operator should stop trusting tactical interpretation

The operator should pause tactical reliance and move into recovery review when Veradmin reports:

- migration failed and integrity is uncertain,
- restore may have partially overwritten local state,
- rule/profile references cannot be trusted after upgrade or restore,
- core account evaluation cannot confirm current truth,
- local dataset corruption is suspected.

In those cases, the product should not act normal.

---

## 4. Scenario guidance

## 4.1 No backups created yet
Recommended action:
- create a full backup before making other administrative changes,
- confirm the destination path is visible and controlled,
- verify that the backup appears in recent operations/history.

## 4.2 Backup is stale
Recommended action:
- create a fresh backup now,
- review destination/path health,
- avoid risky recovery or migration work until a fresh backup exists if possible.

## 4.3 Backup creation failed
Meaning:
- protection was not updated,
- live local state was not modified by the failed backup attempt.

Recommended action:
1. confirm destination path availability,
2. retry backup,
3. if failure repeats, review diagnostics,
4. avoid restore/import actions until protection is back in a healthy state.

## 4.4 Restore preview says `Review required`
Meaning:
- the system cannot yet confirm safe compatibility.

Recommended action:
1. inspect app/schema/backup format versions,
2. prefer a newer clearly compatible backup if one exists,
3. do not proceed on hope alone,
4. use diagnostics or release notes if needed before restore.

## 4.5 Restore is blocked before overwrite
Meaning:
- current local state remains in place,
- no destructive change occurred.

Recommended action:
- choose another backup,
- fix the cause named by the product,
- retry only after the blocked reason is resolved.

## 4.6 Safety backup failed before restore
Meaning:
- Veradmin refused to weaken recoverability,
- restore did not proceed.

Recommended action:
- resolve storage/path failure,
- create a manual backup first if appropriate,
- retry restore only after protection is healthy again.

## 4.7 Restore completed successfully
Recommended action:
1. review restore result summary,
2. confirm whether migration ran,
3. inspect protection summary,
4. verify core screens load,
5. create a fresh post-restore backup if the workflow or policy calls for it.

## 4.8 Restore may have partially affected state
Meaning:
- trust is uncertain,
- tactical interpretation should pause,
- protected recovery mode is appropriate.

Recommended action:
1. stop relying on tactical surfaces,
2. inspect diagnostics,
3. prefer restoring from the safety backup created before restore,
4. confirm integrity before resuming normal work.

## 4.9 Export failed
Meaning:
- no portability artifact was produced,
- live state remains intact.

Recommended action:
- retry with another destination,
- narrow scope if needed,
- confirm available disk/folder access.

## 4.10 Startup migration failed
Meaning:
- the app cannot safely continue normal operation.

Recommended action:
1. review migration result and logged versions,
2. prefer restore from a trusted backup if supported,
3. do not continue normal use until integrity is confirmed.

---

## 5. Post-recovery verification checklist

After any restore, migration recovery, or major administrative repair, verify:

- app version shown by the product
- schema version shown by the product
- last migration result is successful or otherwise explicitly understood
- protection summary no longer shows integrity uncertainty
- fleet/account screens load without trust warnings
- recent operations history contains the recovery event
- current backup inventory is visible
- a fresh backup can be created if needed

If any of those checks fail, tactical confidence should remain reduced until explained.

---

## 6. Local security and path discipline guidance

Backups and exports contain meaningful operational history.

Recommended operator practices:
- keep backup destinations controlled and predictable,
- avoid casual shared folders when possible,
- remember that exports may contain journal, payout, note, and alert history,
- do not rely on Veradmin to replace device-level security,
- prefer OS-level account protection and disk encryption where available.

The product should be honest if v1 does not yet encrypt backups automatically.

---

## 7. Diagnostics reading guidance

When the operator opens diagnostics, the most important fields are:

- current app version
- current schema version
- last successful backup
- last migration outcome
- current protection status
- recent critical recovery events

This order matters because it answers:
- what version am I on,
- what happened most recently,
- can I trust the local memory,
- what is the safest next move.

---

## 8. Recovery rules that must remain true

Do not weaken these rules in later implementation:

- restore never happens blindly,
- safety backup comes before restore whenever practical,
- compatibility warnings are explicit,
- failures name what stayed unchanged,
- trust uncertainty stops normal optimism,
- administrative problems are not overstated as tactical problems unless they truly affect trust.

---

## 9. Operator-facing copy examples

Approved:
- `Current local state remains in place.`
- `A safety backup will be created before restore begins.`
- `Export failed. Live local state was not modified.`
- `Integrity could not be confirmed after restore. Use protected recovery guidance before returning to tactical work.`

Avoid:
- `Unknown error`
- `Proceed anyway`
- `Something went wrong`
- `Your data may be messed up`

The tone should stay plain and professional.
