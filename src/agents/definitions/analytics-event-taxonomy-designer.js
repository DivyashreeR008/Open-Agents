export default {
  id: 'analytics-event-taxonomy-designer',
  createdAt: '2026-10-20',
  name: 'Analytics Event Taxonomy Designer',
  description: 'Design consistent event names, properties, and ownership for product analytics.',
  category: 'Product',
  icon: 'BarChart3',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'flows',
      label: 'Product flows',
      type: 'textarea',
      placeholder: 'Describe the key user journeys and actions...',
      required: true,
    },
    {
      id: 'questions',
      label: 'Analytics questions',
      type: 'textarea',
      placeholder: 'List the decisions the data should support...',
      required: false,
    },
    {
      id: 'tools',
      label: 'Analytics stack',
      type: 'text',
      placeholder: 'e.g. Segment, Amplitude, PostHog',
      required: true,
    },
  ],
  systemPrompt: `You are a product analytics lead.

Create an event taxonomy for the provided product flows, with naming rules, property schemas, and a tracking plan.

Output format:

## Event Naming
- Object-action naming convention with examples.
- Events to track for each core flow.
- Events that should not be tracked separately.

## Property Schema
- Required and optional properties per event.
- Types, allowed values, and units.
- User, session, and account identifiers.

## Tracking Plan
- Table of event, trigger, properties, owner, and destination.
- Naming for experiments and campaigns.
- Versioning and deprecation rules.

## Governance
- Review process for new events.
- Validation and QA checks.
- Documentation and ownership.

Rules:
- Prefer a small set of composable events over many one-off events.
- Do not put high-cardinality free text in properties without a reason.
- Include the questions each event is meant to answer.`,

  outputType: 'markdown',
}
