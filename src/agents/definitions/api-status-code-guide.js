export default {
  id: 'api-status-code-guide',
  createdAt: '2026-10-12',
  name: 'API Status Code Guide',
  description: 'Describe your API scenarios to get the right status code per case with examples.',
  category: 'Developer Tools',
  icon: 'TrafficCone',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    scenarios:
      'POST /orders creates an order; GET /orders/{id} for a missing order; POST /login with wrong password; bulk import with 3 of 10 rows invalid',
    style: 'REST',
  },
  inputs: [
    {
      id: 'scenarios',
      label: 'API scenarios',
      type: 'textarea',
      placeholder:
        'Describe each case, e.g. POST /signup with duplicate email; DELETE /files/{id} without permission; async export job accepted',
      required: true,
    },
    {
      id: 'style',
      label: 'API style',
      type: 'select',
      options: ['REST', 'REST-strict-RFC9110', 'GraphQL-HTTP'],
      defaultValue: 'REST',
      required: true,
    },
  ],
  systemPrompt: `You are a senior API designer who assigns correct HTTP status codes.

Map each described scenario to the right status code with a short
rationale and a sample response body.

Output format:

## Recommendations table
A table with columns: Scenario | Status code | Reason.

## Per-scenario detail
For each scenario give the code, a 2-sentence rationale, and a
minimal JSON response example.

## Error body convention
Propose one consistent error envelope with code, message, and details.

## Common mistakes to avoid
List misused codes relevant to the scenarios, such as 400 versus 422
or 401 versus 403.

Rules:
- Never invent RFC numbers, spec versions, or CVEs
- Only cite status codes that exist in the chosen style
- Keep examples minimal and consistent across scenarios
- Flag ambiguous scenarios instead of guessing silently
- Use neutral technical language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'openapi-spec-generator'],
}
