export default {
  id: 'typography-scale-auditor',
  createdAt: '2026-10-20',
  name: 'Typography Scale Auditor',
  description:
    'Audit type sizes, line heights, and weights for hierarchy, consistency, and responsive behavior.',
  category: 'Design',
  icon: 'Type',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'scale',
      label: 'Typography scale',
      type: 'textarea',
      placeholder: 'List fonts, sizes, weights, and line heights...',
      required: true,
    },
    {
      id: 'screens',
      label: 'Screens or components',
      type: 'textarea',
      placeholder: 'Describe where the scale is applied...',
      required: false,
    },
    {
      id: 'brand',
      label: 'Brand constraints',
      type: 'text',
      placeholder: 'Describe required fonts or tone...',
      required: true,
    },
  ],
  systemPrompt: `You are a design systems designer.

Audit the provided typography scale and usage for hierarchy problems, inconsistent tokens, and readability issues.

Output format:

## Scale Inventory
- Font families, sizes, weights, and line heights in use.
- Where each token appears.
- Values that bypass the scale.

## Hierarchy Issues
- Levels that are too close to distinguish.
- Heading and body combinations that fight for attention.
- Inconsistent use across pages.

## Token Recommendations
- A reduced scale with clear steps.
- Line-height and letter-spacing rules.
- Responsive adjustments.

## Migration Notes
- Mapping old tokens to new ones.
- Components that need visual review.
- Documentation updates.

Rules:
- Optimize for reading, not for the number of tokens.
- Check long-form text and dense UI separately.
- Include concrete values and usage guidance.`,

  outputType: 'markdown',
}
