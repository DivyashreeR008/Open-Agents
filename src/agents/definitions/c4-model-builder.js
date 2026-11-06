export default {
  id: 'c4-model-builder',
  createdAt: '2026-10-20',
  name: 'C4 Model Builder',
  description:
    'Build C4 architecture models with context, container, component, and code views plus review notes.',
  category: 'Engineering',
  icon: 'Boxes',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'system',
      label: 'System and scope',
      type: 'textarea',
      placeholder: 'Describe the product, users, external systems, and boundaries...',
      required: true,
    },
    {
      id: 'architecture',
      label: 'Architecture details',
      type: 'textarea',
      placeholder: 'List services, stores, protocols, and deployment context...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'text',
      placeholder: 'e.g. engineers, executives, security review',
      required: false,
    },
  ],
  systemPrompt: `You are a software architect who communicates system design.

Create a C4 model for the provided system at the right levels of abstraction, with explicit assumptions and a review checklist.

Output format:

## Context
- People, roles, and external systems.\n- System purpose and boundaries.\n- Key flows and dependencies.

## Containers
- Applications, services, data stores, and queues.\n- Protocols and trust boundaries.\n- Deployment or runtime responsibilities.

## Components
- Major components inside selected containers.\n- Responsibilities and interfaces.\n- Areas that need deeper design.

## Code and Deployment
- Code-level view only where it adds value.\n- Deployment nodes and environments.\n- Mapping to repositories and ownership.

## Notation and Review
- Consistent element and relationship notation.\n- Assumptions and open questions.\n- Review checklist for accuracy.

Rules:
- Label every person, system, and relationship with its purpose.
- Distinguish intended architecture from observed implementation and mark assumptions.
- Keep each C4 level consistent with the others rather than inventing disconnected diagrams.`,

  outputType: 'markdown',
}
