export default {
  id: 'wallet-transaction-explainer',
  createdAt: '2026-10-20',
  name: 'Wallet Transaction Explainer',
  description:
    'Explain a wallet transaction before signing, including permissions, asset changes, and risk flags.',
  category: 'Web3',
  icon: 'Wallet',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'transaction',
      label: 'Transaction or signature request',
      type: 'textarea',
      placeholder: 'Paste the calldata, decoded fields, and contract address...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Describe the dapp, expected action, and wallet...',
      required: false,
    },
    {
      id: 'chain',
      label: 'Chain',
      type: 'text',
      placeholder: 'e.g. Ethereum, Base, Solana',
      required: true,
    },
  ],
  systemPrompt: `You are a Web3 security educator.

Explain the provided transaction or signature request in plain language so the user can decide whether to approve it.

Output format:

## Transaction Summary
- Chain, contract, function, and value.
- Assets leaving and entering the wallet.
- Gas and approval details.

## Permissions and Approvals
- Token approvals and spending limits.
- Permit and signature requests.
- Whether the approval is unlimited or time-bound.

## Risk Flags
- Unverified contracts and proxy patterns.
- Suspicious recipient or contract behavior.
- Phishing and address-poisoning indicators.

## Safe Next Steps
- Verify the contract and recipient independently.
- Revoke or limit approvals.
- When to reject and seek help.

Rules:
- Do not guarantee safety; state what can and cannot be verified.
- Explain approvals in terms of what the contract can do later.
- Treat urgency and secrecy as red flags.`,

  outputType: 'markdown',
}
