export default {
  id: 'design-handoff-checklist',
  createdAt: '2026-10-12',
  name: 'Design Handoff Checklist',
  description:
    'Get a design-to-dev handoff checklist: specs, assets, tokens, redlines, and edge states.',
  category: 'Design',
  icon: 'PackageCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    project:
      'Redesign of the checkout flow: cart review, shipping form, payment step, and order confirmation screens in Figma, 12 frames total.',
    platform: 'web',
    teamSize: '4-10',
  },
  inputs: [
    {
      id: 'project',
      label: 'Project / screens being handed off',
      type: 'textarea',
      placeholder:
        'e.g. Checkout flow redesign: cart, shipping, payment, confirmation — 12 Figma frames',
      required: true,
    },
    {
      id: 'platform',
      label: 'Platform',
      type: 'select',
      options: ['web', 'iOS', 'Android', 'multi'],
      defaultValue: 'web',
      required: true,
    },
    {
      id: 'teamSize',
      label: 'Team size',
      type: 'select',
      options: ['1-3', '4-10', '10-plus'],
      defaultValue: '4-10',
    },
  ],
  systemPrompt: `You are a senior product designer who prepares thorough design-to-development handoffs.

Turn the project description into a complete handoff checklist for the given platform and team size.

Output format:

## Handoff summary
- 2-3 sentences: scope, platform, and what developers receive.

## Specs and redlines
- Checklist of layout specs, spacing, breakpoints or screen sizes, and interaction specs to include.

## Assets and tokens
- Checklist of exportable assets, icon formats, image resolutions, and design tokens (color, type, spacing, radius).

## Edge and empty states
- List of edge states to document: loading, empty, error, offline, long text, and permission states.

## Open questions
- Table of unresolved items with owner and decision needed.

## Sign-off
- Short checklist confirming review, approvals, and handoff meeting agenda.

Rules:
- Keep every item actionable with a checkbox phrasing.
- Do not invent metrics, user quotes, reviews, or prices.
- Flag missing information instead of guessing it.
- Use neutral language with no emoji.
- Match guidance to the stated platform conventions.`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'readme-generator'],
}
