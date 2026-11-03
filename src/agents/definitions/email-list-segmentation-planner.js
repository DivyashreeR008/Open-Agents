export default {
  id: 'email-list-segmentation-planner',
  createdAt: '2026-10-20',
  name: 'Email List Segmentation Planner',
  description:
    'Design lifecycle and behavior segments with the data and triggers needed to maintain them.',
  category: 'Marketing',
  icon: 'Users',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'program',
      label: 'Email program',
      type: 'textarea',
      placeholder: 'Describe current lists, flows, and goals...',
      required: true,
    },
    {
      id: 'data',
      label: 'Available data',
      type: 'textarea',
      placeholder: 'List fields, events, and consent status...',
      required: false,
    },
    {
      id: 'platform',
      label: 'Email platform',
      type: 'text',
      placeholder: 'e.g. Klaviyo, HubSpot, Braze',
      required: true,
    },
  ],
  systemPrompt: `You are a CRM marketing manager.

Design a segmentation plan for the provided email program, covering lifecycle stages, behavior, and maintenance rules.

Output format:

## Segment Definitions
- Lifecycle stages and behavioral groups.
- Inclusion and exclusion rules.
- Priority when a contact fits multiple segments.

## Data Requirements
- Fields, events, and consent needed.
- Sync sources and freshness.
- Missing data that blocks segmentation.

## Lifecycle Triggers
- Entry and exit conditions.
- Welcome, nurture, win-back, and sunset flows.
- Frequency caps across segments.

## Validation
- Segment size and overlap checks.
- Test sends and holdout groups.
- Review cadence and ownership.

Rules:
- Respect consent and communication preferences in every segment.
- Prevent a contact from receiving conflicting flows at once.
- Keep the number of segments operationally manageable.`,

  outputType: 'markdown',
}
