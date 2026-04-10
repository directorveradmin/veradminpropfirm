export type EnvironmentBadge =
  | 'local'
  | 'development'
  | 'staging'
  | 'release-candidate'
  | 'stable';

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'critical';

export type SettingsSectionId =
  | 'general'
  | 'fleet-defaults'
  | 'rule-profiles'
  | 'alerts-notifications'
  | 'backups-restore'
  | 'exports-portability'
  | 'system-diagnostics'
  | 'about-version';

export type SettingControlKind =
  | 'toggle'
  | 'select'
  | 'text'
  | 'textarea'
  | 'number'
  | 'status'
  | 'action'
  | 'link';

export type ApplyBehavior =
  | 'applies-immediately'
  | 'staged-until-save'
  | 'action-only';

export interface OptionVM {
  readonly value: string;
  readonly label: string;
}

export interface FieldMessageVM {
  readonly tone: Tone;
  readonly text: string;
}

export interface SettingControlVM {
  readonly id: string;
  readonly kind: SettingControlKind;
  readonly label: string;
  readonly description?: string;
  readonly valueText?: string;
  readonly placeholder?: string;
  readonly options?: readonly OptionVM[];
  readonly applyBehavior: ApplyBehavior;
  readonly disabled?: boolean;
  readonly disabledReason?: string;
  readonly messages?: readonly FieldMessageVM[];
  readonly primaryActionLabel?: string;
  readonly secondaryActionLabel?: string;
}

export interface SectionCalloutVM {
  readonly tone: Tone;
  readonly title: string;
  readonly detail: string;
  readonly nextStep?: string;
}

export interface SettingsSectionVM {
  readonly id: SettingsSectionId;
  readonly navLabel: string;
  readonly title: string;
  readonly summary: string;
  readonly intro?: string;
  readonly statusTone?: Tone;
  readonly controls: readonly SettingControlVM[];
  readonly quietStateText?: string;
  readonly callout?: SectionCalloutVM;
}

export interface QuickActionVM {
  readonly id: string;
  readonly label: string;
  readonly emphasis: 'secondary' | 'primary' | 'danger';
  readonly description?: string;
}

export interface EntrySummaryVM {
  readonly title: string;
  readonly value: string;
  readonly detail: string;
  readonly tone: Tone;
  readonly primaryActionLabel: string;
  readonly secondaryActionLabel?: string;
  readonly warningText?: string;
}

export interface VersionLineVM {
  readonly label: string;
  readonly value: string;
}

export interface SettingsHeaderVM {
  readonly title: string;
  readonly summary: string;
  readonly environmentLabel: string;
  readonly environmentTone: Tone;
  readonly versionLabel: string;
  readonly dirtyStateLabel: string;
  readonly hasUnsavedChanges: boolean;
  readonly quickActions: readonly QuickActionVM[];
}

export interface DiagnosticsSummaryVM {
  readonly title: string;
  readonly tone: Tone;
  readonly detail: string;
  readonly nextStep?: string;
}

export interface SettingsFooterVM {
  readonly versionLines: readonly VersionLineVM[];
  readonly integritySummary: string;
}

export interface SettingsScreenVM {
  readonly header: SettingsHeaderVM;
  readonly diagnosticsSummary?: DiagnosticsSummaryVM;
  readonly sections: readonly SettingsSectionVM[];
  readonly backupEntry: EntrySummaryVM;
  readonly exportEntry: EntrySummaryVM;
  readonly footer: SettingsFooterVM;
}

export const SETTINGS_SECTION_ORDER: readonly SettingsSectionId[] = [
  'general',
  'fleet-defaults',
  'rule-profiles',
  'alerts-notifications',
  'backups-restore',
  'exports-portability',
  'system-diagnostics',
  'about-version',
] as const;

