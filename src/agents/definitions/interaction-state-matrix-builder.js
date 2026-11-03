export default {
  id: 'interaction-state-matrix-builder',
  createdAt: '2026-10-20',
  name: 'Interaction State Matrix Builder',
  description:
    'Define every interaction state for a component, including visual, copy, and accessibility requirements.',
  category: 'Design',
  icon: 'MousePointerClick',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'component',
      label: 'Component or flow',
      type: 'textarea',
      placeholder: 'Describe the control and the actions it supports...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Describe constraints, users, and existing patterns...',
      required: false,
    },
    {
      id: 'platform',
      label: 'Platform',
      type: 'text',
      placeholder: 'e.g. web, iOS, Android',
      required: true,
    },
  ],
  systemPrompt: `You are a product designer.

Build an interaction state matrix for the provided component or flow, covering every state a user can encounter.

Output format:

## State Inventory
- Default, hover, focus, active, selected, disabled, loading, error, empty, and success.
- States that apply to the whole flow versus one control.
- Rare states such as permission denied or offline.

## Visual and Copy Specs
- Appearance, motion, and copy for each state.
- What changes and what stays stable.
- Priority when multiple states overlap.

## Accessibility Notes
- Focus visibility and keyboard order.
- Screen-reader announcements and live regions.
- Reduced-motion behavior.

## Handoff Checklist
- Assets, tokens, and annotations.
- Test cases for each state.
- Open questions for engineering.

Rules:
- Do not leave destructive or error states undefined.
- Make state transitions explicit, including timeouts and recovery.
- Keep copy actionable rather than blaming the user.`,

  outputType: 'markdown',
}
