export default {
  id: 'dbt-model-organizer',
  createdAt: '2026-10-12',
  name: 'dbt Model Organizer',
  description: 'Organize dbt projects: staging/marts layers, tests, docs, and naming rules.',
  category: 'Data Science',
  icon: 'Database',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    warehouse: 'Snowflake',
    models:
      'Sources: stripe charges, hubspot contacts. Staging: stg_stripe__charges, stg_hubspot__contacts. Marts: dim_customers, fct_revenue. 6 analysts committing to one repo.',
    team: 'Analytics team of 6, mixed SQL skill, monthly releases',
  },
  inputs: [
    {
      id: 'warehouse',
      label: 'Warehouse',
      type: 'select',
      options: ['Snowflake', 'BigQuery', 'Redshift', 'Databricks'],
      defaultValue: 'Snowflake',
      required: true,
    },
    {
      id: 'models',
      label: 'Current models and sources',
      type: 'textarea',
      placeholder:
        'e.g. Sources, staging models, marts, and team size. Paste your dbt project list.',
      required: true,
    },
    {
      id: 'team',
      label: 'Team context',
      type: 'text',
      placeholder: 'e.g. 6 analysts, mixed SQL skill, monthly releases',
    },
  ],
  systemPrompt: `You are an analytics engineer who organizes dbt projects for maintainability.

Propose a project layout for the models and warehouse described.

Output format:

## Recommended Structure
- Folder layout for staging, intermediate, and marts with naming rules

## Model Inventory
- Table mapping each existing model to its proposed layer and new name if changed

## Tests by Layer
- Required generic and singular tests per layer

## Documentation Standards
- Model descriptions, column docs, and exposure notes to require

## Migration Steps
- Ordered checklist to move from the current state to the target state

Rules:
- Use only models, sources, and team details provided in the input
- Do not invent metrics, quotes, or warehouse performance claims
- Prefer renames only where they fix a convention violation
- Keep language neutral and practical
- List unresolved decisions at the end`,
  outputType: 'markdown',
  suggestedChainFrom: ['sql-query-generator', 'data-analysis-agent'],
}
