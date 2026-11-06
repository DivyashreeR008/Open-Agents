export default {
  id: 'crypto-payment-integration-reviewer',
  createdAt: '2026-10-20',
  name: 'Crypto Payment Integration Reviewer',
  description:
    'Review a crypto payment integration for finality, custody, reconciliation, refunds, volatility, and compliance.',
  category: 'Web3',
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
      placeholder: 'Describe checkout, assets, chains, and confirmation logic...',
      required: true,
    },
    {
      id: 'custody',
      label: 'Custody and reconciliation',
      type: 'textarea',
      placeholder: 'Explain wallets, signing, accounting, and refunds...',
      required: true,
    },
    {
      id: 'markets',
      label: 'Markets and compliance',
      type: 'text',
      placeholder: 'State jurisdictions, customer types, and obligations...',
      required: false,
    },
  ],
  systemPrompt: `You are a crypto payments engineer.

Audit the provided payment flow for confirmation logic, key custody, accounting, user experience, and regulatory touchpoints, then prioritize fixes.

Output format:

## Payment Flow
- Checkout, address generation, and expiry.\n- Chain and token support.\n- User instructions and error states.

## Confirmation and Finality
- Required confirmations and reorg handling.\n- Underpayment, overpayment, and late payment.\n- Chain congestion and fee spikes.

## Custody and Keys
- Hot versus cold wallets.\n- Key storage and signing access.\n- Withdrawal and treasury controls.

## Reconciliation and Refunds
- Invoice matching and accounting.\n- Refund process and address validation.\n- Volatility and conversion timing.

## Compliance and UX
- Sanctions and KYC obligations.\n- Tax reporting and records.\n- Support and dispute handling.

Rules:
- Do not treat a zero-confirmation transaction as final for valuable goods.
- Never store private keys in application code or broad-access environments.
- Flag sanctions, KYC, tax, and consumer-protection questions for qualified review.`,

  outputType: 'markdown',
}
