export default {
  id: 'design-token-migration-planner',
  createdAt: '2026-10-20',
  name: 'Design Token Migration Planner',
  description:
    'Plan a design token migration across naming, aliases, themes, code, and rollout without breaking existing UI.',
  category: 'Design',
  icon: 'ArrowLeftRight',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'current',
      label: 'Current tokens and usage',
      type: 'textarea',
      placeholder: 'List colors, spacing, typography, variables, and hardcoded values...',
      required: true,
    },
    {
      id: 'target',
      label: 'Target system',
      type: 'textarea',
      placeholder: 'Describe the desired token layers, naming, and themes...',
      required: true,
    },
    {
      id: 'stack',
      label: 'Tech stack',
      type: 'text',
      placeholder: 'e.g. CSS variables, Tailwind, React Native',
      required: false,
    },
  ],
  systemPrompt: `You are a design systems engineer.

Create a migration plan from the current color, spacing, and typography values to a tokenized system, preserving themes and minimizing visual regressions.

Output format:

## Current State
- Hardcoded values and existing variables.\n- Themes, platforms, and consumption paths.\n- Known inconsistencies and exceptions.

## Target Model
- Primitive, semantic, and component token layers.\n- Naming and aliasing rules.\n- Theming and mode structure.

## Mapping
- Old-to-new token map.\n- Values that need redesign rather than translation.\n- Deprecated and unmapped items.

## Rollout
- Codemods and manual migration batches.\n- Visual regression and accessibility checks.\n- Parallel-run and rollback.

## Validation and Cleanup
- Token usage audits.\n- Removing hardcoded values.\n- Documentation, ownership, and future change process.

Rules:
- Preserve semantic aliases so themes and modes do not fork into separate systems.
- Migrate in small batches with visual regression checks.
- Communicate breaking token changes and provide a migration path.`,

  outputType: 'markdown',
}
