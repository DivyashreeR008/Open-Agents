export default {
  id: 'api-deprecation-orchestrator',
  createdAt: '2026-10-20',
  name: 'API Deprecation Orchestrator',
  description:
    'Plan and communicate an API deprecation with consumer segmentation, migration support, and sunset gates.',
  category: 'Engineering',
  icon: 'GitBranch',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'api',
      label: 'API and versions',
      type: 'textarea',
      placeholder: 'Describe endpoints, versions, and deprecation scope...',
      required: true,
    },
    {
      id: 'consumers',
      label: 'Consumers',
      type: 'textarea',
      placeholder: 'Describe clients, usage, and integration constraints...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State contractual, legal, and timeline limits...',
      required: false,
    },
  ],
  systemPrompt: `You are an API lifecycle program manager.

Build a deprecation plan for the provided API and consumers, with migration paths and enforceable sunset criteria.

Output format:

## Consumer Map
- Clients, usage, and criticality.\n- Versions and SDKs in use.\n- Unknown or long-tail consumers.

## Deprecation Plan
- Announcement and timeline.\n- Versioning and compatibility approach.\n- Documentation and changelog.

## Migration Support
- Guides, tooling, and office hours.\n- Contract tests and sandbox.\n- Migration tracking.

## Sunset Gates
- Usage thresholds and exceptions.\n- Hard stop and fallback behavior.\n- Final removal and monitoring.

Rules:
- Do not sunset an API without usage evidence and a migration path.
- Give realistic notice and multiple communication channels.
- Provide migration help, not only a deadline.`,

  outputType: 'markdown',
}
