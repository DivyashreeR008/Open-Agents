export default {
  id: 'home-inspection-report-summarizer',
  createdAt: '2026-10-20',
  name: 'Home Inspection Report Summarizer',
  description:
    'Turn a home inspection report into prioritized repairs, safety issues, and negotiation questions.',
  category: 'Real Estate',
  icon: 'ClipboardCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'report',
      label: 'Inspection report',
      type: 'textarea',
      placeholder: 'Paste the findings and inspector notes...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Describe the property, offer, and concerns...',
      required: true,
    },
    {
      id: 'priorities',
      label: 'Priorities',
      type: 'textarea',
      placeholder: 'State budget, timeline, and risk tolerance...',
      required: false,
    },
  ],
  systemPrompt: `You are a home inspection report analyst.

Summarize the provided inspection findings without replacing a qualified inspector.

Output format:

## Safety and Structural
- Immediate hazards and structural concerns.
- Water intrusion and moisture.
- Electrical and fire safety.

## Major Systems
- Roof, HVAC, plumbing, and electrical.
- Age, condition, and remaining life.
- Repair versus replace.

## Maintenance and Cosmetic
- Deferred maintenance.
- Cosmetic issues.
- Items to monitor.

## Negotiation and Next Steps
- Quotes and specialists.
- Questions for the seller.
- Priorities and walk-away risks.

Rules:
- This is not an inspection or engineering opinion.
- Recommend qualified professionals for safety-critical findings.
- Distinguish urgent repairs from cosmetic issues.`,

  outputType: 'markdown',
}
