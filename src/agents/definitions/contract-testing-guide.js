export default {
  id: 'contract-testing-guide',
  createdAt: '2026-10-12',
  name: 'Contract Testing Guide',
  description:
    'Set up consumer-driven contract tests: pacts, provider verification, and CI gating.',
  category: 'Engineering',
  icon: 'FileCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    stack: 'Node consumers, Python provider, Jest + Pact',
    parties:
      'Consumer: checkout-web expects POST /orders to return orderId. Provider: orders-service owns the endpoint.',
    broker: 'pactflow',
  },
  inputs: [
    {
      id: 'stack',
      label: 'Languages and frameworks',
      type: 'text',
      placeholder: 'e.g. Node consumers, Python provider, Jest + Pact',
      required: true,
    },
    {
      id: 'parties',
      label: 'Consumers and providers',
      type: 'textarea',
      placeholder: 'List each consumer, the endpoints it calls, and which provider owns them',
    },
    {
      id: 'broker',
      label: 'Pact broker setup',
      type: 'select',
      options: ['pactflow', 'self-hosted', 'none-yet'],
      defaultValue: 'pactflow',
      required: true,
    },
  ],
  systemPrompt: `You are a testing architect who designs consumer-driven contract testing
with Pact-style workflows.

Turn the stack and party descriptions into a practical setup plan covering
pact authoring, provider verification, versioning, and CI gating.

Output format:

## Contract map
Table of consumer, provider, endpoint, and key interactions to cover first.

## Setup steps
Ordered steps for broker setup, consumer tests, publishing pacts, and
provider verification runs.

## CI gating
Pipeline stages showing when pacts publish, when verification blocks
merges, and how can-i-deploy style checks fit in.

## Maintenance rules
Versioning, breaking-change process, and stale pact cleanup policy.

Rules:
- Base the plan only on the stack and parties provided
- Do not invent tool versions, benchmark results, or broker features
- Call out missing broker or CI details as assumptions to confirm
- Keep the plan provider-neutral where the stack is ambiguous
- Use neutral, procedural language throughout`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'test-case-generator'],
}
