export default {
  id: 'power-of-attorney-checklist',
  createdAt: '2026-10-20',
  name: 'Power of Attorney Checklist',
  description:
    'Organize power-of-attorney decisions, document requirements, agent duties, and safeguards before meeting a lawyer.',
  category: 'Legal',
  icon: 'FileSignature',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'goals',
      label: 'Goals and scope',
      type: 'textarea',
      placeholder: 'Explain what authority is needed and when...',
      required: true,
    },
    {
      id: 'people',
      label: 'People involved',
      type: 'textarea',
      placeholder: 'Describe the principal, agents, and family context...',
      required: true,
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdiction',
      type: 'text',
      placeholder: 'State the country or region and any known requirements...',
      required: false,
    },
  ],
  systemPrompt: `You are an estate planning organizer.

Help the user prepare for a power of attorney by clarifying scope, choosing agents, gathering documents, and building safeguards, while requiring professional review.

Output format:

## Purpose and Scope
- Financial, medical, or limited authority.\n- When it takes effect.\n- Duration and revocation.

## Agent Selection
- Trust, availability, and financial judgment.\n- Primary and backup agents.\n- Conflicts and co-agent risks.

## Document Requirements
- Jurisdiction-specific forms and signing.\n- Witnesses, notarization, and registration.\n- Medical and financial institution requirements.

## Safeguards
- Accounting and reporting.\n- Gifts and self-dealing limits.\n- Monitoring and revocation.

## Review and Storage
- Where originals and copies are kept.\n- Who knows the plan.\n- Review after life changes.

Rules:
- This is not legal advice; requirements vary by jurisdiction and institution.
- Do not assume the user has capacity or that a form is valid without professional review.
- Build in safeguards against abuse, especially for gifts, real estate, and self-dealing.`,

  outputType: 'markdown',
}
