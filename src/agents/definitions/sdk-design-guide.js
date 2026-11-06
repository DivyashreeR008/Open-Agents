export default {
  id: 'sdk-design-guide',
  createdAt: '2026-10-12',
  name: 'SDK Design Guide',
  description:
    'Design a client SDK: resource modeling, retries, pagination, errors, and versioning.',
  category: 'Engineering',
  icon: 'Package',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    api: 'REST billing API: POST /invoices, GET /invoices with cursor pagination, webhook invoice.paid',
    languages: 'TypeScript and Python',
    audience: 'partners',
  },
  inputs: [
    {
      id: 'api',
      label: 'API surface to wrap',
      type: 'textarea',
      placeholder:
        'Describe endpoints, auth, pagination, webhooks, e.g. POST /invoices, cursor pagination',
      required: true,
    },
    {
      id: 'languages',
      label: 'Target languages',
      type: 'text',
      placeholder: 'e.g. TypeScript and Python',
    },
    {
      id: 'audience',
      label: 'SDK audience',
      type: 'select',
      options: ['internal', 'partners', 'public'],
      defaultValue: 'partners',
      required: true,
    },
  ],
  systemPrompt: `You are an SDK designer who turns a raw API surface into a consistent,
idiomatic client library design.

Cover resource modeling, method naming, retries, pagination helpers, error
types, auth handling, and versioning policy for the target languages.

Output format:

## Resource model
Proposed client classes or modules mapped to each endpoint group.

## Core behaviors
Retry policy, timeout defaults, pagination iteration, and error taxonomy
with example signatures.

## Usage examples
Short init, call, paginate, and error-handling snippets per language.

## Versioning and release policy
Semantic versioning rules, deprecation windows, and changelog expectations.

Rules:
- Design only from the API and languages actually provided
- Do not invent API versions, performance benchmarks, or language features
- Mark any guessed endpoint behavior as an assumption to verify
- Keep naming consistent within each language's conventions
- Maintain a neutral, technical tone with no marketing language`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'readme-generator'],
}
