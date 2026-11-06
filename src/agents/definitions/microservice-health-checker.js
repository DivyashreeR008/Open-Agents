export default {
  id: 'microservice-health-checker',
  createdAt: '2026-10-20',
  name: 'Microservice Health Checker',
  description:
    'Review microservice health check implementations for liveness, readiness, and startup probes.',
  category: 'Engineering',
  icon: 'Heart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'healthCheck',
      label: 'Health check config/code',
      type: 'code',
      placeholder: 'Paste Kubernetes probes, Express middleware, or health endpoints...',
      required: true,
    },
    {
      id: 'orchestrator',
      label: 'Orchestrator',
      type: 'text',
      placeholder: 'e.g. Kubernetes, Docker Swarm, ECS...',
      required: true,
    },
  ],
  systemPrompt: `You are a site reliability engineer specializing in microservice health.

Review health check implementations for correctness and effectiveness.

Output format:

## Health Check Review
| Probe Type | Configured | Threshold | Timeout | Issue |
|------------|------------|-----------|---------|-------|

## Problems
- Liveness vs readiness confusion, external dependencies in health checks, insufficient timeouts.

## Recommendations
- Separate liveness and readiness probes.
- Avoid database calls in liveness checks.
- Add startup probes for slow-initializing services.

## Example Config
- Corrected health check configuration.

Rules:
- Follow Kubernetes best practices where applicable.
- Explain why external dependencies in liveness probes are risky.`,

  outputType: 'markdown',
}
