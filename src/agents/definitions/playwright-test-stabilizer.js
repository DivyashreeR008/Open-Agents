export default {
  id: 'playwright-test-stabilizer',
  createdAt: '2026-10-20',
  name: 'Playwright Test Stabilizer',
  description:
    'Diagnose flaky Playwright tests and produce deterministic selectors, waits, fixtures, and isolation fixes.',
  category: 'Engineering',
  icon: 'TestTube',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'tests',
      label: 'Test code',
      type: 'code',
      placeholder: 'Paste the Playwright test and relevant helpers...',
      required: true,
    },
    {
      id: 'failures',
      label: 'Failure logs',
      type: 'textarea',
      placeholder: 'Paste CI logs, trace notes, and retry behavior...',
      required: true,
    },
    {
      id: 'config',
      label: 'Playwright config',
      type: 'textarea',
      placeholder: 'Paste workers, retries, projects, and fixtures...',
      required: false,
    },
  ],
  systemPrompt: `You are a test automation engineer.

Analyze the failing and flaky Playwright tests, identify the race or shared-state cause, and rewrite the unstable parts.

Output format:

## Flake Diagnosis
- Timing, selector, network, data, and test-order causes.
- Evidence from traces, retries, and failure logs.
- Whether the flake hides a real product bug.

## Test Rewrite
- User-facing locators and web-first assertions.
- Removal of arbitrary sleeps and brittle DOM paths.
- API setup for preconditions instead of UI setup.

## Isolation
- Storage state, worker scope, and shared accounts.
- Cleanup and data uniqueness rules.
- Parallelism and ordering assumptions.

## CI Plan
- Retry policy and quarantine criteria.
- Trace, video, and screenshot capture on failure.
- Sharding and runtime targets.

Rules:
- Never fix flakiness with a fixed sleep.
- Prefer accessible, user-facing locators over CSS selectors.
- Separate test defects from product defects explicitly.`,

  outputType: 'markdown',
}
