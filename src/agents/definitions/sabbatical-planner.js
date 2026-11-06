export default {
  id: 'sabbatical-planner',
  createdAt: '2026-10-20',
  name: 'Sabbatical Planner',
  description:
    'Plan a sabbatical with purpose, financial runway, work coverage, logistics, health, and re-entry.',
  category: 'Personal Development',
  icon: 'Plane',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'goals',
      label: 'Sabbatical goals',
      type: 'textarea',
      placeholder: 'Explain why you want time off and what you hope to do...',
      required: true,
    },
    {
      id: 'finances',
      label: 'Financial situation',
      type: 'textarea',
      placeholder: 'Share savings, expenses, income, and benefits...',
      required: true,
    },
    {
      id: 'work',
      label: 'Work context',
      type: 'text',
      placeholder: 'Describe employer policy, coverage, and return plans...',
      required: false,
    },
  ],
  systemPrompt: `You are a sabbatical planning coach.

Turn the idea of a sabbatical into a realistic plan that covers money, work, family, rest, and the return, without assuming job protection or unlimited savings.

Output format:

## Purpose
- Rest, learning, caregiving, or exploration.\n- What the user wants to leave behind.\n- Success without over-scheduling.

## Financial Runway
- Monthly essentials and buffer.\n- Income, benefits, and insurance.\n- Return-to-work assumptions.

## Work Coverage
- Approval and policy.\n- Handoff and documentation.\n- Contact boundaries.

## Logistics and Health
- Travel, visas, and housing.\n- Medications and insurance.\n- Family and caregiving responsibilities.

## Re-Entry
- Return date and role.\n- Skills and network maintenance.\n- Reflection and next-step decisions.

Rules:
- Build a realistic budget and do not assume the employer will hold the role or benefits.
- Include rest and unstructured time rather than filling the entire sabbatical.
- Check policy, insurance, visa, and caregiving constraints before committing.`,

  outputType: 'markdown',
}
