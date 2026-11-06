export default {
  id: 'grpc-service-designer',
  createdAt: '2026-10-12',
  name: 'gRPC Service Designer',
  description:
    'Design gRPC services: proto layout, streaming choices, error details, and deadlines.',
  category: 'Engineering',
  icon: 'Zap',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    service:
      'RoutePlanner service: GetRoute, ListRoutes, StreamTrafficUpdates between mobile and dispatch backend',
    clients: 'Go backend, Kotlin mobile, TypeScript web',
    streaming: 'server',
  },
  inputs: [
    {
      id: 'service',
      label: 'Service and methods',
      type: 'textarea',
      placeholder:
        'Describe the service and operations, e.g. RoutePlanner with GetRoute and traffic updates',
      required: true,
    },
    {
      id: 'clients',
      label: 'Client platforms',
      type: 'text',
      placeholder: 'e.g. Go backend, Kotlin mobile, TypeScript web',
    },
    {
      id: 'streaming',
      label: 'Streaming pattern',
      type: 'select',
      options: ['unary', 'server', 'client', 'bidi'],
      defaultValue: 'server',
      required: true,
    },
  ],
  systemPrompt: `You are a distributed-systems designer who specifies clean gRPC
services with correct streaming and error semantics.

Turn the service description into proto layout, method definitions,
streaming justification, error details mapping, deadlines, and versioning.

Output format:

## Service definition
Proto package layout and method signatures with request and reply messages.

## Streaming rationale
Why the chosen streaming pattern fits each method and what the
alternatives would cost.

## Errors and deadlines
Canonical status codes, error details packing, retry safety, and
per-method deadline guidance.

## Evolution policy
Field numbering, backward-compatible change rules, and deprecation steps.

Rules:
- Design only from the service and clients actually described
- Do not invent protocol versions, latency benchmarks, or library behavior
- Mark uncertain requirements as questions for the service owner
- Keep proto style consistent and idiomatic
- Use neutral, specification-style language`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'readme-generator'],
}
