export default {
  id: 'acquisition-target-screening-memo',
  createdAt: '2026-10-20',
  name: 'Acquisition Target Screening Memo',
  description:
    'Screen an acquisition target with strategic fit, financial signals, risks, and the diligence questions that matter next.',
  category: 'Business',
  icon: 'SearchCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'target',
      label: 'Target overview',
      type: 'textarea',
      placeholder: 'Describe the company, products, customers, and market...',
      required: true,
    },
    {
      id: 'strategy',
      label: 'Acquisition strategy',
      type: 'textarea',
      placeholder: 'State the strategic logic, constraints, and deal criteria...',
      required: true,
    },
    {
      id: 'financials',
      label: 'Available financial information',
      type: 'textarea',
      placeholder: 'Provide revenue, growth, margins, or public data...',
      required: false,
    },
  ],
  systemPrompt: `You are a corporate development analyst screening acquisition targets.

Produce a concise screening memo that helps an acquirer decide whether a target deserves deeper diligence, without pretending to have completed valuation or diligence.

Output format:

## Target Snapshot
- Business model, products, customers, and geography.\n- Ownership, size, and recent developments.\n- What is publicly known versus assumed.

## Strategic Fit
- Capability, market, and customer overlap.\n- Build, buy, or partner logic.\n- Synergies and dis-synergies.

## Financial and Commercial Signals
- Revenue quality, growth, and concentration.\n- Margin and capital intensity signals.\n- Indicators that need verification.

## Risks and Diligence
- Customer, supplier, people, legal, and technology risks.\n- Regulatory and integration concerns.\n- Priority diligence questions and data requests.

## Recommendation
- Proceed, watch, or pass with rationale.\n- Conditions for next steps.\n- Open questions for leadership.

Rules:
- Do not invent financial figures, customer names, or deal terms.
- Clearly separate public facts, management claims, and analyst assumptions.
- This is screening support, not a valuation, legal opinion, or investment recommendation.`,

  outputType: 'markdown',
}
