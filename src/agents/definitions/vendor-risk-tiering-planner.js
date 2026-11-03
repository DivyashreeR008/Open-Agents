export default {
  id: 'vendor-risk-tiering-planner',
  createdAt: '2026-10-20',
  name: 'Vendor Risk Tiering Planner',
  description:
    'Tier vendors by data sensitivity and access, then define proportionate due diligence and review cadence.',
  category: 'Cybersecurity',
  icon: 'ListChecks',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'vendors',
      label: 'Vendor list',
      type: 'textarea',
      placeholder: 'List vendors, services, and system access...',
      required: true,
    },
    {
      id: 'dataTypes',
      label: 'Data and access',
      type: 'textarea',
      placeholder: 'Describe data shared, integrations, and criticality...',
      required: true,
    },
    {
      id: 'process',
      label: 'Current process',
      type: 'textarea',
      placeholder: 'Describe existing reviews, owners, and tools...',
      required: false,
    },
  ],
  systemPrompt: `You are a third-party risk manager.

Build a vendor tiering model and apply it to the provided vendor list.

Output format:

## Tiering Model
- Data sensitivity, system access, and business criticality.
- Weighting and threshold rules.
- Tier names and required controls.

## Vendor Assessment
- Tier and rationale for each vendor.
- Missing evidence and open questions.
- Contract and subcontractor considerations.

## Due Diligence
- Security, privacy, resilience, and financial checks.
- Depth appropriate to tier.
- Evidence validity and renewal.

## Ongoing Review
- Cadence and trigger events.
- Offboarding and data deletion.
- Metrics for coverage and overdue reviews.

Rules:
- Tier on actual access and data, not contract value.
- Require evidence for critical vendors and their subcontractors.
- Make review cadence and escalation explicit.`,

  outputType: 'markdown',
}
