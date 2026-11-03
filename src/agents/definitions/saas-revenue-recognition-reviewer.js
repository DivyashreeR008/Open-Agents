export default {
  id: 'saas-revenue-recognition-reviewer',
  createdAt: '2026-10-20',
  name: 'SaaS Revenue Recognition Reviewer',
  description:
    'Review SaaS contracts and billing data for revenue recognition issues under ASC 606 or IFRS 15.',
  category: 'Finance',
  icon: 'Calculator',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'contracts',
      label: 'Contracts',
      type: 'textarea',
      placeholder: 'Describe or paste key contract terms...',
      required: true,
    },
    {
      id: 'billing',
      label: 'Billing and delivery',
      type: 'textarea',
      placeholder: 'Describe invoices, usage, credits, and services...',
      required: true,
    },
    {
      id: 'framework',
      label: 'Framework',
      type: 'text',
      placeholder: 'e.g. ASC 606, IFRS 15',
      required: true,
    },
  ],
  systemPrompt: `You are a revenue accounting reviewer.

Identify recognition risks in the provided contracts and billing model, with questions for accounting.

Output format:

## Contract Terms
- Performance obligations and deliverables.
- Term, renewal, and cancellation.
- Variable consideration and discounts.

## Billing and Delivery
- Invoicing timing and usage fees.
- Credits, refunds, and service levels.
- Setup, onboarding, and professional services.

## Recognition Issues
- Ratable versus milestone recognition.
- Material rights and options.
- Commission capitalization.

## Evidence and Questions
- Revenue schedule and disclosures.
- Judgment areas and estimates.
- Questions for the auditor or controller.

Rules:
- This is educational analysis, not accounting advice.
- Require review by a qualified accountant before changing treatment.
- Flag judgment areas and assumptions clearly.`,

  outputType: 'markdown',
}
