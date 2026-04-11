# Step 11 — Onboarding and First-Run Blueprint

Version: 1.0  
Status: Step 11 complete  
Scope: First-run experience, early trust-building, and post-first-run guidance  
Canonical inputs: `22-onboarding-and-first-run-experience.md`, `26-example-rule-profiles-and-fixtures.md`, `23-error-states-and-recovery-flows.md`, `24-data-migration-and-versioning-spec.md`, `43-daily-operator-workflow.md`

---

## 1. Step 11 intent

This blueprint defines how Veradmin should behave the first time it is opened by a real operator.

It is not a marketing tour.
It is not a novelty sequence.
It is not a long tutorial deck.

The first-run surface exists to do four things well:
- explain what Veradmin is in operational terms,
- offer a safe starting path,
- land the operator in a meaningful state quickly,
- and preserve local trust from the first launch.

---

## 2. Decisions frozen in Step 11

### 2.1 First-run is operational, not promotional
The opening experience must sound like a serious local operating tool.

Rules:
- no celebratory setup language,
- no gamified progress fluff,
- no consumer-style “let’s personalize everything” detours,
- no hidden mutation of local state before the operator chooses a path.

### 2.2 Startup path selection is fixed
Step 11 freezes the three supported first-run paths:

1. **Create first account**
2. **Load example fleet**
3. **Restore from backup**

No additional first-run branches should be introduced in v1 unless they are strictly necessary for trust or continuity.

### 2.3 Returning users bypass first-run
If Veradmin detects a healthy existing local dataset, the product must not reopen the first-run sequence automatically.

Instead it should:
- resume the normal command workflow,
- surface version or migration context if relevant,
- and only expose onboarding help as optional contextual guidance.

### 2.4 First-run teaching is compact and progressive
The first-run flow may teach:
- lives,
- modes,
- tradable vs restricted vs stopped,
- dashboard mission,
- and local-first data storage.

It must **not** try to teach every future concept up front.
Advanced simulation depth, deep reporting, extensive exports, and post-v1 convenience layers remain outside the first-run sequence.

### 2.5 First-run safety comes before convenience
Before any onboarding surface is shown, Veradmin should resolve the trust gate below:

1. startup compatibility check,
2. migration / integrity check,
3. restore-recovery check if the last session ended in uncertainty,
4. only then the onboarding or normal landing path.

If trust is uncertain, controlled recovery takes priority over onboarding.

### 2.6 Example data stays clearly separate from real data
The example fleet is educational.
It must never silently masquerade as operator truth.

Rules:
- visibly label example data as example data,
- keep example loading intentional,
- avoid merging example data into an already-established real dataset without an explicit decision,
- and preserve a clean route toward replacing the example fleet later with real accounts.

---

## 3. First-run state model

Step 11 freezes the following first-run state model.

### 3.1 `new_empty`
Brand-new install, no local dataset, no restore in progress.

### 3.2 `new_create_real`
Brand-new user choosing to create a first real account.

### 3.3 `new_example_fleet`
Brand-new user choosing to load the educational example fleet.

### 3.4 `returning_restore`
Returning user entering from a restore or recovery flow.

### 3.5 `returning_existing`
Healthy returning user with an existing trusted local dataset.

Only the first three should use the full first-run path selector.

---

## 4. First-run sequence

## 4.1 Boot integrity gate
Before any first-run welcome appears, the app checks:
- whether a local dataset exists,
- whether the schema is compatible,
- whether a migration completed safely,
- whether recovery trust is uncertain.

Outcomes:
- **healthy existing dataset** → skip onboarding and land normally,
- **healthy empty dataset** → show onboarding selector,
- **trust uncertain** → open controlled recovery surface instead of onboarding.

## 4.2 Welcome screen
The welcome screen is calm and operational.

Required contents:
- title: `Welcome to Veradmin`
- one-line framing: rule-driven fleet control for prop-firm accounts
- explicit local-first note
- three starting actions:
  - `Create first account`
  - `Load example fleet`
  - `Restore from backup`

Recommended supporting line:
`Choose a safe starting path. Veradmin will either help you set up a real account, load an educational example fleet, or restore trusted local state.`

