export default {
  id: 'nda-generator',
  createdAt: '2026-10-11',
  name: 'NDA Generator',
  description:
    'Enter the parties, purpose, and term to get a plain-English mutual NDA draft with a review checklist. Not legal advice.',
  category: 'Legal',
  icon: 'Scale',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    partyA: 'Finchpay GmbH, Berlin',
    partyB: 'Marina Weiss, freelance designer',
    purpose: 'Evaluating a redesign of the Finchpay onboarding flow',
    term: '2 years',
    jurisdiction: 'Germany',
  },
  inputs: [
    {
      id: 'partyA',
      label: 'Party A (name + location)',
      type: 'text',
      placeholder: 'e.g. Acme Inc., Delaware',
      required: true,
    },
    {
      id: 'partyB',
      label: 'Party B (name + location)',
      type: 'text',
      placeholder: 'e.g. Jane Doe, contractor',
      required: true,
    },
    {
      id: 'purpose',
      label: 'Purpose of disclosure',
      type: 'textarea',
      placeholder: 'e.g. Evaluating a potential integration partnership',
      required: true,
    },
    {
      id: 'term',
      label: 'Confidentiality term',
      type: 'select',
      options: ['1 year', '2 years', '3 years', '5 years'],
      defaultValue: '2 years',
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdiction (optional)',
      type: 'text',
      placeholder: 'e.g. California, England & Wales',
    },
  ],
  systemPrompt: `You draft a plain-English mutual NDA. You are not a lawyer and
the output is not legal advice — say so clearly.

Output format (markdown):

> **Disclaimer:** This is a template draft for discussion purposes, not
> legal advice. Have a qualified attorney review it before signing.

## Mutual Non-Disclosure Agreement (Draft)
1. **Parties:** [A] ("Discloser"/"Recipient" as applicable) and [B]
2. **Purpose:** [stated purpose — disclosure outside this purpose is not covered]
3. **Confidential Information:** [definition: marked materials, plus
   what's explicitly excluded — public knowledge, prior possession,
   independently developed, legally required disclosure]
4. **Obligations:** [care standard, no-copy/no-reverse-engineer,
   need-to-know sharing, return-or-destroy on request]
5. **Term:** [selected term from effective date]
6. **No license / no commitment:** [standard clause in one line]
7. **Governing law:** [jurisdiction or placeholder]
8. **Signatures:** [two blocks with name, title, date]

## Review checklist
- [ ] Term length fits the sensitivity (shorter for fast-moving info)
- [ ] Exclusions are explicit (residual knowledge? prior work?)
- [ ] One-way vs mutual: confirm mutual is actually needed
- [ ] Jurisdiction and venue filled in
- [ ] Attorney review before signature

Rules:
- Plain English first; keep necessary legal terms but gloss them briefly
- Never invent party details, dates, or governing law — use placeholders
- Keep it to one page of substance; NDAs bloat fast`,
  outputType: 'markdown',
  suggestedChainFrom: ['terms-and-conditions-simplifier', 'rti-application-writer'],
}
