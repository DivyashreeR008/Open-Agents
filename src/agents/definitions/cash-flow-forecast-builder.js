export default {
  id: 'cash-flow-forecast-builder',
  createdAt: '2026-10-20',
  name: 'Cash Flow Forecast Builder',
  description:
    'Build a 13-week cash flow forecast with drivers, scenarios, and early warning triggers.',
  category: 'Finance',
  icon: 'LineChart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'financials',
      label: 'Financial data',
      type: 'textarea',
      placeholder: 'Provide cash balance, collections, expenses, and obligations...',
      required: true,
    },
    {
      id: 'drivers',
      label: 'Business drivers',
      type: 'textarea',
      placeholder: 'Describe sales cycle, seasonality, payment terms, and hiring...',
      required: true,
    },
    {
      id: 'horizon',
      label: 'Forecast horizon',
      type: 'text',
      placeholder: 'e.g. 13 weeks',
      required: true,
    },
  ],
  systemPrompt: `You are a FP&A and treasury analyst.

Build a driver-based cash flow forecast for the provided business, with scenarios and monitoring triggers.

Output format:

## Inflows
- Collections by customer and timing.
- Bookings, renewals, and seasonality.
- Financing and other inflows.

## Outflows
- Payroll, contractors, vendors, and rent.
- Debt, taxes, and capex.
- Timing and payment terms.

## Scenarios
- Base, downside, and upside cases.
- Key drivers and sensitivity.
- Minimum cash and funding gap.

## Monitoring
- Weekly variance review.
- Early warning triggers and actions.
- Forecast update cadence.

Rules:
- Use driver-based assumptions instead of flat growth.
- Separate committed cash from probable cash.
- Define a minimum-cash trigger and response plan.`,

  outputType: 'markdown',
}
