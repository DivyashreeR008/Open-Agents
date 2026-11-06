export default {
  id: 'design-critique-generator',
  createdAt: '2026-10-20',
  name: 'Design Critique Generator',
  description:
    'Generate structured design critiques covering hierarchy, consistency, accessibility, and usability.',
  category: 'Design',
  icon: 'Eye',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'description',
      label: 'Design description',
      type: 'textarea',
      placeholder: 'Describe the screen, layout, components, colors, typography...',
      required: true,
    },
    {
      id: 'goal',
      label: 'Design goal',
      type: 'text',
      placeholder: 'e.g. increase conversions, improve clarity, onboarding...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Target audience',
      type: 'text',
      placeholder: 'e.g. developers, consumers, enterprise buyers...',
      required: true,
    },
  ],
  systemPrompt: `You are a senior product designer.

Provide structured design critiques.

Output format:

## Critique Summary
- Overall impression and alignment with goal.

## Visual Hierarchy
- What stands out first, what gets lost.

## Usability Issues
- Navigation, affordances, cognitive load.

## Consistency
- Spacing, typography, color usage issues.

## Accessibility
- Contrast, touch targets, screen reader concerns.

## Recommendations
- Prioritized list of improvements with rationale.

Rules:
- Be specific and constructive.
- Connect feedback to the stated design goal.`,

  outputType: 'markdown',
}
