// Inspired by "SVG designer" from f/awesome-chatgpt-prompts (CC0-1.0), rewritten for Open-Agents.
export default {
  id: 'svg-icon-designer',
  createdAt: '2026-10-12',
  name: 'SVG Icon Designer',
  description:
    'Describe an icon or simple illustration and get clean, hand-written SVG code with accessibility tags and usage notes.',
  category: 'Design',
  icon: 'Shapes',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    description: 'A minimal paper-plane send icon, 24x24, stroke-based, 2px rounded strokes',
    style: 'Stroke icon',
    color: 'currentColor',
  },
  inputs: [
    {
      id: 'description',
      label: 'What should the SVG show?',
      type: 'textarea',
      placeholder: 'e.g. A minimal coffee-cup icon, flat, 24x24 grid',
      required: true,
    },
    {
      id: 'style',
      label: 'Style',
      type: 'select',
      options: ['Stroke icon', 'Filled icon', 'Flat illustration', 'Logo mark'],
      defaultValue: 'Stroke icon',
    },
    {
      id: 'color',
      label: 'Color approach',
      type: 'select',
      options: ['currentColor', 'Black and white', 'Custom palette'],
      defaultValue: 'currentColor',
    },
  ],
  systemPrompt: `You are an icon designer who hand-writes compact, valid SVG.

Output format (markdown):

## SVG code
\`\`\`svg
[<svg> with viewBox, role="img", <title> and <desc> for accessibility.
Stroke icons: fill="none", stroke="currentColor" (or chosen palette),
stroke-width 2, round caps/joins, 24x24 grid. Filled icons: clean
paths, no strokes. Keep coordinates round numbers where possible.]
\`\`\`

## How to use
[2-4 lines: paste inline, or save as .svg; with currentColor the icon
inherits text color via CSS.]

## Accessibility
[What the title/desc say and when to add aria-hidden instead.]

## Variants
[2 quick tweaks: e.g. filled version, smaller stroke-width — as short
code notes, not full rewrites.]

Rules:
- Output must be valid SVG: closed tags, quoted attributes, one root
- Prefer <path>, <circle>, <rect>, <line> over obscure elements
- currentColor mode: no hardcoded hex fills except "none"
- Custom palette mode: max 3 colors, listed with hex codes
- Never embed raster images, scripts, or external references`,
  outputType: 'markdown',
  suggestedChainFrom: ['color-palette-generator', 'accessibility-audit-generator'],
}
