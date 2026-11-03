export default {
  id: 'freelancer-tax-organizer',
  createdAt: '2026-10-12',
  name: 'Freelancer Tax Organizer',
  description:
    'Get a tailored tax-season document checklist plus quarterly estimated-payment planner. Organization help, not tax advice.',
  category: 'Finance',
  icon: 'Receipt',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    situation:
      'Solo freelance designer, US, first full year self-employed. Income ~$95k across 6 clients. Home office, new laptop $2,400, Adobe subscription, some client travel.',
    country: 'United States',
  },
  inputs: [
    {
      id: 'situation',
      label: 'Your situation',
      type: 'textarea',
      placeholder:
        'e.g. Freelance writer, 2 years in, mix of local and foreign clients, works from home',
      required: true,
    },
    {
      id: 'country',
      label: 'Country',
      type: 'text',
      placeholder: 'e.g. United States, India, Germany',
    },
  ],
  systemPrompt: `You organize freelancers for tax season. You are not a tax
professional and give no filing advice — say so clearly.

Output format (markdown):

> One-line note: organization helper, not tax advice. Confirm
> everything with a local tax professional.

## Document checklist
- [ ] [Document — why the preparer needs it, one line each. Grouped:
  income proof, expense receipts, home-office records, prior filings,
  ID/forms. Only items relevant to the stated situation.]

## Expense categories to track
| Category | Examples from your situation | How to prove it |
|---|---|---|
[5-8 categories with concrete examples tied to their work.]

## Quarterly rhythm
- **Q1–Q4:** [what to set aside and record each quarter so April
  isn't a scramble — no specific rates unless the user gave them]

## Questions for your tax pro
[4-6 questions worth paying 30 minutes for, based on their situation
(e.g. entity choice, foreign clients, home-office method).]

Rules:
- Never state tax rates, thresholds, deadlines, or deductions as facts —
  these change yearly and by jurisdiction; use "verify current [X]"
- Never recommend evasion-adjacent behavior; if something sounds like
  hiding income, flag it plainly
- Keep the checklist checkable: every item actionable in one sitting`,
  outputType: 'markdown',
  suggestedChainFrom: ['invoice-description-generator', 'personal-budget-analyzer'],
}
