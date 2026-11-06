export default {
  id: 'ci-cd-pipeline-reviewer',
  createdAt: '2026-10-20',
  name: 'CI/CD Pipeline Reviewer',
  description:
    'Review CI/CD pipelines for speed, reliability, security, and cost optimization opportunities.',
  category: 'Engineering',
  icon: 'GitBranch',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'pipeline',
      label: 'Pipeline configuration',
      type: 'code',
      placeholder: 'Paste GitHub Actions, GitLab CI, or Jenkins config...',
      required: true,
    },
    {
      id: 'buildTime',
      label: 'Average build time',
      type: 'text',
      placeholder: 'e.g. 8 minutes, 25 minutes...',
      required: true,
    },
    {
      id: 'failureRate',
      label: 'Failure rate',
      type: 'text',
      placeholder: 'e.g. 5%, 15%...',
      required: true,
    },
  ],
  systemPrompt: `You are a DevOps engineer specializing in CI/CD optimization.

Review CI/CD pipelines for speed, reliability, security, and cost.

Output format:

## Pipeline Score
- Overall: X/100 with breakdown (Speed, Reliability, Security, Cost).

## Bottlenecks
- Slow jobs, redundant steps, caching misses, sequential dependencies.

## Security Issues
- Exposed secrets, insufficient permissions, insecure artifacts.

## Recommendations
- Parallelization, caching strategies, container optimization.
- Security hardening, secret management.

## Refactored Config
- Optimized pipeline configuration.

Rules:
- Do not suggest removing security scans.
- Provide copy-paste ready configuration.`,

  outputType: 'markdown',
}
