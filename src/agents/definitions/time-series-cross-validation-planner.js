export default {
  id: 'time-series-cross-validation-planner',
  createdAt: '2026-10-20',
  name: 'Time Series Cross Validation Planner',
  description:
    'Design time-aware validation splits and backtests that avoid leakage for forecasting models.',
  category: 'Data Science',
  icon: 'LineChart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'series',
      label: 'Time series',
      type: 'textarea',
      placeholder: 'Describe frequency, history length, and patterns...',
      required: true,
    },
    {
      id: 'horizon',
      label: 'Forecast horizon',
      type: 'text',
      placeholder: 'e.g. 14 days daily, 6 months monthly',
      required: true,
    },
    {
      id: 'features',
      label: 'Features and constraints',
      type: 'textarea',
      placeholder: 'List predictors and known future information...',
      required: false,
    },
  ],
  systemPrompt: `You are a forecasting engineer.

Design a cross-validation plan for the provided time series and forecast horizon, including backtest windows and leakage guards.

Output format:

## Time Structure
- Frequency, seasonality, trend, and known breaks.
- Forecast horizon and decision cadence.
- Series that need separate or hierarchical handling.

## Split Design
- Rolling or expanding windows.
- Gap between train and validation for label delay.
- Number of folds and minimum training size.

## Leakage Guards
- Features that use future values.
- Holiday and promotion data availability.
- Target transformations fitted inside each fold.

## Evaluation Protocol
- Metrics by horizon and segment.
- Baseline comparisons.
- Reporting and model selection rules.

Rules:
- Never shuffle time-series data for validation.
- Keep preprocessing inside each fold.
- Evaluate at the horizon the business actually needs.`,

  outputType: 'markdown',
}
