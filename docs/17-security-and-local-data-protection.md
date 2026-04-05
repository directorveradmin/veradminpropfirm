# Veradmin Security and Local Data Protection

Version: 1.0  
Status: Active  
Owner: Architecture / Engineering / Product / Operations  
Applies To: Local data storage, desktop security posture, backup safety, export safety, privacy boundaries, and trust-preserving protective measures

---

## 1. Purpose of This Document

This document defines the security and local data protection posture for Veradmin.

Veradmin is a local-first tactical operating system for managing a prop-firm fleet.
That means the product will store operationally sensitive information such as:

- account balances
- payout history
- rule profiles
- trade outcomes
- notes
- operational alerts
- account lifecycle data
- business history
- backups and exports

Even if Veradmin is not a bank and even if it is not initially a public SaaS product, it still carries meaningful privacy and integrity responsibilities.

This document exists so that security is handled deliberately rather than reactively.

Veradmin does not need theatrical “enterprise security language” in order to deserve care.
It needs clear local protection, honest scope boundaries, safe defaults, and disciplined handling of data movement.

---

## 2. Security Mission

The security posture of Veradmin must do five things well:

1. Protect local operational history from casual exposure and accidental damage.
2. Preserve data integrity so that the system’s outputs remain trustworthy.
3. Minimize unnecessary attack surface in v1.
4. Make dangerous data movement explicit and controllable.
5. Create a foundation for future security hardening without pretending v1 is something it is not.

The product must be honest about its security model.
Trust is improved by clarity, not by inflated claims.

---

## 3. Security Principles

### 3.1 Local-first means local responsibility

Because the source of truth is local in v1, the product must treat device-level protection and local file discipline seriously.

### 3.2 Minimize surface area

Do not add cloud, sync, network services, or unnecessary background services until they are truly needed.

### 3.3 Protect integrity as much as confidentiality

A tactical operating system can become dangerous if it shows wrong state, even if no one “hacks” it.

### 3.4 Safe defaults matter

The user should not have to be a security expert in order to avoid obvious data mistakes.

### 3.5 Be explicit about boundaries

Veradmin should clearly distinguish:
- what it protects directly,
- what depends on the user’s device security,
- and what later versions may improve.

---

## 4. Security Scope for v1

Veradmin v1 is not a cloud platform.
It is not a multi-tenant web service.
It is not a brokerage connection layer.
It is not a live market execution terminal.

Its v1 security posture should focus on:

- local data storage safety
- backup protection
- export control
- restore safety
- data integrity
- update safety
- desktop install trust
- minimizing unnecessary exposure

This narrower focus is correct for the current doctrine.

---

## 5. Sensitive Data Categories

The product should treat the following as sensitive or semi-sensitive:

### 5.1 Operational data
- balances
- lives
- modes
- restrictions
- payout status
- alerts

### 5.2 Historical data
- journal entries
- notes
- payout history
- refund history
- account transitions
- backups

### 5.3 Configuration data
- rule profiles
- settings
- calendar rotation logic
- alert preferences

### 5.4 Exported artifacts
- CSV exports
- JSON exports
- backup files
- release migration logs if they contain state

These may not all carry equal sensitivity, but they deserve disciplined handling.

---

## 6. Threat Model for v1

Veradmin v1 should explicitly design against likely real-world risks, not imaginary prestige threats.

Most relevant risks include:

- accidental local data deletion
- corrupted local database
- unsafe restore or overwrite
- careless export to insecure locations
- unauthorized casual access on a shared device
- broken migrations during upgrades
- stale or tampered local backup files
- overly broad logging of sensitive context
- future sync added without clear protection boundaries

Less relevant for v1, but worth acknowledging later:
- remote compromise through cloud sync
- multi-user permission issues
- collaborative access control
- server-side secrets exposure

---

## 7. Local Device Assumptions

Veradmin runs on a device controlled by the operator.

That means some protections depend on the underlying system, including:
- OS-level account password
- full-disk encryption if available
- device lock behavior
- file-system permissions
- secure user habits

Veradmin should not imply it replaces device security.
Instead, it should work well within it and avoid weakening it.

---

## 8. Local Data Storage Policy

The local database should be stored in an application-appropriate directory, not in casual or exposed working folders.

Storage rules:
- use a predictable application data location
- avoid storing critical state in temporary folders
- avoid scattering related files across inconsistent paths
- clearly separate active database files from backup/export files

If the product exposes storage paths in diagnostics, it should do so helpfully and carefully.

---

## 9. Backup Protection Policy

Backups are one of the largest security and privacy surfaces in the product.

Rules:
- backups should be clearly labeled
- backups should be stored in a controlled location by default
- backup creation should be explicit in logs/history where appropriate
- backup retention should avoid uncontrolled file sprawl
- the app should warn the user that backups contain meaningful operational history

