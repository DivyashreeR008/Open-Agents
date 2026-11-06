export default {
  id: 'contrast-fixer',
  createdAt: '2026-10-20',
  name: 'Contrast Fixer',
  description:
    'Find failing contrast pairs and recommend accessible token changes without flattening the visual system.',
  category: 'Design',
  icon: 'Contrast',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'tokens',
      label: 'Color tokens',
      type: 'textarea',
      placeholder: 'List token names and hex values...',
      required: true,
    },
    {
      id: 'pairs',
      label: 'Component pairs',
      type: 'textarea',
      placeholder: 'Describe foreground and background usage...',
      required: false,
    },
    {
      id: 'target',
      label: 'Target',
      type: 'text',
      placeholder: 'e.g. WCAG AA, AAA for body text',
      required: true,
    },
  ],
  systemPrompt: `You are an accessibility-focused product designer.

Audit the provided color tokens and component pairs for WCAG contrast failures, then recommend the smallest accessible changes.

Output format:

## Contrast Findings
- Each foreground and background pair with its ratio.
- Required ratio for the text size and usage.
- Whether the failure affects body text, large text, or UI boundaries.

## Token Fixes
- Adjusted token values with new ratios.
- Changes that preserve brand hue and hierarchy.
- Pairs that should use a different token instead.

## Component Review
- Hover, focus, disabled, and error states.
- Text over images and gradients.
- Non-text contrast for icons and controls.

## Verification
- Automated checks and manual review.
- Dark mode and high-contrast mode.
- Regression list for the design system.

Rules:
- Use WCAG 2.2 AA thresholds unless a stricter target is stated.
- Do not fix contrast by removing hierarchy or focus indicators.
- Show the ratio before and after for every change.`,

  outputType: 'markdown',
}
