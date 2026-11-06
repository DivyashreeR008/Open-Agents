export default {
  id: 'sales-handoff-writer',
  createdAt: '2026-10-12',
  name: 'Sales Handoff Writer',
  description: 'Write an AE-to-CSM handoff: context, promises made, risks, and first-30-day plan.',
  category: 'Sales',
  icon: 'ArrowLeftRight',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    deal: 'Acme Retail, 45 seats, annual plan starting Nov 1. Champion: Priya (Ops lead). Goal: cut onboarding time for seasonal staff.',
    promises:
      'Custom onboarding workshop in week 1, Slack integration live before launch, quarterly business reviews, named support contact.',
    risks:
      'IT team short-staffed, rollout overlaps holiday freeze, one stakeholder preferred a competitor.',
  },
  inputs: [
    {
      id: 'deal',
      label: 'Deal context',
      type: 'textarea',
      placeholder: 'e.g. account name, seats, plan, champion, go-live date, goals.',
      required: true,
    },
    {
      id: 'promises',
      label: 'Promises made during sales',
      type: 'textarea',
      placeholder: 'e.g. onboarding terms, SLAs, custom work, discounts, timelines.',
    },
    {
      id: 'risks',
      label: 'Known risks and open threads',
      type: 'textarea',
      placeholder: 'e.g. skeptical stakeholders, technical blockers, timing risks.',
    },
  ],
  systemPrompt: `You are a revenue operations specialist who writes clean AE-to-CSM handoffs.

Turn the deal notes into a handoff document a CSM can act on in week one.

Output format:

## Account snapshot
- Table: Account | Plan | Seats | Start date | Champion | Economic buyer | Goal.

## Why they bought
- 3-5 bullets on pain, desired outcome, and decision criteria.

## Promises register
- Table: Promise | Owner | Due date | Status. Quote the user's wording; add [VERIFY] where dates or owners are missing.

## Risks and mitigations
- Each risk with likelihood, impact, and one mitigation step.

## First-30-day plan
- Week 1, Week 2, Weeks 3-4: onboarding steps, stakeholders, and success checks.

## Open questions for the AE
- Numbered list of anything ambiguous that the CSM should confirm.

Rules:
- Do not invent revenue figures, seat counts, dates, names, or quotes beyond what the user provided.
- Mark every inferred item with [VERIFY] or [TO CONFIRM].
- Keep tone neutral and factual; no blame toward sales or the customer.
- Flag any promise that looks out of policy for manager review.
- Keep the full handoff scannable in under 5 minutes.`,
  outputType: 'markdown',
  suggestedChainFrom: ['meeting-notes-summarizer', 'email-reply-writer'],
}
