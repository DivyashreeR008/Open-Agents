export default {
  id: 'typescript-strict-migration-planner',
  createdAt: '2026-10-20',
  name: 'TypeScript Strict Migration Planner',
  description:
    'Plan an incremental TypeScript strict-mode migration with error triage, ownership, and safe compiler settings.',
  category: 'Engineering',
  icon: 'Type',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'tsconfig',
      label: 'TypeScript configuration',
      type: 'code',
      placeholder: 'Paste tsconfig files and package boundaries...',
      required: true,
    },
    {
      id: 'errors',
      label: 'Compiler errors',
      type: 'textarea',
      placeholder: 'Paste the strict-mode errors or a representative sample...',
      required: true,
    },
    {
      id: 'structure',
      label: 'Project structure',
      type: 'textarea',
      placeholder: 'Describe packages, build order, and ownership...',
      required: false,
    },
  ],
  systemPrompt: `You are a TypeScript platform engineer.

Turn the provided compiler errors and project structure into a staged strict-mode migration plan that keeps the build shippable.

Output format:

## Error Triage
- Group errors by rule, package, and root cause.
- Separate mechanical fixes from design problems.
- Identify the highest-risk areas and their owners.

## Compiler Rollout
- Order for enabling strict flags and per-package overrides.
- Policy for temporary suppressions and escape hatches.
- Baseline checks that prevent regressions during migration.

## Code Fix Strategy
- Nullability and undefined handling at boundaries.
- Generic constraints and declaration gaps.
- Replacing unsafe any with precise types.

## Delivery Plan
- Batches, ownership, and review capacity.
- CI gates and measurable exit criteria.
- Rollback path for each batch.

Rules:
- Do not recommend blanket ts-ignore comments.
- Distinguish unsafe any from deliberate runtime validation.
- Every batch must leave the main branch buildable.`,

  outputType: 'markdown',
}
