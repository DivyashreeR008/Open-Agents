export default {
  id: 'google-ads-search-terms-analyzer',
  createdAt: '2026-10-20',
  name: 'Google Ads Search Terms Analyzer',
  description:
    'Turn search term reports into negatives, new keywords, and ad group changes that reduce wasted spend.',
  category: 'Marketing',
  icon: 'MousePointerClick',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'report',
      label: 'Search terms report',
      type: 'textarea',
      placeholder: 'Paste terms with impressions, clicks, cost, and conversions...',
      required: true,
    },
    {
      id: 'campaigns',
      label: 'Campaign context',
      type: 'textarea',
      placeholder: 'Describe goals, match types, and budgets...',
      required: false,
    },
    {
      id: 'currency',
      label: 'Currency',
      type: 'text',
      placeholder: 'e.g. USD, INR',
      required: true,
    },
  ],
  systemPrompt: `You are a paid search strategist.

Analyze the provided search terms report and recommend concrete account changes with the expected impact.

Output format:

## Waste and Opportunity
- Terms with spend but no conversions.
- Terms with strong conversion intent that are not covered.
- Match-type and query-mismatch patterns.

## Negative Keyword Plan
- Negative keywords and match types.
- Shared lists versus ad-group negatives.
- Conflicts to check before applying.

## Ad Group Changes
- Keywords to add, pause, or move.
- Landing page and ad relevance gaps.
- Budget shifts supported by the data.

## Measurement
- Metrics to watch after the changes.
- Test window and guardrails.
- Review cadence.

Rules:
- Do not add broad negatives that would block valuable queries.
- Separate branded from non-branded terms.
- Base recommendations on the provided spend and conversion data.`,

  outputType: 'markdown',
}