## 4.3 Compact mental-model panel set
The welcome flow may include compact cards or side panels explaining:
- **Lives** — standardized risk room, not raw emotional interpretation
- **Modes** — tactical posture the product derives from rules and current state
- **Tradable / restricted / stopped** — what can be acted on now
- **Dashboard mission** — what matters today at the fleet level
- **Local-first memory** — history lives on this device unless exported or backed up intentionally

These are teaching supports, not blocking slides.

## 4.4 Path-specific execution

### Create first account
Use a guided but compact account setup form.

Required fields:
- account label
- firm
- stage / class
- rule profile
- starting balance
- current balance if needed
- peak balance if trailing logic requires it

Required explanations:
- why profile selection matters,
- why starting / peak balance matters,
- why current balance affects interpretation.

### Load example fleet
Use the dedicated onboarding fleet pack defined in Step 11.

Required behavior:
- clearly state that the data is example-only,
- confirm that the operator is loading educational example data,
- show a simple summary of what the fleet contains,
- and land on a dashboard that teaches multiple states immediately.

### Restore from backup
Route into the dedicated protection / recovery workflow.

Rules:
- do not bury restore inside a “more options” drawer,
- keep recovery language consequence-aware,
- and preserve the Step 10 restore preview / safety-backup doctrine.

## 4.5 First landing target
After first-run setup succeeds, the user lands on the Command Center / Dashboard.

The first landing must show:
- a mission or orientation panel,
- a visible difference between at least two accounts,
- one or two obvious next actions,
- and calm guidance about what they are looking at.

## 4.6 Contextual post-landing guidance
After the first landing, guidance becomes contextual and dismissible.

Recommended trigger points:
- first account detail open,
- first log win / log loss action,
- first payout-ready state,
- first critical alert,
- first simulation entry,
- first backup reminder.

---

## 5. Empty, quiet, and returning-user states

### 5.1 Quiet early state
If a new user starts with one real account and little history, quiet surfaces must still feel complete.

Approved empty-state patterns:
- `No journal history yet. Logged events will appear here.`
- `No payouts recorded yet.`
- `No critical alerts right now.`
- `No rotation items scheduled yet.`

### 5.2 Returning user behavior
Returning users should not be treated like new users.

Required behavior:
- skip welcome flow if trust is healthy,
- show version or migration notes only when relevant,
- preserve dismissed onboarding tips unless explicitly reset,
- surface restore success clearly if the user just came through recovery.

### 5.3 Example-data replacement behavior
If the user previously loaded the example fleet and later decides to start real work, the product should make that transition explicit.

Recommended v1 behavior:
- allow wiping or archiving the example dataset only through deliberate admin action,
- explain whether current example data will be replaced,
- and encourage a backup before destructive replacement if the user has added real notes or history.

---

## 6. Persistence flags and implementation notes

Step 11 recommends that first-run state be persisted separately from tactical state.

Suggested bootstrap fields:
- `hasCompletedFirstRun`
- `firstRunExperienceVersion`
- `firstRunPathUsed`
- `loadedExampleFixtureId`
- `dismissedGuidanceKeys[]`
- `lastRestoreOutcome`

Rules:
- these flags must not impersonate tactical truth,
- they must be safe to reset without changing account evaluation,
- and they should remain compatible with migration/versioning rules.

---

## 7. First-run copy rules

Use:
- calm,
- direct,
- precise,
- operational language.

Avoid:
- hype,
- “you’re all set!” noise,
- generic productivity-app clichés,
- unexplained jargon.

Approved examples:
- `Load example fleet`
- `Restore from backup`
- `This example fleet is for learning Veradmin safely before adding real accounts.`
- `Current local state remains in place.`
- `Create your first account when you are ready to track real operational state.`

---

## 8. Step 11 boundaries

This step intentionally does **not** add:
- sync,
- cloud onboarding,
- multi-device setup,
- social/tutorial video surfaces,
- post-v1 guidance layers,
- AI-driven setup assistants.

Step 11 is about clarity, trust, and first-use readiness.

---

## 9. Definition of done for this Step 11 surface

This blueprint is satisfied when:
1. a first-time user can understand what Veradmin is for quickly,
2. the startup path selector is limited to the three trusted branches,
3. example-fleet loading is intentional and clearly labeled,
4. returning users are not forced back through first-run theater,
5. the first dashboard landing feels meaningful rather than empty,
6. contextual help is progressive and dismissible,
7. recovery / integrity uncertainty is allowed to override onboarding when needed.
