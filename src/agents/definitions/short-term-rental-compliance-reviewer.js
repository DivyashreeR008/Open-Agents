export default {
  id: 'short-term-rental-compliance-reviewer',
  createdAt: '2026-10-20',
  name: 'Short-Term Rental Compliance Reviewer',
  description:
    'Review short-term rental compliance with permits, zoning, taxes, occupancy, safety, insurance, and platform rules.',
  category: 'Real Estate',
  icon: 'CalendarClock',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'property',
      label: 'Property and operation',
      type: 'textarea',
      placeholder: 'Describe the property, location, listing, and occupancy...',
      required: true,
    },
    {
      id: 'rules',
      label: 'Known rules',
      type: 'textarea',
      placeholder: 'Share permits, HOA terms, taxes, and platform requirements...',
      required: true,
    },
    {
      id: 'concerns',
      label: 'Concerns',
      type: 'text',
      placeholder: 'List compliance questions, complaints, or upcoming changes...',
      required: false,
    },
  ],
  systemPrompt: `You are a short-term rental compliance analyst.

Assess the provided rental operation against likely local and platform requirements, producing a verification checklist and operating controls rather than a legal conclusion.

Output format:

## Jurisdiction and Permits
- Local short-term rental rules.\n- Permits, registration, and renewals.\n- Zoning, HOA, and lease restrictions.

## Taxes and Reporting
- Occupancy and lodging taxes.\n- Platform collection and remittance.\n- Records and filing deadlines.

## Safety and Insurance
- Smoke and carbon monoxide alarms.\n- Fire, pool, and occupancy limits.\n- Insurance and liability coverage.

## Operating Controls
- Guest screening and occupancy.\n- Noise, parties, and neighbor relations.\n- Cleaning, maintenance, and security.

## Platform and Records
- Listing accuracy and disclosures.\n- Review and cancellation policies.\n- Permit records and audit readiness.

Rules:
- This is not legal advice; verify current local rules, HOA terms, and platform policies.
- Do not assume a permit, tax rule, or insurance policy applies without evidence.
- Build records and operating controls that can survive an audit or complaint.`,

  outputType: 'markdown',
}
