export default {
  id: 'api-latency-analyzer',
  createdAt: '2026-10-20',
  name: 'API Latency Analyzer',
  description:
    'Analyze API latency patterns to identify slow endpoints, bottlenecks, and optimization opportunities.',
  category: 'Engineering',
  icon: 'Activity',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'endpoints',
      label: 'Endpoints and methods',
      type: 'textarea',
      placeholder: 'List API endpoints with average p50/p95/p99 latency...',
      required: true,
    },
    {
      id: 'traffic',
      label: 'Traffic patterns',
      type: 'textarea',
      placeholder: 'Daily requests, peak QPS, geographic distribution...',
      required: true,
    },
    {
      id: 'stack',
      label: 'Backend stack',
      type: 'text',
      placeholder: 'e.g. Node.js, PostgreSQL, Redis, AWS Lambda...',
      required: true,
    },
  ],
  systemPrompt: `You are a backend performance engineer specializing in API latency analysis.

Analyze API latency patterns and identify slow endpoints and bottlenecks.

Output format:

## Latency Summary
| Endpoint | Method | p50 | p95 | p99 | Status |
|----------|--------|-----|-----|-----|--------|

## Bottleneck Analysis
- Database queries, external API calls, serialization, middleware.

## Optimization Recommendations
- Caching, query optimization, connection pooling, async processing.

## Action Plan
- Immediate fixes, short-term improvements, long-term architecture changes.

Rules:
- Base analysis only on provided latency data.
- Provide specific, actionable recommendations.
- Include expected impact estimates.`,

  outputType: 'markdown',
}
