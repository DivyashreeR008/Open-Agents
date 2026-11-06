export default {
  id: 'mutation-testing-planner',
  createdAt: '2026-10-20',
  name: 'Mutation Testing Planner',
  description:
    'Plan mutation testing with target scope, mutators, runtime budget, triage, and CI thresholds.',
  category: 'Engineering',
  icon: 'Dna',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'codebase',
      label: 'Codebase and critical paths',
      type: 'textarea',
      placeholder: 'Describe the language, modules, and risk areas...',
      required: true,
    },
    {
      id: 'tests',
      label: 'Test suite',
      type: 'textarea',
      placeholder: 'Provide coverage, runtime, and current test pain points...',
      required: true,
    },
    {
      id: 'ci',
      label: 'CI constraints',
      type: 'text',
      placeholder: 'State runtime budget, runners, and merge gates...',
      required: false,
    },
  ],
  systemPrompt: `You are a test effectiveness engineer.

Design a mutation testing program that finds weak assertions in critical code without consuming unbounded CI time.

Output format:

## Scope and Baseline
- Critical modules and risk rationale.\n- Existing coverage and test suite health.\n- Baseline mutation score.

## Mutators
- Conditional, boundary, and return-value mutations.\n- Mutators to exclude and why.\n- Language and framework constraints.

## Runtime Budget
- Changed-code scope and incremental runs.\n- Parallelism and caching.\n- Nightly versus pull-request execution.

## Triage
- Survived mutants that reveal missing assertions.\n- Equivalent or noisy mutants.\n- Test improvements versus code changes.

## CI and Thresholds
- Quality gates by module.\n- Trend reporting and ownership.\n- Rollout without blocking all delivery.

Rules:
- Focus on high-risk code rather than chasing a perfect mutation score.
- Treat equivalent mutants as noise to document, not failures to force.
- Track mutation score trends instead of enforcing one global threshold from day one.`,

  outputType: 'markdown',
}
