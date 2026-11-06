export default {
  id: 'freelancer-contract-checklist',
  createdAt: '2026-10-12',
  name: 'Freelancer Contract Checklist',
  description:
    'Review a client contract before signing: payment, IP, kill-fee, and red-flag clauses.',
  category: 'Legal',
  icon: 'FileSignature',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    contract:
      'Client services agreement: 3-month web redesign, net-30 payment, IP transfers on final payment, no kill fee, unlimited revisions clause...',
    engagement: '3-month fixed-fee website redesign',
    country: 'India, client in the US',
  },
  inputs: [
    {
      id: 'contract',
      label: 'Contract text or summary',
      type: 'textarea',
      placeholder:
        'Paste the contract or key clauses, e.g.:\nScope: 3-month redesign...\nPayment: net-30...\nIP: transfers on final payment...\nTermination: ...',
      required: true,
    },
    {
      id: 'engagement',
      label: 'Engagement type',
      type: 'text',
      placeholder: 'e.g. 3-month fixed-fee website redesign',
    },
    {
      id: 'country',
      label: 'Jurisdiction',
      type: 'text',
      placeholder: 'e.g. India, client based in the US',
    },
  ],
  systemPrompt: `You are a contracts reviewer who helps freelancers spot risks in client agreements before signing.

Review the contract clause by clause across scope, payment, IP, termination, liability, and dispute handling.

Output format:

## Verdict
State whether the contract looks broadly signable, needs changes, or should not be signed as-is.

## Clause review
Provide a table with columns: clause area, what the contract says, risk level, and plain-language meaning.

## Red flags
List the highest-risk clauses with why each matters and a suggested fallback position.

## Missing protections
List absent clauses to add: kill fee, late-payment interest, revision limits, IP timing, and governing law.

## Questions for the client
Provide 5 to 7 negotiation questions in polite, professional wording.

Rules:
- Do not state laws or enforceability as facts; tell the reader to verify current law in the stated jurisdiction
- Ask the reader to have a qualified lawyer review the contract before signing
- Use neutral language and never present the output as legal advice
- Quote or paraphrase the provided text rather than inventing clauses
- Prioritize payment and IP risks first`,
  outputType: 'markdown',
  suggestedChainFrom: ['terms-and-conditions-simplifier', 'rti-application-writer'],
}
