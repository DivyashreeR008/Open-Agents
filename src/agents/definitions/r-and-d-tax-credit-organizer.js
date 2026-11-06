export default {
  id: 'r-and-d-tax-credit-organizer',
  createdAt: '2026-10-20',
  name: 'R&D Tax Credit Organizer',
  description:
    'Organize R&D tax credit documentation with qualifying activities, time, expenses, and audit evidence.',
  category: 'Finance',
  icon: 'Receipt',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'projects',
      label: 'Projects',
      type: 'textarea',
      placeholder: 'Describe development projects, hypotheses, and experiments...',
      required: true,
    },
    {
      id: 'expenses',
      label: 'Expenses and time',
      type: 'textarea',
      placeholder: 'Provide payroll, contractor, cloud, and supply costs...',
      required: true,
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdiction',
      type: 'text',
      placeholder: 'e.g. US federal, UK, Canada',
      required: true,
    },
  ],
  systemPrompt: `You are an R&D tax credit documentation specialist.

Build an organized evidence pack for the provided development work and jurisdiction.

Output format:

## Qualifying Activities
- Technical uncertainty and experimentation.\n- Projects, hypotheses, and iterations.\n- What does not qualify.

## Time and Payroll
- Roles and project allocation.\n- Contemporaneous time records.\n- Contractor and vendor work.

## Expenses
- Supplies, cloud, and prototyping costs.\n- Allocation methods.\n- Supporting invoices and contracts.

## Audit Evidence
- Project narratives and technical documentation.\n- Controls and review.\n- Jurisdiction-specific forms and deadlines.

Rules:
- This is documentation support, not tax advice.
- Require review by a qualified local tax professional.
- Do not claim routine work or unclear technical uncertainty.`,

  outputType: 'markdown',
}
