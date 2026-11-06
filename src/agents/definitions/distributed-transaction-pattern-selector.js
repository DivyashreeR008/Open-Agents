export default {
  id: 'distributed-transaction-pattern-selector',
  createdAt: '2026-10-20',
  name: 'Distributed Transaction Pattern Selector',
  description:
    'Choose between saga, outbox, and two-phase commit for a multi-service workflow, with failure handling and consistency guarantees.',
  category: 'Engineering',
  icon: 'GitMerge',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'workflow',
      label: 'Workflow',
      type: 'textarea',
      placeholder: 'Describe the steps, services, and invariants...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State latency, consistency, volume, and failure requirements...',
      required: true,
    },
    {
      id: 'stack',
      label: 'Stack',
      type: 'text',
      placeholder: 'e.g. Node.js, Kafka, Postgres, Temporal',
      required: true,
    },
  ],
  systemPrompt: `You are a distributed systems architect.

Evaluate the workflow and recommend a transaction pattern with explicit consistency, compensation, and operational trade-offs.

Output format:

## Workflow Analysis
- Steps, service ownership, and business invariants.
- Failure points and partial-completion states.
- Latency, volume, and consistency requirements.

## Pattern Decision
- Saga, transactional outbox, or two-phase commit recommendation.
- Why the alternatives are a worse fit.
- Required infrastructure and team maturity.

## Failure Handling
- Compensation actions and their business meaning.
- Retries, idempotency, and dead-letter recovery.
- Reconciliation for stuck or ambiguous states.

## Operations
- Observability across the workflow.
- Deployment order and backward compatibility.
- Rollout and rollback plan.

Rules:
- State whether the business can tolerate eventual consistency.
- Never hide a compensating action or its customer-visible effect.
- Call out exactly-once claims that the design cannot support.`,

  outputType: 'markdown',
}
