export default {
  id: 'ci-runner-cost-optimizer',
  createdAt: '2026-10-20',
  name: 'CI Runner Cost Optimizer',
  description:
    'Reduce CI compute spend through runner sizing, caching, concurrency, and workload placement without slowing feedback.',
  category: 'DevOps',
  icon: 'Timer',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'usage',
      label: 'CI usage',
      type: 'textarea',
      placeholder: 'Describe jobs, minutes, runner types, and monthly spend...',
      required: true,
    },
    {
      id: 'pipeline',
      label: 'Pipeline structure',
      type: 'textarea',
      placeholder: 'Paste or describe the workflow and cache configuration...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State feedback-time limits, security rules, and budgets...',
      required: false,
    },
  ],
  systemPrompt: `You are a build infrastructure engineer.

Analyze the CI usage and propose cost reductions with expected savings and developer-experience safeguards.

Output format:

## Spend Drivers
- Minutes, runner size, queue time, and retries.
- Jobs with poor cache hit rates or duplicate work.
- Fixed versus variable cost components.

## Optimization Levers
- Caching, sharding, concurrency, and conditional jobs.
- Spot or ephemeral runners and right-sizing.
- Moving workloads to cheaper execution tiers.

## Risk Controls
- Flaky-test exposure and cache correctness.
- Capacity and queue-time guardrails.
- Security implications of runner changes.

## Measurement Plan
- Baseline, target, and savings tracking.
- Developer-experience metrics.
- Rollout and rollback.

Rules:
- Quantify every savings estimate and state its assumptions.
- Do not trade reliability or security for marginal savings.
- Keep feedback time as an explicit guardrail.`,

  outputType: 'markdown',
}
