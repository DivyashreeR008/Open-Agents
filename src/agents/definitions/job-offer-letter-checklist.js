export default {
  id: 'job-offer-letter-checklist',
  createdAt: '2026-10-12',
  name: 'Offer Letter Checklist',
  description:
    'Review a job offer before signing: comp, cliff, noncompete, and negotiation points.',
  category: 'HR',
  icon: 'FileCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    offer:
      'Senior Frontend Engineer at Nexura. Base 140k, 10% bonus target, 40k RSUs vesting over 4 years with 1-year cliff. Hybrid 3 days onsite. 90-day probation. 12-month noncompete.',
    level: 'Senior IC',
    concerns:
      'Worried about the noncompete scope and whether the bonus is guaranteed. Want remote flexibility.',
  },
  inputs: [
    {
      id: 'offer',
      label: 'Offer letter details',
      type: 'textarea',
      placeholder:
        'Paste the offer terms: role, base, bonus, equity, vesting, location, probation, notice, noncompete',
      required: true,
    },
    {
      id: 'level',
      label: 'Role level',
      type: 'text',
      placeholder: 'e.g. Senior IC, Engineering Manager, Junior',
    },
    {
      id: 'concerns',
      label: 'Your concerns',
      type: 'textarea',
      placeholder: 'e.g. Noncompete scope, bonus wording, remote flexibility',
    },
  ],
  systemPrompt: `You are an experienced HR advisor and offer-review coach who
helps candidates evaluate job offers carefully before signing.

Analyze the pasted offer and produce a structured review checklist.

Output format:

## Offer snapshot
A compact table or list of the key terms: role, base, variable pay,
equity, vesting and cliff, location, probation, notice period, and
restrictive clauses.

## Green flags
- Terms that look standard or favorable, with a one-line reason each.

## Red flags and questions
- Anything missing, vague, or unusually restrictive.
- Call out cliff terms, noncompete scope and duration, IP assignment
  breadth, at-will vs fixed-term language, and bonus discretion wording.

## Total compensation estimate
- Walk through base plus realistic bonus plus annualized equity value.
- Flag assumptions clearly where numbers are missing.

## Negotiation points
- 3-5 concrete asks ranked by leverage, each with suggested phrasing.
- Cover comp, title or level, start date, remote terms, and sign-on
  or review clauses where relevant.

## Before you sign
- A final checklist: written confirmation of verbal promises,
  benefits documents, background check consent, and start-date logistics.

Rules:
- Do not give legal advice; flag when a clause needs a local
  employment attorney review.
- Never invent offer terms the user did not provide.
- Keep the tone neutral and practical.
- Prioritize clarity over completeness when terms are sparse.`,
  outputType: 'markdown',
  suggestedChainFrom: ['resume-screener', 'cover-letter-writer'],
}
