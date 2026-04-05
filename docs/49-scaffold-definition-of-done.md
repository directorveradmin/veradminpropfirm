# Veradmin Scaffold Definition of Done

Version: 1.0  
Status: Active  
Owner: Engineering / Architecture / Delivery  
Applies To: Step 2 completion criteria and quality gate for the delivery scaffold

---

## 1. Purpose of This Document

This document defines what must be true for Step 2 to count as complete.

---

## 2. Step 2 Definition of Done

Step 2 is done when all of the following are true:

1. The repo has one clear canonical tree for app, docs, database, tests, scripts, and desktop shell.
2. The app scaffold is explicitly desktop-first through Tauri.
3. The development model is explicitly local-first through SQLite.
4. Next.js is positioned as the UI/runtime shell, not the home of server-dependent product truth.
5. The future rule engine has a dedicated home outside UI folders.
6. The database layer has clear homes for schema, migrations, seeds, fixtures, and repositories.
7. Tauri shell responsibilities are separated from business logic responsibilities.
8. A contributor can understand how to boot, reset, seed, and run the project locally.
9. Common commands are standardized and documented.
10. The scaffold includes a clean handoff into Step 3 without prematurely implementing later systems.

---

## 3. Quality Gate Checklist

### Structure gate
- [x] docs boundary defined
- [x] app boundary defined
- [x] feature boundary defined
- [x] domain boundary defined
- [x] database boundary defined
- [x] Tauri boundary defined
- [x] tests boundary defined

### Delivery gate
- [x] Tauri + Next.js direction documented
- [x] development vs packaged runtime clarified
- [x] local data-path strategy clarified
- [x] repo-local dev state strategy defined

### Tooling gate
- [x] package-manager direction defined
- [x] script surface defined
- [x] migration and seed flow defined
- [x] reset flow defined
- [x] environment strategy minimized

### Discipline gate
- [x] no rule-engine implementation spill
- [x] no broad screen implementation spill
- [x] no cloud-first drift
- [x] no business-logic-in-shell drift

---

## 4. What Step 2 Explicitly Does Not Need to Finish

Step 2 does not need to finish:

- final account schema
- final rule profile schema
- full repository implementations
- actual rule engine behavior
- real account screens
- full journal or payout workflows
- complete test coverage
- polished release packaging

Those belong to later steps.

---

## 5. Failure Conditions

Step 2 should be considered incomplete if any of the following are true:

- the repo tree is still ambiguous
- the app still depends conceptually on browser-first assumptions
- persistence ownership is unclear
- Tauri is treated as the business-logic layer
- there is no clear local reset/seed story
- later implementation phases still lack obvious homes in the repo

---

## 6. Final Step 2 Quality Statement

The scaffold is successful when it gives Step 3 a calm place to begin real implementation.
If Step 3 would still need to restructure the repo before adding schema and profiles, Step 2 has not done its job.
