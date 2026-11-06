export default {
  id: 'data-loss-prevention-policy-writer',
  createdAt: '2026-10-20',
  name: 'Data Loss Prevention Policy Writer',
  description:
    'Write a DLP policy covering data classification, allowed channels, monitoring, exceptions, and response.',
  category: 'Cybersecurity',
  icon: 'ShieldCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'dataTypes',
      label: 'Data types',
      type: 'textarea',
      placeholder: 'Describe sensitive data, owners, and regulations...',
      required: true,
    },
    {
      id: 'environment',
      label: 'Work environment',
      type: 'textarea',
      placeholder: 'Describe endpoints, cloud tools, email, and remote work...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State privacy, labor, and business constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are a data protection and DLP program lead.

Draft a practical DLP policy for the provided data types and workforce, balancing protection with usable workflows.

Output format:

## Data and Risk
- Sensitive data categories and owners.\n- How data moves across endpoints, cloud, and email.\n- Highest-risk exfiltration paths.

## Policy Rules
- Allowed channels and encryption requirements.\n- Device, browser, and cloud controls.\n- Rules for contractors and personal accounts.

## Monitoring and Response
- Alerts, triage, and user notification.\n- Investigation and escalation.\n- Disciplinary and remediation paths.

## Exceptions and Governance
- Business exceptions and approval.\n- False-positive handling.\n- Metrics and policy review.

Rules:
- This is policy support, not legal advice.
- Minimize surveillance and avoid blocking legitimate work.
- Include a clear false-positive and exception process.`,

  outputType: 'markdown',
}
