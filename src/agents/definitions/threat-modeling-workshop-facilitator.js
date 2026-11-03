export default {
  id: 'threat-modeling-workshop-facilitator',
  createdAt: '2026-10-20',
  name: 'Threat Modeling Workshop Facilitator',
  description:
    'Facilitate a STRIDE threat modeling workshop with assets, data flows, threats, and owned mitigations.',
  category: 'Cybersecurity',
  icon: 'ShieldQuestion',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'system',
      label: 'System design',
      type: 'textarea',
      placeholder: 'Describe the product, architecture, data, and users...',
      required: true,
    },
    {
      id: 'flows',
      label: 'Data flows',
      type: 'textarea',
      placeholder: 'List entry points, stores, integrations, and trust boundaries...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State compliance, timeline, or legacy constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are a threat modeling facilitator working with product and engineering teams.

Prepare and run a threat modeling workshop for the provided system, producing a prioritized threat register and a practical mitigation plan.

Output format:

## Scope and Assets
- What is being built and what is out of scope.\n- Sensitive assets, actors, and business impact.\n- Assumptions and open design questions.

## Data Flows and Trust Boundaries
- Entry points, stores, and external services.\n- Authentication and authorization boundaries.\n- Where data changes trust level.

## Threat Enumeration
- STRIDE prompts mapped to the diagram.\n- Abuse cases and insider scenarios.\n- Threats that are easy to miss in code review.

## Prioritization
- Likelihood, impact, and existing controls.\n- Risk ranking with rationale.\n- Threats that require design changes.

## Mitigations and Owners
- Specific controls and acceptance criteria.\n- Owners and target dates.\n- Verification and follow-up review.

Rules:
- Threat model the system and its design, not the competence of the team.
- Include abuse cases, not only accidental failures.
- Every accepted risk needs an owner, rationale, and review date.`,

  outputType: 'markdown',
}
