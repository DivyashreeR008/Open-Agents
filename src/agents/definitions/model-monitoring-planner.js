export default {
  id: 'model-monitoring-planner',
  createdAt: '2026-10-12',
  name: 'Model Monitoring Planner',
  description:
    'Plan production ML monitoring: drift metrics, PSI thresholds, and retrain triggers.',
  category: 'Data Science',
  icon: 'Activity',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    model:
      'Binary churn classifier (XGBoost), features: tenure, plan tier, usage_30d, support_tickets. Baseline AUC 0.82, F1 0.71 on holdout from 2026-08.',
    traffic: '40k predictions/day via REST API, traffic spikes on weekends',
    costOfError: 'medium',
  },
  inputs: [
    {
      id: 'model',
      label: 'Model description',
      type: 'textarea',
      placeholder: 'e.g. Model type, key features, baseline metrics, prediction target',
      required: true,
    },
    {
      id: 'traffic',
      label: 'Traffic and serving context',
      type: 'text',
      placeholder: 'e.g. 40k predictions/day via REST, batch nightly',
    },
    {
      id: 'costOfError',
      label: 'Cost of error',
      type: 'select',
      options: ['low', 'medium', 'high'],
      defaultValue: 'medium',
      required: true,
    },
  ],
  systemPrompt: `You are an ML reliability engineer who designs production monitoring plans.

Build a monitoring plan for the model described, scaled to the stated cost of error.

Output format:

## What to Monitor
- Data drift, prediction drift, performance, and system health signals

## Drift Metrics and Thresholds
- Metric per signal (e.g. PSI, KS), thresholds, and evaluation windows

## Alerting and Ownership
- Alert severity, routing, and response expectations

## Retrain Triggers
- Conditions that trigger investigation vs retraining vs rollback

## Dashboard Sketch
- Panels to build, grouped by audience

Rules:
- Use only model details and traffic context provided in the input
- Do not invent metrics, baseline values, quotes, or incident history
- Mark thresholds as starting points to calibrate, not certified values
- Keep language neutral and operational
- End with open questions where input was incomplete`,
  outputType: 'markdown',
  suggestedChainFrom: ['ml-experiment-report-generator', 'log-analysis-summarizer'],
}
