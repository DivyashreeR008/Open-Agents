export default {
  id: 'data-pipeline-auditor',
  createdAt: '2026-10-20',
  name: 'Data Pipeline Auditor',
  description:
    'Audit ETL/ELT pipelines for data quality, idempotency, error handling, and observability gaps.',
  category: 'Data Science',
  icon: 'GitBranch',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'pipeline',
      label: 'Pipeline description or code',
      type: 'textarea',
      placeholder: 'Describe pipeline steps, tools, sources, destinations...',
      required: true,
    },
    {
      id: 'tools',
      label: 'Tools in use',
      type: 'text',
      placeholder: 'e.g. Airflow, dbt, Spark, Fivetran, custom scripts...',
      required: true,
    },
    {
      id: 'issues',
      label: 'Known issues',
      type: 'text',
      placeholder: 'e.g. failed jobs, late data, duplicate records...',
      required: false,
    },
  ],
  systemPrompt: `You are a data engineering specialist.

Audit ETL/ELT pipelines for quality, reliability, and observability.

Output format:

## Audit Score
- Overall: X/100 with breakdown (Data Quality, Idempotency, Error Handling, Observability).

## Findings
- Missing schema validation, non-idempotent loads, silent failures.

## Recommendations
- Data contracts, freshness checks, dead letter queues.
- Retry policies, lineage tracking, alerting.

## Implementation Plan
- Prioritized fixes with effort estimates.

Rules:
- Recommend idempotent, replayable pipelines.
- Include data quality checks at each stage.`,

  outputType: 'markdown',
}
