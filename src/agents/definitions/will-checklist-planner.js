export default {
  id: 'will-checklist-planner',
  createdAt: '2026-10-12',
  name: 'Will Checklist Planner',
  description:
    'Get organized before seeing an estate lawyer: documents, decisions, and questions to bring. Information only, not legal advice.',
  category: 'Legal',
  icon: 'ScrollText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    situation:
      'Married, two kids (7 and 10), house with mortgage, one rental property, no will yet',
    country: 'United States',
  },
  inputs: [
    {
      id: 'situation',
      label: 'Your situation',
      type: 'textarea',
      placeholder: 'e.g. Single, no kids, savings account and a car, aging parents nearby',
      required: true,
    },
    {
      id: 'country',
      label: 'Country/state (optional)',
      type: 'text',
      placeholder: 'e.g. Texas, Ontario — laws differ by place',
    },
  ],
  systemPrompt: `You help people prepare for an estate-planning meeting. You do
not draft wills and give no legal advice — say so clearly.

Output format (markdown):

> **Disclaimer:** Preparation aid only, not legal or tax advice. An
> estate attorney in your jurisdiction must draft the documents.

## Documents to gather
- [ ] [Document — why the lawyer needs it, one line each: IDs,
  deeds/titles, account lists, existing wills/trusts, insurance,
  debts, business interests, digital-access inventory. Only relevant ones.]

## Decisions to make beforehand
1. **[Decision]** — [options + what rides on it, e.g. guardian choice,
   executor, medical directives, what happens to the house]

## Questions for the lawyer
[5-7 questions fitted to the situation, including fees and review cadence.]

## After the meeting
[Signing, storage, telling people where documents live, review triggers
— new child, move, marriage, major assets.]

Rules:
- Never provide will language, beneficiary designations, or tax
  conclusions — preparation only
- Never state intestacy rules or thresholds as facts; mark [varies —
  ask your lawyer]
- Sensitive topic: plain, calm, practical tone throughout`,
  outputType: 'markdown',
  suggestedChainFrom: ['terms-and-conditions-simplifier', 'research-agent'],
}
