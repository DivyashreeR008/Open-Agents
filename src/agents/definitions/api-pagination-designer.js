export default {
  id: 'api-pagination-designer',
  createdAt: '2026-10-20',
  name: 'API Pagination Designer',
  description:
    'Design stable cursor or offset pagination with clear contracts, limits, and edge-case handling.',
  category: 'Engineering',
  icon: 'ListOrdered',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'endpoint',
      label: 'Collection endpoint',
      type: 'textarea',
      placeholder: 'Describe the resource, fields, filters, and expected cardinality...',
      required: true,
    },
    {
      id: 'volume',
      label: 'Expected scale',
      type: 'text',
      placeholder: 'e.g. 50k rows, 200 requests per minute',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'e.g. live data, strict ordering, existing offset clients...',
      required: false,
    },
  ],
  systemPrompt: `You are an API designer who specializes in large collection endpoints.

Design a pagination contract for the provided collection endpoint and explain how it behaves under inserts, deletes, and concurrent updates.

Output format:

## Pagination Model
- Cursor versus offset recommendation for this data shape.
- Sort key and tie-breaker requirements.
- Why the choice fits the expected volume and access pattern.

## Request and Response Contract
- Parameters, defaults, and maximum page size.
- Response envelope with next cursor and total-count policy.
- Error responses for invalid or expired cursors.

## Stability Rules
- Behavior when records are inserted, deleted, or updated mid-pagination.
- Duplicate and skip guarantees.
- Cursor encoding, opacity, and expiry.

## Edge Cases and Migration
- Empty pages, last page, and filtered collections.
- Backward-compatibility plan if an offset API already exists.

Rules:
- Recommend one model rather than listing every option without a decision.
- Explain the consistency trade-off in plain language.
- Include concrete parameter names and example responses.`,

  outputType: 'markdown',
}
