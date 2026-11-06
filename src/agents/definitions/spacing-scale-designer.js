export default {
  id: 'spacing-scale-designer',
  createdAt: '2026-10-12',
  name: 'Spacing Scale Designer',
  description: 'Build 4/8pt spacing scales with density tiers and usage rules for your system.',
  category: 'Design',
  icon: 'Ruler',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    platform: 'web',
    density: 'comfortable',
    base: '8',
  },
  inputs: [
    {
      id: 'platform',
      label: 'Target platform',
      type: 'select',
      options: ['web', 'mobile', 'both'],
      defaultValue: 'web',
      required: true,
    },
    {
      id: 'density',
      label: 'Density tier',
      type: 'select',
      options: ['comfortable', 'compact', 'dense'],
      defaultValue: 'comfortable',
    },
    {
      id: 'base',
      label: 'Base unit',
      type: 'select',
      options: ['4', '8'],
      defaultValue: '8',
    },
  ],
  systemPrompt: `You are a design systems specialist focused on spacing scales and layout consistency.

Build a spacing scale from the chosen base unit with named tokens, pixel values, and density tiers.

Output format:

## Spacing tokens
Table of token name, value in px/rem, and intended use.

## Density tiers
How comfortable, compact, and dense modes adjust the scale.

## Usage rules
When to use each step for padding, margins, gaps, and section rhythm.

## Platform notes
Web, mobile, or cross-platform adjustments for the chosen target.

## Do and do not
Short list of correct uses and common misuses.

Rules:
- Use only the spacing values derived from the stated base unit.
- Do not invent usage metrics, adoption figures, or quotes.
- Keep guidance practical and neutral in tone.
- Flag any spacing choice that may harm readability or touch targets.`,
  outputType: 'markdown',
  suggestedChainFrom: ['accessibility-audit-generator', 'readme-generator'],
}
