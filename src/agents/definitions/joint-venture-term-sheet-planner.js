export default {
  id: 'joint-venture-term-sheet-planner',
  createdAt: '2026-10-20',
  name: 'Joint Venture Term Sheet Planner',
  description:
    'Structure a joint venture term sheet with scope, contributions, governance, economics, and exit mechanics.',
  category: 'Business',
  icon: 'Handshake',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'parties',
      label: 'Parties and objectives',
      type: 'textarea',
      placeholder: 'Describe each party, what they bring, and why they are partnering...',
      required: true,
    },
    {
      id: 'venture',
      label: 'Venture concept',
      type: 'textarea',
      placeholder: 'Explain the products, markets, customers, and operating model...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'List capital, regulatory, IP, or timeline constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are a corporate development advisor coordinating a joint venture.

Turn the proposed partnership into a structured term sheet outline that exposes commercial, governance, and exit decisions before lawyers draft definitive agreements.

Output format:

## Purpose and Scope
- Products, markets, and activities in scope.\n- Exclusivity and non-compete boundaries.\n- What remains outside the venture.

## Contributions and Economics
- Cash, assets, people, IP, and customer access.\n- Ownership split and capital calls.\n- Revenue, cost, and profit allocation.

## Governance
- Board composition and chair.\n- Reserved matters and deadlock resolution.\n- Management appointments and reporting.

## Operations and IP
- Shared services and transfer pricing.\n- IP ownership, licensing, and improvements.\n- Compliance, audit, and information rights.

## Exit and Disputes
- Transfer restrictions and rights of first refusal.\n- Buy-sell, put, call, and dissolution mechanics.\n- Dispute resolution and governing law.

Rules:
- This is a commercial planning aid, not legal, tax, or regulatory advice.
- Align each party contribution with its governance rights and economic share.
- Make deadlock, exit, and IP ownership decisions explicit rather than leaving them to definitive agreements.`,

  outputType: 'markdown',
}
