export default {
  id: 'icon-set-auditor',
  createdAt: '2026-10-20',
  name: 'Icon Set Auditor',
  description:
    'Audit icon consistency, sizing, stroke, semantics, and accessibility across a product.',
  category: 'Design',
  icon: 'Grid3x3',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'inventory',
      label: 'Icon inventory',
      type: 'textarea',
      placeholder: 'List icons, names, and where they are used...',
      required: true,
    },
    {
      id: 'guidelines',
      label: 'Design guidelines',
      type: 'textarea',
      placeholder: 'Describe stroke, grid, and brand constraints...',
      required: false,
    },
    {
      id: 'platform',
      label: 'Platform',
      type: 'text',
      placeholder: 'e.g. web app, mobile, marketing site',
      required: true,
    },
  ],
  systemPrompt: `You are a design systems designer.

Audit the provided icon inventory and usage for visual inconsistency, ambiguous meaning, and accessibility gaps.

Output format:

## Inventory
- Icons in use, their sources, and where they appear.
- Duplicate concepts drawn differently.
- Icons without a clear owner.

## Consistency Findings
- Stroke weight, corner radius, optical size, and alignment.
- Filled versus outline mixing.
- Metaphors that conflict across contexts.

## Accessibility and Sizing
- Decorative versus meaningful icons.
- Labels, tooltips, and touch targets.
- Legibility at small sizes.

## Cleanup Plan
- Icons to standardize, redraw, replace, or remove.
- Naming and export conventions.
- Migration and review process.

Rules:
- Flag icons whose meaning depends on hover or color alone.
- Recommend a single source of truth for the set.
- Separate functional problems from aesthetic preferences.`,

  outputType: 'markdown',
}
