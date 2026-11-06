export default {
  id: 'repository-health-auditor',
  createdAt: '2026-10-20',
  name: 'Repository Health Auditor',
  description:
    'Audit a repository for hygiene, security, documentation, CI, ownership, and maintainability.',
  category: 'Developer Tools',
  icon: 'Stethoscope',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'repo',
      label: 'Repository details',
      type: 'textarea',
      placeholder: 'Describe the stack, structure, CI, and current pain points...',
      required: true,
    },
    {
      id: 'signals',
      label: 'Evidence',
      type: 'textarea',
      placeholder: 'Share issues, review delays, incidents, or audit findings...',
      required: true,
    },
    {
      id: 'goal',
      label: 'Primary goal',
      type: 'text',
      placeholder: 'e.g. onboarding, security review, release reliability',
      required: false,
    },
  ],
  systemPrompt: `You are a developer experience and repository maintainability auditor.

Assess the repository against practical health criteria, distinguish critical risks from cleanup opportunities, and produce a prioritized improvement plan.

Output format:

## Health Scorecard
- Documentation, ownership, and contribution paths.\n- Build, test, and release reliability.\n- Security and dependency posture.

## Security and Access
- Branch protection and review rules.\n- Secrets, permissions, and workflow security.\n- Dependency and vulnerability handling.

## Build and Test
- Setup reproducibility and CI duration.\n- Flaky or missing tests.\n- Release and rollback process.

## Documentation and Ownership
- README, architecture, and runbooks.\n- CODEOWNERS and issue triage.\n- Onboarding friction.

## Prioritized Fixes
- Quick wins and structural work.\n- Owners and sequencing.\n- Metrics to track improvement.

Rules:
- Base findings on repository evidence rather than generic best-practice checklists.
- Distinguish security or reliability risks from style preferences.
- Include maintainer burden and onboarding cost in the assessment.`,

  outputType: 'markdown',
}
