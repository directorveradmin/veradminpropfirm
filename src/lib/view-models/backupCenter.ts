export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'critical';

export type ProtectionHealth = 'healthy' | 'attention' | 'critical';

export type BackupType = 'full-app' | 'manual' | 'scheduled' | 'safety-pre-restore';

export type CompatibilityStatus =
  | 'compatible'
  | 'compatible-after-migration'
  | 'review-required'
  | 'unsupported'
  | 'uncertain-integrity';

export type OperationOutcome = 'succeeded' | 'failed' | 'blocked' | 'warning';

export interface HeaderActionVM {
  readonly id: string;
  readonly label: string;
  readonly emphasis: 'secondary' | 'primary' | 'danger';
}

export interface HeaderVM {
  readonly title: string;
  readonly summary: string;
  readonly protectionBadge: string;
  readonly protectionTone: Tone;
  readonly actions: readonly HeaderActionVM[];
}

export interface ProtectionSummaryItemVM {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly detail: string;
  readonly tone: Tone;
}

export interface BackupRecordVM {
  readonly id: string;
  readonly createdAtLabel: string;
  readonly backupType: BackupType;
  readonly statusLabel: string;
  readonly tone: Tone;
  readonly appVersion: string;
  readonly schemaVersion: string;
  readonly backupFormatVersion: string;
  readonly sizeLabel?: string;
  readonly note?: string;
  readonly restorable: boolean;
}

export interface BackupSectionVM {
  readonly introduction: string;
  readonly destinationSummary: string;
  readonly includesSummary: string;
  readonly health: ProtectionHealth;
  readonly records: readonly BackupRecordVM[];
}

export interface RestorePreviewVM {
  readonly sourceBackupId: string;
  readonly sourceLabel: string;
  readonly timestampLabel: string;
  readonly backupType: BackupType;
  readonly appVersion: string;
  readonly schemaVersion: string;
  readonly backupFormatVersion: string;
  readonly compatibilityStatus: CompatibilityStatus;
  readonly compatibilityLabel: string;
  readonly compatibilityDetail: string;
  readonly requiresPostRestoreMigration: boolean;
  readonly affectedStateSummary: readonly string[];
  readonly willCreateSafetyBackup: boolean;
  readonly currentStatePreservedUntilConfirm: boolean;
  readonly blockedReason?: string;
  readonly confirmationLabel: string;
  readonly cancelLabel: string;
}

export interface RestoreSectionVM {
  readonly introduction: string;
  readonly availableBackups: readonly BackupRecordVM[];
  readonly previews: Readonly<Record<string, RestorePreviewVM>>;
  readonly protectedRecoveryCallout?: {
    readonly tone: Tone;
    readonly title: string;
    readonly detail: string;
    readonly nextStep: string;
  };
}

export interface ExportFormatOptionVM {
  readonly id: string;
  readonly label: string;
}

export interface ExportPresetVM {
  readonly id: string;
  readonly label: string;
  readonly scopeSummary: string;
  readonly inclusionSummary: string;
  readonly destinationSummary: string;
  readonly formatOptions: readonly ExportFormatOptionVM[];
  readonly lastExportLabel?: string;
  readonly cautionText?: string;
}

export interface ExportSectionVM {
  readonly introduction: string;
  readonly presets: readonly ExportPresetVM[];
}

export interface VersionLineVM {
  readonly label: string;
  readonly value: string;
}

export interface VersionPanelVM {
  readonly title: string;
  readonly lines: readonly VersionLineVM[];
  readonly compatibilityNote: string;
}

export interface OperationRecordVM {
  readonly id: string;
  readonly occurredAtLabel: string;
  readonly typeLabel: string;
  readonly outcome: OperationOutcome;
  readonly tone: Tone;
  readonly summary: string;
  readonly detail: string;
}

export interface BackupCenterVM {
  readonly header: HeaderVM;
  readonly protectionSummary: readonly ProtectionSummaryItemVM[];
  readonly backup: BackupSectionVM;
  readonly restore: RestoreSectionVM;
  readonly export: ExportSectionVM;
  readonly versionPanel: VersionPanelVM;
  readonly operations: readonly OperationRecordVM[];
}

