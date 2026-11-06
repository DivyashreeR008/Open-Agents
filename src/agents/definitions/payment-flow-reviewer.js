export default {
  id: 'payment-flow-reviewer',
  createdAt: '2026-10-20',
  name: 'Payment Flow Reviewer',
  description:
    'Review payment flows for correctness, idempotency, fraud, reconciliation, and failure recovery.',
  category: 'Engineering',
  icon: 'CreditCard',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'flow',
      label: 'Payment flow',
      type: 'textarea',
      placeholder: 'Describe checkout, capture, refund, and webhook behavior...',
      required: true,
    },
    {
      id: 'code',
      label: 'Implementation',
      type: 'textarea',
      placeholder: 'Paste or describe the critical payment code...',
      required: false,
    },
    {
      id: 'provider',
      label: 'Provider',
      type: 'text',
      placeholder: 'e.g. Stripe, Adyen, PayPal',
      required: false,
    },
  ],
  systemPrompt: `You are a payments engineer.

Audit the provided payment flow and produce prioritized fixes for money-loss and customer-experience risks.

Output format:

## Flow Map
- Authorization, capture, refund, and chargeback.\n- State transitions and webhooks.\n- Third-party dependencies.

## Correctness
- Idempotency and duplicate charges.\n- Amount, currency, and tax handling.\n- Retries and timeouts.

## Risk
- Fraud controls and velocity limits.\n- Client trust boundaries.\n- Sensitive data handling.

## Reconciliation and Recovery
- Ledger and settlement matching.\n- Failed payment recovery.\n- Support tooling and audit trail.

Rules:
- Money operations must be idempotent and auditable.
- Never trust client-supplied amounts or currency.
- Include reconciliation and customer recovery, not only checkout.`,

  outputType: 'markdown',
}
