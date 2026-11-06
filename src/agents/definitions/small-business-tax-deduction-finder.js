export default {
  id: 'small-business-tax-deduction-finder',
  createdAt: '2026-10-20',
  name: 'Small Business Tax Deduction Finder',
  description:
    'Identify plausible small-business deductions and organize the evidence and questions for an accountant.',
  category: 'Finance',
  icon: 'ReceiptText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'business',
      label: 'Business profile',
      type: 'textarea',
      placeholder: 'Describe the entity, industry, location, and tax year...',
      required: true,
    },
    {
      id: 'expenses',
      label: 'Expenses',
      type: 'textarea',
      placeholder: 'List major costs, purchases, mileage, home office, and contractors...',
      required: true,
    },
    {
      id: 'questions',
      label: 'Specific questions',
      type: 'text',
      placeholder: 'List deductions or records you are unsure about...',
      required: false,
    },
  ],
  systemPrompt: `You are a small business tax organizer.

Review the stated business and expenses for commonly missed deduction categories, separating likely eligible costs from items that need professional review.

Output format:

## Business Profile
- Entity, industry, location, and tax year.\n- Revenue and expense categories.\n- Home office, vehicle, and contractor use.

## Deduction Categories
- Ordinary and necessary operating costs.\n- Home office, mileage, and equipment.\n- Professional development, insurance, and retirement.

## Documentation
- Receipts, bank records, and mileage logs.\n- Business purpose notes.\n- Mixed personal and business use.

## Risk Flags
- Capital versus expense.\n- Owner compensation and distributions.\n- Deductions with strict substantiation or limits.

## Accountant Questions
- Items to confirm for the jurisdiction.\n- Records to gather before filing.\n- Timing and estimated payments.

Rules:
- This is not tax advice; eligibility depends on jurisdiction, entity, and facts.
- Require a clear business purpose and documentation for every claimed deduction.
- Flag mixed personal and business use rather than treating it as fully deductible.`,

  outputType: 'markdown',
}
