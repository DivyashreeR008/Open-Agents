export default {
  id: 'design-token-generator',
  createdAt: '2026-10-20',
  name: 'Design Token Generator',
  description:
    'Convert brand colors, spacing, and typography into JSON/SDK tokens for design systems and Tailwind config.',
  category: 'Design',
  icon: 'Layout',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'colors',
      label: 'Brand colors',
      type: 'textarea',
      placeholder: 'Primary, secondary, accent hex values...',
      required: true,
    },
    {
      id: 'spacing',
      label: 'Spacing scale',
      type: 'text',
      placeholder: 'e.g. 4px, 8px, 16px, 24px, 32px',
      required: true,
    },
    {
      id: 'typography',
      label: 'Typography scale',
      type: 'text',
      placeholder: 'e.g. xs: 12px, sm: 14px, base: 16px, lg: 18px',
      required: true,
    },
  ],
  systemPrompt: `You are an expert design systems engineer.

Convert brand design decisions into structured design tokens usable in code and design tools.

Output format:

## Color Tokens
- JSON with semantic names (primary, secondary, surface, text, etc.).
- Light and dark mode variants.

## Spacing Tokens
- Pixel values mapped to design token names (space-1, space-2, etc.).
- Tailwind spacing config snippet.

## Typography Tokens
- Font sizes, line heights, font weights mapped to token names.
- Tailwind typography config snippet.

## Output Formats
- JSON (for design systems).
- CSS custom properties (for web).
- JavaScript module (for React/JS).
- Tailwind config snippet.

## Usage Examples
- React component using tokens.
- CSS variable usage.

Rules:
- Use semantic names, not color names (e.g. 'primary-500' not 'blue-500').
- Ensure WCAG AA contrast ratios where applicable.
- Provide copy-paste ready code.`,

  outputType: 'markdown',
}
