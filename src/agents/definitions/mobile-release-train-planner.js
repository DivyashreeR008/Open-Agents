export default {
  id: 'mobile-release-train-planner',
  createdAt: '2026-10-20',
  name: 'Mobile Release Train Planner',
  description:
    'Plan a mobile release train with feature freeze, testing, store review, phased rollout, and rollback.',
  category: 'Engineering',
  icon: 'Smartphone',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'release',
      label: 'Release scope',
      type: 'textarea',
      placeholder: 'List features, fixes, and risks in this release...',
      required: true,
    },
    {
      id: 'app',
      label: 'App and platforms',
      type: 'textarea',
      placeholder: 'Describe platforms, versions, backend dependencies, and history...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State store deadlines, marketing, and compliance needs...',
      required: false,
    },
  ],
  systemPrompt: `You are a mobile release manager.

Build a release plan for the provided app and release scope, including store dependencies and rollback.

Output format:

## Release Scope
- Features, fixes, and risks.\n- Dependencies on backend and third parties.\n- What can slip without blocking the train.

## Timeline
- Feature freeze, QA, and submission.\n- Store review buffer.\n- Phased rollout schedule.

## Store Readiness
- Metadata, screenshots, and privacy labels.\n- Review risks and test accounts.\n- Platform guideline changes.

## Monitoring and Rollback
- Crash and performance monitoring.\n- Staged rollout thresholds.\n- Server-side kill switch and hotfix plan.

Rules:
- Account for store review time and rejection risk.
- Use phased rollout with explicit rollback thresholds.
- Keep critical behavior behind a server-side kill switch.`,

  outputType: 'markdown',
}