export const settingsFixture: SettingsScreenVM = {
  header: {
    title: 'Settings',
    summary:
      'Calm administrative controls for defaults, protection entry points, diagnostics, and long-term local trust.',
    environmentLabel: 'Local desktop',
    environmentTone: 'info',
    versionLabel: 'Runtime version surface',
    dirtyStateLabel: '2 staged changes',
    hasUnsavedChanges: true,
    quickActions: [
      {
        id: 'save-settings',
        label: 'Save changes',
        emphasis: 'primary',
        description: 'Commit staged administrative defaults.',
      },
      {
        id: 'restore-section-defaults',
        label: 'Restore section defaults',
        emphasis: 'secondary',
        description: 'Reset the currently selected settings section.',
      },
      {
        id: 'open-backup-center',
        label: 'Open Backup Center',
        emphasis: 'secondary',
        description: 'Continue into protection, restore, and export tools.',
      },
    ],
  },
  diagnosticsSummary: {
    title: 'Diagnostics summary available',
    tone: 'success',
    detail:
      'Local integrity is currently confirmed. The latest backup summary and migration summary are readable.',
    nextStep: 'Open System and Diagnostics for full version and path details.',
  },
  sections: [
    {
      id: 'general',
      navLabel: 'General',
      title: 'General',
      summary: 'Lightweight application preferences that affect interface behavior rather than domain truth.',
      intro:
        'Display-oriented settings may apply immediately. They should still report success or failure explicitly.',
      statusTone: 'neutral',
      controls: [
        {
          id: 'default-landing-surface',
          kind: 'select',
          label: 'Default landing surface',
          description: 'Choose which top-level surface opens first when Veradmin launches.',
          valueText: 'Command Center',
          options: [
            { value: 'command-center', label: 'Command Center' },
            { value: 'accounts', label: 'Accounts' },
            { value: 'journal', label: 'Journal' },
            { value: 'settings', label: 'Settings' },
          ],
          applyBehavior: 'staged-until-save',
          messages: [
            {
              tone: 'info',
              text: 'This affects launch behavior only. It does not change tactical truth.',
            },
          ],
        },
        {
          id: 'date-time-format',
          kind: 'select',
          label: 'Date and time display',
          description: 'Choose the display format used across administrative and tactical timestamps.',
          valueText: '24-hour • YYYY-MM-DD',
          options: [
            { value: 'iso24', label: '24-hour • YYYY-MM-DD' },
            { value: 'locale24', label: '24-hour • locale order' },
            { value: 'locale12', label: '12-hour • locale order' },
          ],
          applyBehavior: 'applies-immediately',
          messages: [
            {
              tone: 'success',
              text: 'Applies immediately.',
            },
          ],
        },
        {
          id: 'visual-density',
          kind: 'select',
          label: 'Interface density',
          description: 'Controls how compact administrative tables and summary cards appear.',
          valueText: 'Standard',
          options: [
            { value: 'compact', label: 'Compact' },
            { value: 'standard', label: 'Standard' },
          ],
          applyBehavior: 'applies-immediately',
          messages: [
            {
              tone: 'success',
              text: 'Applies immediately.',
            },
          ],
        },
        {
          id: 'return-to-last-admin-section',
          kind: 'toggle',
          label: 'Return to last visited administrative section',
          description: 'When enabled, Settings and Backup Center reopen where the operator last left them.',
          valueText: 'Enabled',
          applyBehavior: 'applies-immediately',
          messages: [
            {
              tone: 'success',
              text: 'Applies immediately.',
            },
          ],
        },
      ],
      quietStateText: 'General preferences remain at defaults until changed.',
    },
    {
      id: 'fleet-defaults',
      navLabel: 'Fleet Defaults',
      title: 'Fleet Defaults',
      summary:
        'Defaults that reduce repetitive setup without overriding account-level truth.',
      intro:
        'These values are staged until Save. They apply to future defaults and overlays, not historical records.',
      statusTone: 'warning',
      controls: [
        {
          id: 'account-naming-pattern',
          kind: 'text',
          label: 'Default account naming pattern',
          description: 'Pattern used when creating new accounts or examples.',
          valueText: '{firm}-{size}-{sequence}',
          placeholder: '{firm}-{size}-{sequence}',
          applyBehavior: 'staged-until-save',
        },
        {
          id: 'default-session-labels',
          kind: 'textarea',
          label: 'Default session labels',
          description: 'Comma-separated labels offered first in note and timeline flows.',
          valueText: 'London, NY AM, NY PM',
          applyBehavior: 'staged-until-save',
        },
        {
          id: 'default-note-categories',
          kind: 'textarea',
          label: 'Default note categories',
          description: 'Seed categories for low-friction journaling and review.',
          valueText: 'Execution, Discipline, Admin, Payout',
          applyBehavior: 'staged-until-save',
        },
        {
          id: 'news-restriction-window',
          kind: 'number',
          label: 'Default news restriction overlay window (minutes)',
          description:
            'Operator overlay applied to future setups when news restriction guidance is tracked globally.',
          valueText: '30',
          applyBehavior: 'staged-until-save',
          messages: [
            {
              tone: 'warning',
              text: 'This changes future default overlays, not past history.',
            },
          ],
        },
      ],
      quietStateText: 'No fleet defaults have diverged from baseline.',
    },
    {
      id: 'rule-profiles',
      navLabel: 'Rule Profiles',
      title: 'Rule Profiles',
      summary:
        'Deliberate entry points into governing profile administration and version review.',
      intro:
        'Rule profiles govern interpretation. Editing must remain deliberate and traceable.',
      statusTone: 'neutral',
      controls: [
        {
          id: 'profile-count',
          kind: 'status',
          label: 'Active rule profiles',
          description: 'Current profile inventory across supported firms/classes.',
          valueText: '8 profiles • 2 custom',
          applyBehavior: 'action-only',
        },
        {
          id: 'preferred-profile-map',
          kind: 'status',
          label: 'Preferred profile assignments',
          description: 'Shows the currently preferred profile for each supported firm/class.',
          valueText: 'Available',
          applyBehavior: 'action-only',
        },
        {
          id: 'open-profile-admin',
          kind: 'link',
          label: 'Open profile administration',
          description: 'Inspect versions, duplicate a profile, or set preferred assignments.',
          valueText: 'Go to profile admin',
          applyBehavior: 'action-only',
          primaryActionLabel: 'Open profiles',
        },
        {
          id: 'profile-version-history',
          kind: 'link',
          label: 'Profile version history',
          description:
            'Review profile-version changes so historical interpretation remains explainable.',
          valueText: 'History available',
          applyBehavior: 'action-only',
          primaryActionLabel: 'View history',
        },
      ],
      quietStateText: 'Rule profile behavior is unchanged from the last saved state.',
    },
    {
      id: 'alerts-notifications',
      navLabel: 'Alerts and Notifications',
      title: 'Alerts and Notifications',
      summary:
        'Presentation tuning for reminders and desktop notifications without weakening core doctrine.',
      intro:
        'Presentation settings can improve attention handling, but critical safety signals remain protected.',
      statusTone: 'warning',
      controls: [
        {
          id: 'desktop-notifications',
          kind: 'toggle',
          label: 'Desktop notifications',
          description: 'Allow Veradmin to raise desktop-level notifications for supported alert categories.',
          valueText: 'Enabled',
          applyBehavior: 'staged-until-save',
        },
        {
          id: 'suppress-low-priority',
          kind: 'toggle',
          label: 'Quiet low-priority reminders',
          description: 'Reduce noise for reminders that do not carry immediate operational danger.',
          valueText: 'Enabled',
          applyBehavior: 'staged-until-save',
        },
        {
          id: 'show-resolved-alerts',
          kind: 'toggle',
          label: 'Show resolved alerts by default',
          description: 'Controls default list visibility only.',
          valueText: 'Disabled',
          applyBehavior: 'staged-until-save',
        },
        {
          id: 'group-low-severity-alerts',
          kind: 'toggle',
          label: 'Group lower-severity alerts',
          description: 'Groups low-urgency reminders into quieter clusters in list surfaces.',
          valueText: 'Enabled',
          applyBehavior: 'staged-until-save',
        },
        {
          id: 'critical-alert-callout',
          kind: 'status',
          label: 'Critical alert safeguard',
          description: 'Critical safety signals cannot be fully suppressed from the product.',
          valueText: 'Protected by doctrine',
          applyBehavior: 'action-only',
          messages: [
            {
              tone: 'warning',
              text: 'Presentation preferences cannot silence core safety truth.',
            },
          ],
        },
      ],
      quietStateText: 'Notification behavior remains at baseline defaults.',
    },
    {
      id: 'backups-restore',
      navLabel: 'Backups and Restore',
      title: 'Backups and Restore',
      summary:
        'Protection summary and entry point into the dedicated recovery surface.',
      intro:
        'Routine backup creation is exposed here, while full restore work stays in the Backup Center.',
      statusTone: 'success',
      controls: [
        {
          id: 'last-backup',
          kind: 'status',
          label: 'Last successful backup',
          description: 'Most recent protection event visible from Settings.',
          valueText: 'Today • 08:15',
          applyBehavior: 'action-only',
        },
        {
          id: 'backup-health',
          kind: 'status',
          label: 'Protection health',
          description: 'Summary of backup recency, destination availability, and recent failures.',
          valueText: 'Healthy',
          applyBehavior: 'action-only',
        },
        {
          id: 'create-backup-shortcut',
          kind: 'action',
          label: 'Create backup now',
          description: 'Create a fresh manual backup without leaving Settings.',
          valueText: 'Shortcut',
          applyBehavior: 'action-only',
          primaryActionLabel: 'Create backup now',
        },
        {
          id: 'open-backup-center-link',
          kind: 'link',
          label: 'Open Backup Center',
          description: 'Continue into full restore preview, export, and operations history.',
          valueText: 'Protection and recovery tools',
          applyBehavior: 'action-only',
          primaryActionLabel: 'Open Backup Center',
        },
      ],
      quietStateText: 'Backup summary is healthy and current.',
    },
    {
      id: 'exports-portability',
      navLabel: 'Exports and Data Portability',
      title: 'Exports and Data Portability',
      summary:
        'Portability summary and clear entry point into scoped export workflows.',
      intro:
        'Exports remain explicit, structured, and separate from backup fidelity.',
      statusTone: 'neutral',
      controls: [
        {
          id: 'supported-formats',
          kind: 'status',
          label: 'Supported formats',
          description: 'Structured formats currently supported by the product.',
          valueText: 'CSV • JSON',
          applyBehavior: 'action-only',
        },
        {
          id: 'most-recent-export',
          kind: 'status',
          label: 'Most recent export',
          description: 'Last successfully completed export operation.',
          valueText: 'Yesterday • Full dataset JSON',
          applyBehavior: 'action-only',
        },
        {
          id: 'quick-export',
          kind: 'action',
          label: 'Quick export',
          description: 'Start a scoped export flow with visible review before execution.',
          valueText: 'Shortcut',
          applyBehavior: 'action-only',
          primaryActionLabel: 'Start export',
        },
      ],
      quietStateText: 'No portability issues are currently flagged.',
    },
    {
      id: 'system-diagnostics',
      navLabel: 'System and Diagnostics',
      title: 'System and Diagnostics',
      summary:
        'Version clarity, storage summaries, integrity status, and recovery-aware diagnostics.',
      intro:
        'This section is for a serious operator, not only a developer. Scope and severity should stay readable.',
      statusTone: 'success',
      controls: [
        {
          id: 'app-version',
          kind: 'status',
          label: 'App version',
          valueText: 'runtime-app-version',
          applyBehavior: 'action-only',
        },
        {
          id: 'schema-version',
          kind: 'status',
          label: 'Schema version',
          valueText: 'runtime-schema-version',
          applyBehavior: 'action-only',
        },
        {
          id: 'backup-format-version',
          kind: 'status',
          label: 'Backup format version',
          valueText: 'runtime-backup-format-version',
          applyBehavior: 'action-only',
        },
        {
          id: 'export-format-version',
          kind: 'status',
          label: 'Export format version',
          valueText: 'runtime-export-format-version',
          applyBehavior: 'action-only',
        },
        {
          id: 'last-migration-outcome',
          kind: 'status',
          label: 'Last migration outcome',
          valueText: 'Successful',
          applyBehavior: 'action-only',
          messages: [
            {
              tone: 'success',
              text: 'No migration warning is currently active.',
            },
          ],
        },
        {
          id: 'diagnostics-entry',
          kind: 'link',
          label: 'Open diagnostics',
          description: 'Inspect recent administrative events, warnings, and recovery details.',
          valueText: 'Diagnostics available',
          applyBehavior: 'action-only',
          primaryActionLabel: 'Open diagnostics',
        },
      ],
      quietStateText: 'System diagnostics are healthy and readable.',
    },
    {
      id: 'about-version',
      navLabel: 'About and Version',
      title: 'About and Version',
      summary:
        'Maintenance, version identity, and documentation context.',
      intro:
        'Veradmin should feel like a maintained operational tool rather than a floating prototype.',
      statusTone: 'neutral',
      controls: [
        {
          id: 'product-name',
          kind: 'status',
          label: 'Product',
          valueText: 'Veradmin',
          applyBehavior: 'action-only',
        },
        {
          id: 'release-channel',
          kind: 'status',
          label: 'Release channel',
          valueText: 'runtime-release-channel',
          applyBehavior: 'action-only',
        },
        {
          id: 'open-docs',
          kind: 'link',
          label: 'Documentation entry',
          valueText: 'Available',
          applyBehavior: 'action-only',
          primaryActionLabel: 'Open docs',
        },
        {
          id: 'open-changelog',
          kind: 'link',
          label: 'Changelog entry',
          valueText: 'Available',
          applyBehavior: 'action-only',
          primaryActionLabel: 'Open changelog',
        },
      ],
      quietStateText: 'Product metadata is present and current.',
    },
  ],
  backupEntry: {
    title: 'Backups and Restore',
    value: 'Healthy protection state',
    detail:
      'Last successful backup was created today. Restore remains a dedicated protected workflow.',
    tone: 'success',
    primaryActionLabel: 'Create backup now',
    secondaryActionLabel: 'Open Backup Center',
    warningText:
      'Restore is not executed from Settings. It must pass through preview, compatibility review, and safety-backup checks.',
  },
  exportEntry: {
    title: 'Exports and Data Portability',
    value: 'CSV and JSON available',
    detail:
      'Exports remain intentional and scoped. The operator chooses what is included before files are created.',
    tone: 'neutral',
    primaryActionLabel: 'Start export',
    secondaryActionLabel: 'Open Backup Center',
  },
  footer: {
    versionLines: [
      { label: 'App version', value: 'runtime-app-version' },
      { label: 'Schema version', value: 'runtime-schema-version' },
      { label: 'Backup format', value: 'runtime-backup-format-version' },
      { label: 'Export format', value: 'runtime-export-format-version' },
      { label: 'Release channel', value: 'runtime-release-channel' },
    ],
    integritySummary:
      'Administrative integrity currently confirmed. If trust becomes uncertain, Settings should stop pretending normal operation is safe.',
  },
};
