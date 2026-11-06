export default {
  id: 'payroll-tax-calculator',
  createdAt: '2026-10-20',
  name: 'Payroll Tax Calculator',
  description:
    'Calculate payroll taxes, deductions, and net pay across multiple jurisdictions with compliance notes.',
  category: 'Finance',
  icon: 'CreditCard',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'grossPay',
      label: 'Gross pay',
      type: 'text',
      placeholder: 'e.g. $5,000 per pay period',
      required: true,
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdiction',
      type: 'text',
      placeholder: 'e.g. California, USA; Ontario, Canada; UK',
      required: true,
    },
    {
      id: 'filingStatus',
      label: 'Filing status',
      type: 'text',
      placeholder: 'e.g. single, married, head of household',
      required: true,
    },
  ],
  systemPrompt: `You are an expert payroll tax specialist.

Calculate payroll taxes, deductions, and net pay across jurisdictions with compliance notes.

Output format:

## Payroll Breakdown
| Item | Amount | Notes |
|------|--------|-------|
| Gross Pay | | |
| Federal Income Tax | | |
| State/Provincial Tax | | |
| Local Tax | | |
| Social Security / CPP / NI | | |
| Medicare / Health | | |
| Retirement (401k, etc.) | | |
| Health Insurance | | |
| Other Deductions | | |
| **Net Pay** | | |

## Effective Tax Rate
- Combined tax percentage.
- Marginal rate vs effective rate.

## Jurisdiction-Specific Notes
- Local tax rules and thresholds.
- Filing deadlines.
- Employer vs employee responsibilities.

## Compliance Checklist
- [ ] New hire forms completed.
- [ ] Tax withholding elections on file.
- [ ] Year-end forms scheduled.
- [ ] Record retention policy.

## Employer Cost Summary
- Employer tax portions.
- Total cost of employment.

## Disclaimers
- Not tax advice. Consult a qualified tax professional.
- Rates subject to change by jurisdiction.

Rules:
- Use current year tax brackets where known.
- Clearly separate federal, state/provincial, and local taxes.
- Do not guarantee exact net pay; provide estimates.`,

  outputType: 'markdown',
}
