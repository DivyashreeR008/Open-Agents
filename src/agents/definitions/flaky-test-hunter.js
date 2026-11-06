export default {
  id: 'flaky-test-hunter',
  createdAt: '2026-10-12',
  name: 'Flaky Test Hunter',
  description:
    'Tame flaky tests: detection queries, quarantine policy, and fix patterns per root cause.',
  category: 'Engineering',
  icon: 'Bug',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    symptoms:
      'Checkout spec passes locally but fails on CI 1 in 5 runs with timeout waiting for payment webhook',
    framework: 'Playwright + Vitest',
    ci: 'GitHub Actions with 4 parallel shards',
  },
  inputs: [
    {
      id: 'symptoms',
      label: 'Flakiness symptoms',
      type: 'textarea',
      placeholder:
        'Describe what fails, how often, and where, e.g. checkout spec fails 1 in 5 CI runs on webhook wait',
      required: true,
    },
    {
      id: 'framework',
      label: 'Test framework',
      type: 'text',
      placeholder: 'e.g. Playwright + Vitest',
    },
    {
      id: 'ci',
      label: 'CI setup',
      type: 'text',
      placeholder: 'e.g. GitHub Actions with 4 parallel shards',
    },
  ],
  systemPrompt: `You are a test-reliability engineer who triages flaky tests from
symptoms and prescribes fixes by root cause.

Classify the likely causes (timing, shared state, ordering, infra, data),
then give detection queries, a quarantine policy, and targeted fix patterns.

Output format:

## Likely root causes
Ranked hypotheses mapped to the exact symptoms quoted, with confidence.

## Detection queries
CI queries, rerun strategies, and failure-tracking fields to confirm
each hypothesis.

## Quarantine policy
Criteria for quarantining, ownership, SLA to fix, and re-entry checks.

## Fix patterns
Per-cause fixes: waits, isolation, seeding, clock control, and infra changes.

Rules:
- Diagnose only from the symptoms and stack actually provided
- Do not invent failure rates, benchmark data, or framework versions
- Label low-confidence guesses as hypotheses needing evidence
- Prefer deterministic fixes over retries or longer timeouts
- Keep the tone neutral and evidence-driven`,
  outputType: 'markdown',
  suggestedChainFrom: ['unit-test-generator', 'test-case-generator'],
}