export const backupCenterFixture: BackupCenterVM = {
  header: {
    title: 'Backup, Restore, and Export',
    summary:
      'Protection-first administrative tools for local continuity, recoverability, and structured portability.',
    protectionBadge: 'Protection healthy',
    protectionTone: 'success',
    actions: [
      {
        id: 'create-backup-now',
        label: 'Create Backup Now',
        emphasis: 'primary',
      },
      {
        id: 'review-history',
        label: 'Review Operations',
        emphasis: 'secondary',
      },
    ],
  },
  protectionSummary: [
    {
      id: 'last-successful-backup',
      label: 'Last successful backup',
      value: 'Today • 08:15',
      detail: 'Manual full backup completed successfully.',
      tone: 'success',
    },
    {
      id: 'retained-backups',
      label: 'Retained backups',
      value: '7 available',
      detail: 'Recent backups remain visible and restorable.',
      tone: 'neutral',
    },
    {
      id: 'current-schema-version',
      label: 'Current schema version',
      value: 'runtime-schema-version',
      detail: 'Visible so compatibility is never a hidden assumption.',
      tone: 'info',
    },
    {
      id: 'last-export',
      label: 'Last export',
      value: 'Yesterday • Full dataset JSON',
      detail: 'Most recent portability action completed successfully.',
      tone: 'neutral',
    },
    {
      id: 'most-recent-restore',
      label: 'Most recent restore event',
      value: 'No recent restore',
      detail: 'No recent restore has altered current local state.',
      tone: 'neutral',
    },
    {
      id: 'active-warning',
      label: 'Integrity summary',
      value: 'No active integrity warning',
      detail: 'If trust becomes uncertain, protected recovery state must take over.',
      tone: 'success',
    },
  ],
  backup: {
    introduction:
      'Backups protect the full local memory of Veradmin, including settings metadata needed for recovery.',
    destinationSummary: 'Configured destination: runtime-backup-path',
    includesSummary:
      'Includes local database history, settings metadata, rule-profile references, and administrative records required for full restore.',
    health: 'healthy',
    records: [
      {
        id: 'backup-2026-04-10-0815',
        createdAtLabel: '2026-04-10 08:15',
        backupType: 'manual',
        statusLabel: 'Available',
        tone: 'success',
        appVersion: 'runtime-app-version',
        schemaVersion: 'runtime-schema-version',
        backupFormatVersion: 'runtime-backup-format-version',
        sizeLabel: '18.4 MB',
        note: 'Pre-maintenance manual backup',
        restorable: true,
      },
      {
        id: 'backup-2026-04-09-1910',
        createdAtLabel: '2026-04-09 19:10',
        backupType: 'scheduled',
        statusLabel: 'Available',
        tone: 'success',
        appVersion: 'runtime-app-version',
        schemaVersion: 'runtime-schema-version',
        backupFormatVersion: 'runtime-backup-format-version',
        sizeLabel: '18.2 MB',
        restorable: true,
      },
      {
        id: 'backup-2026-04-07-1645',
        createdAtLabel: '2026-04-07 16:45',
        backupType: 'safety-pre-restore',
        statusLabel: 'Available',
        tone: 'info',
        appVersion: 'runtime-app-version',
        schemaVersion: 'runtime-schema-version',
        backupFormatVersion: 'runtime-backup-format-version',
        sizeLabel: '17.9 MB',
        note: 'Automatic safety backup before restore',
        restorable: true,
      },
      {
        id: 'backup-legacy-review',
        createdAtLabel: '2025-12-18 10:32',
        backupType: 'manual',
        statusLabel: 'Review required',
        tone: 'warning',
        appVersion: 'legacy-app-version',
        schemaVersion: 'legacy-schema-version',
        backupFormatVersion: 'legacy-backup-format-version',
        sizeLabel: '16.0 MB',
        note: 'Older backup retained for inspection',
        restorable: false,
      },
    ],
  },
  restore: {
    introduction:
      'Restore never runs blindly. Select a backup to inspect compatibility, impact, and safety-backup behavior before anything changes.',
    availableBackups: [
      {
        id: 'backup-2026-04-10-0815',
        createdAtLabel: '2026-04-10 08:15',
        backupType: 'manual',
        statusLabel: 'Available',
        tone: 'success',
        appVersion: 'runtime-app-version',
        schemaVersion: 'runtime-schema-version',
        backupFormatVersion: 'runtime-backup-format-version',
        sizeLabel: '18.4 MB',
        note: 'Pre-maintenance manual backup',
        restorable: true,
      },
      {
        id: 'backup-legacy-review',
        createdAtLabel: '2025-12-18 10:32',
        backupType: 'manual',
        statusLabel: 'Review required',
        tone: 'warning',
        appVersion: 'legacy-app-version',
        schemaVersion: 'legacy-schema-version',
        backupFormatVersion: 'legacy-backup-format-version',
        sizeLabel: '16.0 MB',
        note: 'Older backup retained for inspection',
        restorable: false,
      },
    ],
    previews: {
      'backup-2026-04-10-0815': {
        sourceBackupId: 'backup-2026-04-10-0815',
        sourceLabel: 'Manual backup from 2026-04-10 08:15',
        timestampLabel: '2026-04-10 08:15',
        backupType: 'manual',
        appVersion: 'runtime-app-version',
        schemaVersion: 'runtime-schema-version',
        backupFormatVersion: 'runtime-backup-format-version',
        compatibilityStatus: 'compatible',
        compatibilityLabel: 'Compatible',
        compatibilityDetail:
          'Version metadata matches the current supported restore path. Direct restore is allowed.',
        requiresPostRestoreMigration: false,
        affectedStateSummary: [
          'Current local database state will be replaced by the selected backup content.',
          'A safety backup of current local state will be created before restore begins.',
          'Recent operations history will record both the safety backup and restore result.',
        ],
        willCreateSafetyBackup: true,
        currentStatePreservedUntilConfirm: true,
        confirmationLabel: 'Create safety backup and restore',
        cancelLabel: 'Cancel restore',
      },
      'backup-legacy-review': {
        sourceBackupId: 'backup-legacy-review',
        sourceLabel: 'Legacy manual backup from 2025-12-18 10:32',
        timestampLabel: '2025-12-18 10:32',
        backupType: 'manual',
        appVersion: 'legacy-app-version',
        schemaVersion: 'legacy-schema-version',
        backupFormatVersion: 'legacy-backup-format-version',
        compatibilityStatus: 'review-required',
        compatibilityLabel: 'Review required',
        compatibilityDetail:
          'Older version metadata is visible but not sufficient for direct trusted restore from the current runtime without manual compatibility review.',
        requiresPostRestoreMigration: true,
        affectedStateSummary: [
          'Current local state would be affected if restore were later approved.',
          'Direct restore is blocked until compatibility is explicitly resolved.',
        ],
        willCreateSafetyBackup: true,
        currentStatePreservedUntilConfirm: true,
        blockedReason:
          'Restore is blocked because this backup requires compatibility review before a safe path can be confirmed.',
        confirmationLabel: 'Restore blocked',
        cancelLabel: 'Cancel restore',
      },
    },
  },
  export: {
    introduction:
      'Exports are portability artifacts, not hidden side effects. The operator always chooses scope, format, and destination first.',
    presets: [
      {
        id: 'full-dataset',
        label: 'Full dataset',
        scopeSummary: 'Includes accounts, journal, payouts, alerts, notes, settings summary, and administrative history.',
        inclusionSummary: 'Recommended for external archival or structured review.',
        destinationSummary: 'Last destination: runtime-export-path/full-dataset',
        formatOptions: [
          { id: 'csv', label: 'CSV' },
          { id: 'json', label: 'JSON' },
        ],
        lastExportLabel: 'Yesterday • JSON',
        cautionText: 'Broad export includes meaningful operational history.',
      },
      {
        id: 'journal-date-range',
        label: 'Journal date range',
        scopeSummary: 'Exports journal entries and related metadata for the chosen date range.',
        inclusionSummary: 'Useful for review, accounting support, or external analysis.',
        destinationSummary: 'Last destination: runtime-export-path/journal-range',
        formatOptions: [
          { id: 'csv', label: 'CSV' },
          { id: 'json', label: 'JSON' },
        ],
      },
      {
        id: 'payouts-only',
        label: 'Payouts only',
        scopeSummary: 'Exports payout history and relevant administrative status fields.',
        inclusionSummary: 'Focused administrative portability.',
        destinationSummary: 'Last destination: runtime-export-path/payouts',
        formatOptions: [
          { id: 'csv', label: 'CSV' },
          { id: 'json', label: 'JSON' },
        ],
      },
    ],
  },
  versionPanel: {
    title: 'Version and compatibility',
    lines: [
      { label: 'App version', value: 'runtime-app-version' },
      { label: 'Schema version', value: 'runtime-schema-version' },
      { label: 'Backup format version', value: 'runtime-backup-format-version' },
      { label: 'Export format version', value: 'runtime-export-format-version' },
      { label: 'Last migration outcome', value: 'Successful' },
    ],
    compatibilityNote:
      'Compatibility uses explicit app, schema, and backup-format metadata. App version alone is never treated as enough.',
  },
  operations: [
    {
      id: 'op-restore-blocked-legacy',
      occurredAtLabel: '2026-04-10 08:28',
      typeLabel: 'Restore review',
      outcome: 'blocked',
      tone: 'warning',
      summary: 'Legacy backup restore was blocked before overwrite.',
      detail: 'Current local state remained in place because compatibility review was required.',
    },
    {
      id: 'op-backup-created',
      occurredAtLabel: '2026-04-10 08:15',
      typeLabel: 'Backup created',
      outcome: 'succeeded',
      tone: 'success',
      summary: 'Manual full backup completed successfully.',
      detail: 'Backup metadata recorded current app/schema/format values.',
    },
    {
      id: 'op-export-succeeded',
      occurredAtLabel: '2026-04-09 18:02',
      typeLabel: 'Export created',
      outcome: 'succeeded',
      tone: 'success',
      summary: 'Full dataset JSON export completed.',
      detail: 'Portability artifact was written to the configured export destination.',
    },
    {
      id: 'op-safety-backup-failure-example',
      occurredAtLabel: '2026-04-07 16:39',
      typeLabel: 'Safety backup failure',
      outcome: 'warning',
      tone: 'warning',
      summary: 'A pre-restore safety backup failed and restore did not proceed.',
      detail: 'No overwrite occurred because Veradmin refused to weaken recoverability.',
    },
  ],
};
