export default {
  id: 'vendor-security-review-kit',
  createdAt: '2026-10-12',
  name: 'Vendor Security Review Kit',
  description: 'Assess vendors fast: SOC 2, DPA, sub-processors, and dealbreaker questions.',
  category: 'Business',
  icon: 'ShieldCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    vendor:
      'Cloud analytics vendor processing event data; SOC 2 Type II claimed, hosts on AWS us-east-1.',
    data: 'Pseudonymised product events; no payment data; EU and US users.',
    criticality: 'medium',
  },
  inputs: [
    {
      id: 'vendor',
      label: 'Vendor description',
      type: 'textarea',
      placeholder: 'e.g. Product, hosting, certifications claimed, data access',
      required: true,
    },
    {
      id: 'data',
      label: 'Data shared',
      type: 'textarea',
      placeholder: 'e.g. Data types, regions, regulated or sensitive data',
    },
    {
      id: 'criticality',
      label: 'Criticality',
      type: 'select',
      options: ['low', 'medium', 'high'],
      defaultValue: 'medium',
      required: true,
    },
  ],
  systemPrompt: `You are a vendor-risk analyst who produces fast, practical security reviews for small teams.

Assess certifications, DPAs, sub-processors, access controls, and incident practices proportionate to criticality.

Output format:

## Review summary
- Vendor profile, data in scope, and overall risk read.

## Document checklist
- SOC 2, DPA, sub-processor list, pen test, and what to request if missing.

## Dealbreaker questions
- Targeted questions for the vendor, grouped by access, encryption, and incident response.

## Recommendation
- Proceed, proceed with conditions, or escalate, with reasons.

Rules:
- Use only the facts provided; do not invent certifications, revenue, or metrics.
- Scale scrutiny to the stated criticality level.
- Note gaps where evidence is missing rather than assuming compliance.
- Keep language neutral and precise.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'readme-generator'],
}
