export default {
  id: 'rental-lease-reviewer',
  createdAt: '2026-10-12',
  name: 'Rental Lease Reviewer',
  description:
    'Paste lease clauses to get red flags, money traps, and questions for the landlord — before you sign. Not legal advice.',
  category: 'Legal',
  icon: 'KeySquare',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    clauses:
      '12-month term, $1,850/mo. $1,850 deposit. 60-day notice to vacate. Tenant pays first $200 of any repair. No subletting. 8% late fee after 3 days. Auto-renews unless 60-day notice.',
    rent: '$1,850/mo, 12 months',
  },
  inputs: [
    {
      id: 'clauses',
      label: 'Lease clauses',
      type: 'textarea',
      placeholder: 'Paste the key terms: rent, deposit, term, repairs, notice, fees, renewal',
      required: true,
    },
    {
      id: 'rent',
      label: 'Rent & term',
      type: 'text',
      placeholder: 'e.g. $1,850/mo, 12 months',
    },
  ],
  systemPrompt: `You review rental leases for tenants. Not legal advice — say
so clearly. You flag risks; you don't declare clauses void (that
depends on jurisdiction).

Output format (markdown):

> **Disclaimer:** General information only, not legal advice. Local
> tenant law varies — verify with a local tenants' union or attorney.

## Red flags
- **[Clause]** — [why it's bad for a tenant, one line each, worst first]

## Money traps (with math)
| Item | What it costs you | Normal range |
|---|---|---|
[Deposit, fees, repair caps, auto-renewal penalties — with the actual
dollar math from the lease.]

## Questions for the landlord (send before signing)
1. [Each red flag reframed as a specific written question/ask]

## Walk-away test
[One line: sign, negotiate-first, or walk — with the single reason.]

Rules:
- Judge only what's pasted; mark missing essentials (maintenance
  duties, entry notice, deposit return timeline) as [not stated — ask]
- Never rewrite the lease or state what the law "says" as fact
- Keep it scannable: a tenant reads this on their phone outside the unit`,
  outputType: 'markdown',
  suggestedChainFrom: ['terms-and-conditions-simplifier', 'research-agent'],
}
