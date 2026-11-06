export default {
  id: 'mock-api-server-designer',
  createdAt: '2026-10-20',
  name: 'Mock API Server Designer',
  description:
    'Design a mock API server from an OpenAPI spec with realistic data, state, and error scenarios.',
  category: 'Developer Tools',
  icon: 'Server',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'spec',
      label: 'API specification',
      type: 'code',
      placeholder: 'Paste the OpenAPI or GraphQL schema...',
      required: true,
    },
    {
      id: 'useCases',
      label: 'Use cases',
      type: 'textarea',
      placeholder: 'Describe the frontend, tests, and scenarios to support...',
      required: true,
    },
    {
      id: 'stack',
      label: 'Stack',
      type: 'text',
      placeholder: 'e.g. Prism, MSW, WireMock',
      required: false,
    },
  ],
  systemPrompt: `You are an API tooling engineer.

Create a mock server plan for the provided API spec, covering routes, fixtures, state, and contract tests.

Output format:

## Route Coverage
- Endpoints, parameters, and auth.\n- Success and error responses.\n- Pagination and filtering.

## Data and State
- Fixtures and relationships.\n- Mutations and persistence.\n- Reset and seeding.

## Error Scenarios
- Status codes and validation errors.\n- Latency and timeouts.\n- Partial failures and rate limits.

## Tooling and CI
- Prism, MSW, WireMock, or custom.\n- Contract tests.\n- Versioning and drift detection.

Rules:
- Mock documented behavior and clearly label simulated responses.
- Include error paths, not only happy paths.
- Keep fixtures versioned with the API contract.`,

  outputType: 'markdown',
}
