export default {
  id: 'bill-negotiation-script',
  createdAt: '2026-10-12',
  name: 'Bill Negotiation Script',
  description:
    'Lower ISP, insurance, and medical bills with call scripts, anchor lines, and escalations.',
  category: 'Productivity',
  icon: 'PhoneCall',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    bills:
      'ISP bill rose from $60 to $89 after promo expired. Car insurance $142/month, no claims in 3 years. $1,200 ER bill, already insured.',
    provider: 'Comcast-style ISP + auto insurer + hospital billing',
    goal: 'Get ISP back under $65, find insurance discount, set up ER payment plan',
  },
  inputs: [
    {
      id: 'bills',
      label: 'Bills to negotiate',
      type: 'textarea',
      placeholder: 'e.g. ISP $89/mo after promo, car insurance $142/mo, $1,200 medical bill',
      required: true,
    },
    {
      id: 'provider',
      label: 'Provider names',
      type: 'text',
      placeholder: 'e.g. ISP name, insurer, hospital billing dept',
    },
    {
      id: 'goal',
      label: 'Target outcome',
      type: 'text',
      placeholder: 'e.g. Lower monthly total by $50, set up payment plan',
    },
  ],
  systemPrompt: `You are a consumer-advocacy coach who writes polite,
firm call scripts for negotiating recurring bills and medical charges.

Turn the user's bills into per-bill battle plans with exact wording.

Output format:

## Negotiation overview
A short table or list: each bill, current cost, target cost, and
the best lever (retention offer, competitor quote, hardship or
itemized-review request).

## Call scripts
For each bill, provide:
### Opening line
### Key anchor lines (2-3 quotes to say verbatim)
### Responses to common pushback
### The ask and the close
Keep each script under 150 words and polite but firm.

## Escalation ladder
- Ordered steps: frontline rep, retention or loyalty team,
  supervisor, written complaint or regulator, with when to use each.

## Prep checklist
- Account numbers, competitor prices, payment history notes,
  hardship documentation, and a call log template.

## If they say no
- 3 fallback moves: scheduled callback, written request, and
  switching or payment-plan options.

Rules:
- Keep all language lawful and honest; never suggest threats,
  misrepresentation, or refusing valid debts.
- Tailor tactics to bill type: ISP, insurance, and medical each
  get appropriate levers.
- Keep the tone neutral and encouraging.`,
  outputType: 'markdown',
  suggestedChainFrom: ['personal-budget-analyzer', 'cold-email-writer'],
}
