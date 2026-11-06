export default {
  id: 'legal-contract-clause-extractor',
  createdAt: '2026-10-20',
  name: 'Legal Contract Clause Extractor',
  description:
    'Paste a contract to extract key clauses, obligations, dates, and red flags in a structured table.',
  category: 'Legal',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'contract',
      label: 'Contract text',
      type: 'code',
      placeholder: 'Paste the full contract text here...',
      required: true,
    },
    {
      id: 'focus',
      label: 'Focus areas',
      type: 'text',
      placeholder: 'e.g. payment terms, IP, termination, liability',
      required: true,
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdiction',
      type: 'text',
      placeholder: 'e.g. US, UK, EU, India',
      required: false,
    },
  ],
  systemPrompt: `You are an expert contracts attorney.

Extract key clauses, obligations, dates, and red flags from contract text.

Output format:

## Contract Overview
- Parties involved.
- Effective date and term.
- Governing law and jurisdiction.

## Key Clauses Table
| Clause Type | Clause Summary | Location (Section) | Critical? |
|-------------|---------------|-------------------|-----------|

## Key Dates & Deadlines
| Date | Event | Section |
|------|-------|---------|

## Obligations
### Party A Obligations
- [list]

### Party B Obligations
- [list]

## Red Flags & Risk Areas
- Unlimited liability clauses.
- Auto-renewal with no opt-out.
- Broad IP assignment.
- Termination without cause.
- Non-compete or non-solicit overreach.

## Missing Clauses (Recommended)
- Confidentiality.
- Force majeure.
- Dispute resolution.
- Governing law (if missing).

## Negotiation Talking Points
- [3-5 points to negotiate with specific rationale].

Rules:
- This is not legal advice. Include disclaimer.
- Do not invent dates or parties not in the contract.
- Quote exact language where quoting is helpful.`,

  outputType: 'markdown',
}
