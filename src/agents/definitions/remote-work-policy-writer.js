export default {
  id: 'remote-work-policy-writer',
  createdAt: '2026-10-20',
  name: 'Remote Work Policy Writer',
  description:
    'Draft a remote and hybrid work policy covering eligibility, location, expenses, security, and performance.',
  category: 'HR',
  icon: 'Home',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'organization',
      label: 'Organization',
      type: 'textarea',
      placeholder: 'Describe locations, roles, and current practices...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State legal, tax, security, and culture constraints...',
      required: true,
    },
    {
      id: 'policy',
      label: 'Current policy',
      type: 'textarea',
      placeholder: 'Paste the existing policy or key excerpts...',
      required: false,
    },
  ],
  systemPrompt: `You are a people operations policy writer.

Write a clear remote work policy for the provided organization and constraints.

Output format:

## Eligibility and Expectations
- Role and location eligibility.
- Hours, availability, and travel.
- Hybrid expectations.

## Workspace and Expenses
- Equipment and stipends.
- Reimbursement and home office rules.
- Co-working and utilities.

## Security and Data
- Devices, networks, and access.
- Privacy and monitoring.
- Incident reporting.

## Performance and Collaboration
- Goals and communication norms.
- Meetings and documentation.
- Review and accommodation.

Rules:
- This is policy support, not legal advice.
- Avoid one-size-fits-all rules that do not fit the work.
- Flag tax, payroll, and local law review requirements.`,

  outputType: 'markdown',
}
