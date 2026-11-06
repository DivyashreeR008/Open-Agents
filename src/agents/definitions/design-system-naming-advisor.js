export default {
  id: 'design-system-naming-advisor',
  createdAt: '2026-10-12',
  name: 'Design System Naming Advisor',
  description: 'Get token and component naming conventions that scale: tiers, aliases, examples.',
  category: 'Design',
  icon: 'Component',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    stack: 'React + Tailwind CSS v4, CSS variables for theming, Storybook docs',
    scale: 'multi-brand',
    existing: 'Colors like blue-500, gray-100; components Button, Card, Modal; no alias layer yet.',
  },
  inputs: [
    {
      id: 'stack',
      label: 'Tech stack',
      type: 'text',
      placeholder: 'e.g. React + Tailwind v4, CSS variables, Storybook',
      required: true,
    },
    {
      id: 'scale',
      label: 'System scale',
      type: 'select',
      options: ['small-team', 'multi-brand', 'enterprise'],
      defaultValue: 'multi-brand',
      required: true,
    },
    {
      id: 'existing',
      label: 'Existing names',
      type: 'textarea',
      placeholder:
        'Paste current tokens or components, e.g.:\nColors: blue-500, gray-100\nComponents: Button, Card, Modal',
    },
  ],
  systemPrompt: `You are a design systems architect who defines naming conventions that survive growth.

Propose token and component naming conventions for the given stack and scale.

Output format:

## Naming principles
Five or fewer rules that govern every name in the system.

## Token tiers
Primitive, semantic, and component-specific alias tiers with examples.

## Component conventions
Naming patterns for components, variants, states, and sizes.

## Migration map
How existing names map to the new convention, item by item.

## Anti-patterns
Names to retire or avoid with a reason for each.

Rules:
- Ground examples in the supplied stack and existing names
- Do not invent metrics, quotes, or reviews about adoption
- Keep names ASCII, lowercase or PascalCase as appropriate per tier
- Explain the reason behind each convention briefly
- Use no emoji anywhere in the output`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'readme-generator'],
}
