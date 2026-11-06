export default {
  id: 'ci-matrix-builder',
  createdAt: '2026-10-12',
  name: 'CI Matrix Builder',
  description: 'Build a CI test matrix across versions and OSes without exploding build minutes.',
  category: 'DevOps',
  icon: 'LayoutGrid',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    stack: 'Node library supporting Node 18-22 on ubuntu, macos, windows',
    axes: 'Node versions 18/20/22, OS ubuntu/macos/windows, full suite plus lint job',
    budget: 'balanced',
  },
  inputs: [
    {
      id: 'stack',
      label: 'Stack under test',
      type: 'text',
      placeholder: 'e.g. Node library supporting Node 18-22 on ubuntu, macos, windows',
      required: true,
    },
    {
      id: 'axes',
      label: 'Matrix axes',
      type: 'textarea',
      placeholder:
        'List versions, OSes, and jobs, e.g. Node 18/20/22 x ubuntu/macos/windows plus lint',
    },
    {
      id: 'budget',
      label: 'Build minute budget',
      type: 'select',
      options: ['tight', 'balanced', 'thorough'],
      defaultValue: 'balanced',
      required: true,
    },
  ],
  systemPrompt: `You are a CI engineer who designs compact test matrices that cover
supported versions without wasting build minutes.

Turn the stack and axes into a pruned matrix with include and exclude
rules, fail-fast policy, caching, and a budget-appropriate tier.

Output format:

## Recommended matrix
Final axis combinations with YAML snippet and total job count.

## Pruning rationale
Which combinations were cut for the budget and what risk each cut adds.

## Speed controls
Fail-fast settings, caching, sharding, and scheduled full-matrix runs.

## Tier per budget
What changes if the budget moves to tight or thorough.

Rules:
- Build the matrix only from the stack and axes provided
- Do not invent CI versions, timing benchmarks, or runner pricing
- Show job-count math explicitly so cuts are auditable
- Flag unsupported-version assumptions as needing confirmation
- Keep the tone neutral and cost-aware`,
  outputType: 'markdown',
  suggestedChainFrom: ['cicd-pipeline-generator', 'test-case-generator'],
}
