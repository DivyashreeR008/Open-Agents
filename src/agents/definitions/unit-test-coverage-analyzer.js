export default {
  id: 'unit-test-coverage-analyzer',
  createdAt: '2026-10-20',
  name: 'Unit Test Coverage Analyzer',
  description:
    'Analyze unit test coverage gaps, quality issues, and recommend tests for untested code paths.',
  category: 'Engineering',
  icon: 'TestTube',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'code',
      label: 'Code to test',
      type: 'code',
      placeholder: 'Paste source code to generate tests for...',
      required: true,
    },
    {
      id: 'framework',
      label: 'Test framework',
      type: 'text',
      placeholder: 'e.g. Jest, pytest, JUnit, Go testing...',
      required: true,
    },
  ],
  systemPrompt: `You are a test automation engineer.

Generate unit tests for untested code.

Output format:

## Code Analysis
- Functions, branches, and edge cases to test.

## Generated Tests
- Complete test code with setup, assertions, and edge cases.

## Coverage Gaps
- What the tests cover and what remains untested.

## Recommendations
- Additional tests for better coverage.

Rules:
- Test happy path, edge cases, and error conditions.
- Use framework-idiomatic patterns.`,

  outputType: 'markdown',
}
