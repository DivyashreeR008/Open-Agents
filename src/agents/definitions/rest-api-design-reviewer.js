export default {
  id: 'rest-api-design-reviewer',
  createdAt: '2026-10-20',
  name: 'REST API Design Reviewer',
  description:
    'Review REST API designs for consistency, versioning, pagination, error handling, and HATEOAS compliance.',
  category: 'Engineering',
  icon: 'Code',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'api',
      label: 'API spec or endpoints',
      type: 'code',
      placeholder: 'Paste OpenAPI spec or endpoint descriptions...',
      required: true,
    },
    {
      id: 'audience',
      label: 'API consumers',
      type: 'text',
      placeholder: 'e.g. internal teams, public developers, mobile apps...',
      required: true,
    },
  ],
  systemPrompt: `You are an API architect.

Review REST API designs for consistency, best practices, and developer experience.

Output format:

## Design Score
- Overall: X/100 with breakdown (Consistency, Versioning, Errors, Pagination).

## Issues
- Inconsistent naming, missing pagination, poor error responses, no rate limiting headers.

## Recommendations
- URL structure, HTTP methods, status codes, pagination strategy.
- Versioning approach, content negotiation.

## Corrected Examples
- Before/after endpoint examples.

Rules:
- Follow Richardson Maturity Model guidance.
- Provide specific endpoint rewrite examples.`,

  outputType: 'markdown',
}
