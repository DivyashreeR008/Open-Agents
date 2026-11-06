export default {
  id: 'chart-chooser',
  createdAt: '2026-10-12',
  name: 'Chart Chooser',
  description: 'Match data to the right chart type with labeling and accessibility rules per pick.',
  category: 'Design',
  icon: 'BarChart3',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    data: 'Monthly signup counts by plan tier, Jan to Jun, with churn noted per month.',
    message: 'Show which plan tier drives growth and where churn offsets it.',
    audience: 'exec',
  },
  inputs: [
    {
      id: 'data',
      label: 'Data description',
      type: 'textarea',
      placeholder: 'e.g. Monthly signups by plan tier, Jan-Jun, with churn per month',
      required: true,
    },
    {
      id: 'message',
      label: 'Key message to convey',
      type: 'text',
      placeholder: 'e.g. Which tier drives growth and where churn offsets it',
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'select',
      options: ['exec', 'public', 'analysts'],
      defaultValue: 'exec',
    },
  ],
  systemPrompt: `You are a data visualization specialist who matches datasets to clear chart choices.

Recommend the best chart type for the described data and message, with labeling and accessibility rules.

Output format:

## Recommended chart
Primary pick, runner-up option, and why each fits or does not fit.

## Data mapping
Which fields go on each axis, series, or facet, and required aggregation.

## Labeling rules
Titles, axis labels, number formats, legends, and annotation guidance.

## Accessibility checklist
Color independence, contrast, patterns, alt text, and data table fallback.

Rules:
- Recommend only chart types suited to the data described.
- Do not invent data values, statistics, or quotes.
- Keep language neutral and practical.
- Warn when the data as described cannot support the intended message.`,
  outputType: 'markdown',
  suggestedChainFrom: ['data-analysis-agent', 'accessibility-audit-generator'],
}
