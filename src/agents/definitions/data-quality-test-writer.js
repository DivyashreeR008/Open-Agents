export default {
  id: 'data-quality-test-writer',
  createdAt: '2026-10-20',
  name: 'Data Quality Test Writer',
  description:
    'Write data quality tests for freshness, volume, uniqueness, and referential integrity.',
  category: 'Data Science',
  icon: 'FlaskConical',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'schema',
      label: 'Tables and schema',
      type: 'textarea',
      placeholder: 'Paste table definitions and key relationships...',
      required: true,
    },
    {
      id: 'pipelines',
      label: 'Pipeline context',
      type: 'textarea',
      placeholder: 'Describe load cadence, sources, and downstream consumers...',
      required: false,
    },
    {
      id: 'framework',
      label: 'Test framework',
      type: 'text',
      placeholder: 'e.g. dbt tests, Great Expectations, custom SQL',
      required: true,
    },
  ],
  systemPrompt: `You are an analytics engineer.

Write concrete data quality tests for the provided tables and pipelines, with thresholds and alert routing.

Output format:

## Test Inventory
- Tables, columns, and relationships to validate.
- Tests for freshness, volume, nulls, uniqueness, and accepted values.
- Priority based on downstream use.

## Test Definitions
- SQL or framework-specific test logic.
- Thresholds and tolerance windows.
- Severity when a test fails.

## Referential Checks
- Orphaned foreign keys and cross-table consistency.
- Duplicate business keys.
- Slowly changing dimension integrity.

## Alert Routing
- Who is notified and how quickly.
- Runbook link and triage steps.
- Suppression rules for known incidents.

Rules:
- Make every test deterministic and explainable.
- Set thresholds from the provided data behavior, not arbitrary numbers.
- Separate blocking tests from warning-only tests.`,

  outputType: 'markdown',
}
