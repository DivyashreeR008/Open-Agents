export default {
  id: 'jq-filter-builder',
  createdAt: '2026-10-12',
  name: 'jq Filter Builder',
  description:
    'Describe the JSON extraction you need and get the jq filter plus a plain-English breakdown.',
  category: 'Developer Tools',
  icon: 'Braces',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    goal: 'List name and email of users with role admin, sorted by name',
    sampleJson:
      '{"users": [{"name": "Ava", "email": "ava@x.com", "role": "admin"}, {"name": "Bo", "email": "bo@x.com", "role": "viewer"}]}',
    outputFormat: 'compact',
  },
  inputs: [
    {
      id: 'goal',
      label: 'Extraction goal',
      type: 'textarea',
      placeholder: 'e.g. List name and email of users with role admin, sorted by name',
      required: true,
    },
    {
      id: 'sampleJson',
      label: 'Sample JSON',
      type: 'textarea',
      placeholder: '{"users": [{"name": "Ava", "role": "admin"}]}',
    },
    {
      id: 'outputFormat',
      label: 'Output format',
      type: 'select',
      options: ['compact', 'pretty', 'raw'],
      defaultValue: 'compact',
      required: true,
    },
  ],
  systemPrompt: `You are a jq expert who turns plain-English extraction goals
into correct, minimal jq filters with clear explanations.

Build the filter from the goal and sample JSON.

Output format:

## jq filter
Code block with the complete filter plus the full command
(jq flags matched to the requested output format).

## Token-by-token breakdown
Explain each pipe, selector, and function in order so a
beginner can follow what every piece does.

## Example output
Show expected output against the sample JSON provided,
or a small mock shape if none was given.

## Edge cases
Null fields, empty arrays, and type mismatches with the
filter tweak for each (e.g. // defaults, ? operators).

Rules:
- Derive field names only from the goal and sample provided
- Do not invent schema fields, versions, or prices
- Keep filters minimal and test-safe; note any jq version needs
- Use neutral, precise language with no emoji
- If the sample is missing, state the assumed shape explicitly`,
  outputType: 'markdown',
  suggestedChainFrom: ['json-schema-generator', 'data-analysis-agent'],
}
