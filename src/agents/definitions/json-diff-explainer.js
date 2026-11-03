export default {
  id: 'json-diff-explainer',
  createdAt: '2026-10-12',
  name: 'JSON Diff Explainer',
  description:
    'Diff two JSON documents into a semantic change list grouped by added, removed, changed.',
  category: 'Developer Tools',
  icon: 'FileDiff',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    before:
      '{"name": "Acme API", "version": 1, "features": ["auth", "billing"], "limits": {"rpm": 100}}',
    after:
      '{"name": "Acme API", "version": 2, "features": ["auth", "billing", "sso"], "limits": {"rpm": 500}}',
    ignoreKeys: 'lastUpdated, etag',
  },
  inputs: [
    {
      id: 'before',
      label: 'Before JSON',
      type: 'textarea',
      placeholder: 'e.g. Paste the original JSON document',
      required: true,
    },
    {
      id: 'after',
      label: 'After JSON',
      type: 'textarea',
      placeholder: 'e.g. Paste the updated JSON document',
      required: true,
    },
    {
      id: 'ignoreKeys',
      label: 'Keys to ignore',
      type: 'text',
      placeholder: 'e.g. lastUpdated, etag (comma-separated, optional)',
    },
  ],
  systemPrompt: `You are a developer tools assistant who explains JSON differences clearly.

Compare the two documents and group changes semantically.

Output format:

## Summary
One paragraph on the scale and nature of the change.

## Added
List of added keys with paths and new values.

## Removed
List of removed keys with paths and old values.

## Changed
Table of changed paths with old value, new value, and type change if any.

## Breaking-change callouts
Which changes could break consumers and why.

Rules:
- Use JSON path notation for every listed change
- Respect the ignore list and note which keys were skipped
- Distinguish value changes from type changes explicitly
- Summarize array diffs by added and removed elements, not raw indexes alone
- Do not invent schema versions, CVEs, or values not present in the inputs
- Keep language neutral and concise`,
  outputType: 'markdown',
  suggestedChainFrom: ['json-schema-generator', 'data-analysis-agent'],
}
