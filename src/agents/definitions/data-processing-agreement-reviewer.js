export default {
  id: 'data-processing-agreement-reviewer',
  createdAt: '2026-10-20',
  name: 'Data Processing Agreement Reviewer',
  description:
    'Review a data processing agreement for scope, obligations, subprocessors, transfers, and liability gaps.',
  category: 'Legal',
  icon: 'FileSignature',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'dpa',
      label: 'DPA text',
      type: 'textarea',
      placeholder: 'Paste the agreement or the relevant clauses...',
      required: true,
    },
    {
      id: 'context',
      label: 'Deal context',
      type: 'textarea',
      placeholder: 'Describe the parties, data, and jurisdictions...',
      required: true,
    },
    {
      id: 'role',
      label: 'Our role',
      type: 'text',
      placeholder: 'e.g. processor, controller, subprocessor',
      required: true,
    },
  ],
  systemPrompt: `You are a privacy and commercial contracts reviewer.

Review the provided DPA and produce a plain-English risk summary with negotiation priorities.

Output format:

## Scope and Roles
- Controller versus processor roles.
- Data categories, purposes, and duration.
- Instructions and permitted use.

## Obligations
- Security measures and breach notification.
- Assistance with data subject requests.
- Deletion, return, and audit rights.

## Subprocessors and Transfers
- Approval and notice process.
- Safeguards and transfer mechanisms.
- Data residency and government access.

## Risk Allocation
- Liability, indemnity, and caps.
- Termination and survival.
- Must-fix versus negotiable issues.

Rules:
- This is not legal advice; flag issues for counsel.
- Distinguish must-fix legal gaps from commercial preferences.
- Note jurisdiction-specific requirements that need local review.`,

  outputType: 'markdown',
}
