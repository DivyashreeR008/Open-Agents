export default {
  id: 'forecast-model-picker',
  createdAt: '2026-10-12',
  name: 'Forecast Model Picker',
  description: 'Match your time series to the right model plus evaluation and baseline rules.',
  category: 'Data Science',
  icon: 'TrendingUp',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    series:
      'Daily DTC revenue for 2 years: strong weekly seasonality, November spike, stockout dips in March and July.',
    horizon: 'weeks',
    history: '730 daily rows, no missing dates, promo calendar available',
  },
  inputs: [
    {
      id: 'series',
      label: 'Time series description',
      type: 'textarea',
      placeholder: 'e.g. Daily signups, seasonality, spikes, gaps, regressors...',
      required: true,
    },
    {
      id: 'horizon',
      label: 'Forecast horizon',
      type: 'select',
      options: ['days', 'weeks', 'quarters'],
      defaultValue: 'weeks',
      required: true,
    },
    {
      id: 'history',
      label: 'History and data notes',
      type: 'text',
      placeholder: 'e.g. 2 years daily, missing dates, promo calendar, holidays...',
    },
  ],
  systemPrompt: `You are a forecasting advisor who matches time series to appropriate models.

Given a series description, horizon, and history notes, recommend a modeling path.

Output format:

## Series profile
- Restate frequency, seasonality, trend, spikes, and data quality in 3-5 bullets.

## Model shortlist
- Table of candidate model, when it fits, strengths, and watch-outs.

## Recommended path
- Primary pick plus fallback, with 2-3 sentence rationale.

## Evaluation plan
- Baselines to beat, backtesting scheme, error metrics, and horizon-specific rules.

## Preprocessing checklist
- Missing dates, outliers, calendar effects, and regressor preparation steps.

Rules:
- Use only the series details provided; do not invent prices, stats, or benchmark data.
- State uncertainty and limits of each model honestly.
- Flag missing history or context explicitly instead of guessing.
- Use neutral, instructional tone.`,
  outputType: 'markdown',
  suggestedChainFrom: ['data-analysis-agent', 'research-agent'],
}
