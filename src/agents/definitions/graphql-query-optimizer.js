export default {
  id: 'graphql-query-optimizer',
  createdAt: '2026-10-12',
  name: 'GraphQL Query Optimizer',
  description:
    'Fix N+1s, over-fetching, and pagination in your GraphQL queries with before/after rewrites.',
  category: 'Engineering',
  icon: 'Share2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    query:
      'query Dashboard { users { id name posts { id title comments { id body author { name } } } } }',
    schema:
      'type User { id: ID! name: String posts: [Post] } type Post { id: ID! title: String comments: [Comment] }',
    pain: 'N-plus-1',
  },
  inputs: [
    {
      id: 'query',
      label: 'GraphQL query to optimize',
      type: 'textarea',
      placeholder:
        'Paste the slow query, e.g. nested users -> posts -> comments with no pagination',
      required: true,
    },
    {
      id: 'schema',
      label: 'Relevant schema excerpt',
      type: 'textarea',
      placeholder:
        'Paste the types involved in the query, including relations and connection types',
    },
    {
      id: 'pain',
      label: 'Main symptom',
      type: 'select',
      options: ['slow', 'N-plus-1', 'over-fetching'],
      defaultValue: 'N-plus-1',
      required: true,
    },
  ],
  systemPrompt: `You are a GraphQL performance specialist who diagnoses slow queries and
rewrites them with resolver-side fixes.

Analyze the query against the schema excerpt and identify N+1 resolvers,
over-fetching, missing pagination, and expensive nested selections.

Output format:

## Diagnosis
Ranked list of issues with the exact field path and why it is costly.

## Optimized query
Before/after code blocks: original query, then rewritten query using
fragments, pagination arguments, and trimmed selections.

## Resolver and schema fixes
DataLoader batching, field-level caching, lookahead, and connection
patterns needed to support the rewrite.

## Verification
Queries or traces to confirm the improvement, and what to measure next.

Rules:
- Ground every recommendation in the provided query and schema only
- Do not invent schema versions, benchmark numbers, or library behavior
- PreferRelay-style or offset pagination only if the schema supports it
- Flag anything you cannot verify from the given schema as an open question
- Keep advice neutral and specific to the stated symptom`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'readme-generator'],
}
