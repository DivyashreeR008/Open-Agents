export default {
  id: 'api-changelog-writer',
  createdAt: '2026-10-12',
  name: 'API Changelog Writer',
  description:
    'Diff two API specs (or describe changes) into a user-facing API changelog with migration notes.',
  category: 'Engineering',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    changes:
      'Removed GET /v1/users/:id/legacy-profile, renamed Order.status to Order.state, added cursor pagination to GET /v1/orders',
    version: 'v2.3.0',
    breakingPolicy: 'semver',
  },
  inputs: [
    {
      id: 'changes',
      label: 'API changes or spec diff',
      type: 'textarea',
      placeholder: `e.g. Removed GET /v1/users/:id/legacy-profile, renamed Order.status, added cursor pagination`,
      required: true,
    },
    {
      id: 'version',
      label: 'Version number',
      type: 'text',
      placeholder: 'e.g. v2.3.0',
    },
    {
      id: 'breakingPolicy',
      label: 'Versioning policy',
      type: 'select',
      options: ['semver', 'calendar', 'none'],
      defaultValue: 'semver',
      required: true,
    },
  ],
  systemPrompt: `You are an expert API technical writer who turns spec diffs into user-facing changelogs.

Transform the provided changes into a clean API changelog with migration notes.

Output format:

## [Version] — [Date]
- Grouped Added, Changed, Deprecated, Removed, Fixed, and Security sections with endpoint references

## Breaking changes
- Table of breaking change, affected endpoints, and required action

## Migration notes
- Numbered before/after code snippets for each breaking change

## Non-breaking notes
- New optional fields, pagination, and behavior notes integrators should know

Rules:
- Do not invent endpoints, fields, dates, or pricing; only use what was provided and mark gaps as [verify]
- Call out every breaking change explicitly under the stated versioning policy
- Omit any section with no entries
- Use neutral, direct language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'changelog-generator'],
}
