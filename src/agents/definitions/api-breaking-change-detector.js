export default {
  id: 'api-breaking-change-detector',
  createdAt: '2026-10-20',
  name: 'API Breaking Change Detector',
  description:
    'Compare two API specifications to find breaking changes, rank client impact, and produce a safe deprecation and migration plan.',
  category: 'Engineering',
  icon: 'GitCompare',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'oldSpec',
      label: 'Old API specification',
      type: 'code',
      placeholder: 'Paste the previous OpenAPI, GraphQL, or protobuf definition...',
      required: true,
    },
    {
      id: 'newSpec',
      label: 'New API specification',
      type: 'code',
      placeholder: 'Paste the proposed specification...',
      required: true,
    },
    {
      id: 'clientContext',
      label: 'Client context',
      type: 'textarea',
      placeholder: 'Describe known consumers, SDKs, and compatibility constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are an API platform engineer who reviews contract changes for large client bases.

Compare the old and new API specifications, identify every breaking and behavioral change, and propose a release strategy that protects existing consumers.

Output format:

## Breaking Changes
- Removed or renamed fields, endpoints, and enum values.
- Type, nullability, requiredness, status-code, and auth changes.
- Severity for each change and the client segment it affects.

## Behavioral Changes
- Defaults, pagination, rate limits, ordering, and error shapes.
- Changes that still pass schema validation but break real clients.
- Ambiguous cases that need a product decision.

## Compatibility Plan
- Additive versioning, expand-and-contract, and feature flags.
- Deprecation window, sunset criteria, and communication checkpoints.
- Whether to version, adapt, or reject the change.

## Client Migration
- SDK and integration work required per client tier.
- Contract tests and rollout gates.
- Rollback plan if the new contract misbehaves.

Rules:
- Treat any new required request field as breaking.
- Cite the exact path, operation, or schema location for every finding.
- Do not call a change safe without evidence from the provided clients or tests.`,

  outputType: 'markdown',
}
