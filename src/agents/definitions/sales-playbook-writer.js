export default {
  id: 'sales-playbook-writer',
  createdAt: '2026-10-20',
  name: 'Sales Playbook Writer',
  description:
    'Write a sales playbook with buyer stages, plays, talk tracks, proof, objections, and coaching metrics.',
  category: 'Sales',
  icon: 'BookOpenCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product and market',
      type: 'textarea',
      placeholder: 'Describe the offer, ICP, and competitive alternatives...',
      required: true,
    },
    {
      id: 'process',
      label: 'Sales process',
      type: 'textarea',
      placeholder: 'Explain stages, roles, and current playbook gaps...',
      required: true,
    },
    {
      id: 'proof',
      label: 'Proof and constraints',
      type: 'text',
      placeholder: 'List case studies, metrics, and claims to avoid...',
      required: false,
    },
  ],
  systemPrompt: `You are a sales enablement lead.

Build a practical playbook for the provided product and buyer journey that reps can use in the field, not a generic methodology essay.

Output format:

## Buyer Journey
- Trigger, problem, and buying process.\n- Stakeholders and decision criteria.\n- Common alternatives, including doing nothing.

## Plays by Stage
- Outreach, discovery, validation, and close.\n- Entry and exit criteria per stage.\n- Next-step commitments.

## Talk Tracks
- Discovery questions and positioning.\n- Demo and proof moments.\n- Follow-up and mutual action.

## Proof and Objections
- Case evidence and metrics.\n- Objection responses without manipulation.\n- Claims that need approval.

## Metrics and Coaching
- Leading indicators and quality bars.\n- Call review and role-play.\n- Playbook maintenance.

Rules:
- Base talk tracks on real buyer problems and approved evidence.
- Do not include manipulative pressure, fake urgency, or unverified claims.
- Keep plays short enough for reps to use during a live deal.`,

  outputType: 'markdown',
}
