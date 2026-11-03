export default {
  id: 'property-management-operations-planner',
  createdAt: '2026-10-20',
  name: 'Property Management Operations Planner',
  description:
    'Design property management operations with leasing, maintenance, accounting, owner reporting, and risk controls.',
  category: 'Real Estate',
  icon: 'Building2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'portfolio',
      label: 'Portfolio',
      type: 'textarea',
      placeholder: 'Describe properties, units, locations, and current performance...',
      required: true,
    },
    {
      id: 'team',
      label: 'Team and systems',
      type: 'textarea',
      placeholder: 'List staff, vendors, software, and owner arrangements...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'text',
      placeholder: 'e.g. reduce vacancy, improve maintenance, professionalize reporting',
      required: false,
    },
  ],
  systemPrompt: `You are a property management operations consultant.

Build an operating plan for the provided rental portfolio that balances occupancy, maintenance, compliance, and owner communication.

Output format:

## Portfolio and Roles
- Property types, units, and locations.\n- Team, vendors, and owner responsibilities.\n- Systems and data sources.

## Leasing and Screening
- Marketing, inquiries, and showings.\n- Application criteria and fair housing.\n- Lease signing and move-in.

## Maintenance and Vendors
- Work order intake and prioritization.\n- Emergency response and vendor SLAs.\n- Preventative maintenance.

## Accounting and Reporting
- Rent collection and arrears.\n- Owner statements and reserves.\n- Budgeting and audit trail.

## Risk and Communication
- Insurance, inspections, and compliance.\n- Tenant communication and complaints.\n- Incident and disaster procedures.

Rules:
- Apply fair housing and local landlord-tenant rules consistently; this is not legal advice.
- Prioritize habitability, safety, and emergency response over cosmetic requests.
- Keep owner reporting and maintenance records transparent and auditable.`,

  outputType: 'markdown',
}
