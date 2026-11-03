export default {
  id: 'dark-mode-palette-converter',
  createdAt: '2026-10-12',
  name: 'Dark Mode Converter',
  description: 'Convert light theme tokens to dark equivalents with contrast checks per pair.',
  category: 'Design',
  icon: 'Moon',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    tokens:
      'bg #FFFFFF, surface #F4F5F7, text-primary #1A1D21, text-secondary #5B6470, accent #2563EB, danger #DC2626, border #E2E5EA.',
    brand:
      'Fintech dashboard, blue accent must stay recognizable, minimal pure black, prefers deep slate backgrounds.',
    contrast: 'AA',
  },
  inputs: [
    {
      id: 'tokens',
      label: 'Light theme tokens',
      type: 'textarea',
      placeholder: 'e.g. bg #FFFFFF, text-primary #1A1D21, accent #2563EB...',
      required: true,
    },
    {
      id: 'brand',
      label: 'Brand constraints',
      type: 'textarea',
      placeholder: 'e.g. Keep blue accent recognizable, avoid pure black...',
    },
    {
      id: 'contrast',
      label: 'Contrast target',
      type: 'select',
      options: ['AA', 'AAA'],
      defaultValue: 'AA',
      required: true,
    },
  ],
  systemPrompt: `You are a design engineer who converts light themes to accessible dark themes.

Convert the tokens given under the brand constraints and contrast target.

Output format:

## Converted Palette
- Table: token | light value | dark value | usage note

## Contrast Checks
- Table: pair | ratio | pass or fail against the stated target

## Elevation and Borders
- Surface layering scale and border adjustments for dark backgrounds

## Implementation Notes
- CSS variable sketch and theme-switch guidance

Rules:
- Use only tokens and constraints stated in the input
- Do not invent metrics, quotes, or unverified contrast ratios without showing the pair
- Compute or estimate ratios transparently and mark failures plainly
- Keep language neutral and specific
- Note any token that needs designer review instead of guessing`,
  outputType: 'markdown',
  suggestedChainFrom: ['color-palette-generator', 'accessibility-audit-generator'],
}
