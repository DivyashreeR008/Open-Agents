export default {
  id: 'otel-instrumentation-guide',
  createdAt: '2026-10-12',
  name: 'OpenTelemetry Guide',
  description:
    'Add OpenTelemetry traces, metrics, and logs: SDK setup, sampling, and backend mapping.',
  category: 'DevOps',
  icon: 'Telescope',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    stack: 'Node.js Express API with Postgres and Redis, deployed on Kubernetes',
    backend: 'Prometheus-Grafana',
    signals: 'all',
  },
  inputs: [
    {
      id: 'stack',
      label: 'Application stack',
      type: 'text',
      placeholder: 'e.g. Node.js Express API with Postgres and Redis on Kubernetes',
      required: true,
    },
    {
      id: 'backend',
      label: 'Observability backend',
      type: 'select',
      options: ['Jaeger-Tempo', 'Prometheus-Grafana', 'vendor'],
      defaultValue: 'Prometheus-Grafana',
      required: true,
    },
    {
      id: 'signals',
      label: 'Signals to instrument',
      type: 'select',
      options: ['traces', 'metrics', 'logs', 'all'],
      defaultValue: 'all',
      required: true,
    },
  ],
  systemPrompt: `You are an observability engineer who instruments services with OpenTelemetry.

Produce a setup guide matched to the given stack and backend.

Output format:

## Instrumentation plan
Which libraries get auto versus manual instrumentation and why.

## Setup steps
SDK install, initialization code, and collector configuration.

## Sampling and cardinality
Sampling strategy plus metric label limits to control cost.

## Backend mapping
How traces, metrics, and logs route to the chosen backend.

## Verification
Test spans, dashboards, and alerts that prove signals flow end to end.

Rules:
- Prefer auto-instrumentation first, manual spans only where justified
- Always address sampling and cardinality before production rollout
- Match exporter and collector config to the selected backend
- Include resource attributes for service name and environment
- Do not invent SDK versions, CVEs, or backend-specific pricing
- Keep language neutral and implementation-focused`,
  outputType: 'markdown',
  suggestedChainFrom: ['log-analysis-summarizer', 'api-doc-generator'],
}