If encryption is not yet implemented in v1, the product should not hide that fact.
It should instead encourage disciplined local storage.

---

## 10. Export Safety Policy

Exports are intentionally portable, which makes them useful and risky.

Rules:
- export flows should clearly state what is being exported
- the app should show destination path and format
- exports should not happen silently in the background without clear intent
- full-history exports should be clearly distinguishable from smaller scoped exports
- exported files should be named clearly enough that the user understands their content

If an export is broad or sensitive, the product may include a warning or confirmation step.

---

## 11. Restore and Import Safety

Restore is a security-sensitive integrity operation.

Rules:
- always back up current state before restore
- validate file compatibility before applying restore
- never apply restore silently
- surface schema/version mismatch clearly
- preserve restore events in system history if useful

If import is added later, the same discipline must apply:
- validate
- preview
- confirm
- preserve provenance

---

## 12. Update and Migration Safety

A security posture is weak if updates damage integrity.

Rules:
- upgrades should preserve local state safely
- migrations must be versioned and testable
- risky migrations should trigger safety backup behavior
- the product should never silently alter core operational semantics without release notes and changelog clarity

Integrity and explainability are part of security.

---

## 13. Logging and Diagnostics Safety

Diagnostics are useful, but careless logging can expose too much.

Rules:
- avoid logging sensitive full payloads casually in production-like builds
- distinguish development logs from release logs
- avoid storing raw unnecessary debug traces forever
- redact or omit overly sensitive note text if future telemetry is ever added

The product should not become a leak source through its own troubleshooting layer.

---

## 14. Authentication and Access in v1

Because Veradmin is a single-operator local-first tool in v1, heavyweight authentication is not required by doctrine.

However, the product may later support lightweight protective measures such as:
- optional local app lock
- privacy shield on launch
- session lock after inactivity
- obscured sensitive values on request

If v1 launches without these, that is acceptable, but the absence should be a conscious choice rather than neglect.

---

## 15. Optional v1.1+ Local Protection Enhancements

Strong candidates for later but near-term hardening:
- optional local passcode or app lock
- optional hidden-value mode for balances and payout amounts
- optional encrypted backups
- warning when exporting to risky locations
- startup privacy preference to blur or hide values until revealed

These can improve user confidence without changing the local-first architecture.

---

## 16. UI Guidance for Security-Related Flows

Security-related interactions should feel:
- clear
- sober
- not theatrical
- consequence-aware
- plain-language

Avoid:
- fear-driven warnings
- fake “military-grade” language
- technical jargon where not needed
- hidden destructive actions

Good examples:
- “This backup contains full local history.”
- “Restore will replace current state after a safety backup is created.”
- “Export includes payout and journal data for the selected date range.”

---

## 17. Data Integrity Protections

Confidentiality matters, but integrity is central for Veradmin.

Protections should include:
- validation at input boundaries
- schema-driven storage
- deterministic rule evaluation
- migration safety
- seeded regression datasets
- explicit correction events when history changes
- consistency checks after restore and upgrade where practical

The operator must be able to trust that “what the system says” still matches “what the data means.”

---

## 18. Security Responsibilities by Layer

### 18.1 Product layer
Defines safe flows, explicit warnings, and responsible defaults.

### 18.2 Engineering layer
Implements storage safety, migration discipline, validation, and careful handling of logs and exports.

### 18.3 Operator layer
Maintains responsible device hygiene, storage behavior, backup discipline, and physical device control.

Veradmin should support the operator well, but should not pretend to replace secure device habits.

---

## 19. Anti-Patterns to Avoid

Avoid:
- pretending v1 has protections it does not
- storing local data in unstable or public locations by default
- silent destructive restore/import behavior
- broad hidden export behavior
- uncontrolled debug logging with sensitive state
- adding cloud sync before clear security boundaries exist
- using “security” language as branding instead of substance

---

## 20. Definition of Done for Security and Local Data Protection

This spec is satisfied when:

1. Local state is stored in disciplined, appropriate locations.
2. Backups and exports are handled explicitly and safely.
3. Restore and upgrade flows protect data integrity.
4. Diagnostics do not casually expose sensitive information.
5. The product is honest about v1’s local-first security posture.
6. Dangerous data movement actions require clear user intent.
7. The user can trust Veradmin not only to be useful, but to be careful.

---

## 21. Future Considerations

Potential later additions:
- encrypted local database
- signed backup packages
- secure auto-update verification
- local app lock and inactivity timeout
- secure cloud sync model
- audit report for security-sensitive actions
- data retention policies for logs and exports

These are valuable later, but v1 must first establish truthful, disciplined local protection.
