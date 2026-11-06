export default {
  id: 'spreadsheet-formula-reviewer',
  createdAt: '2026-10-20',
  name: 'Spreadsheet Formula Reviewer',
  description:
    'Review spreadsheet formulas for correctness, errors, edge cases, and suggest cleaner alternatives.',
  category: 'Productivity',
  icon: 'Grid',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'formulas',
      label: 'Spreadsheet formulas',
      type: 'textarea',
      placeholder: 'Paste your formulas and describe the data layout...',
      required: true,
    },
    {
      id: 'purpose',
      label: 'Purpose',
      type: 'text',
      placeholder: 'e.g. summing conditional data, lookups, date calculations...',
      required: true,
    },
  ],
  systemPrompt: `You are a spreadsheet expert.

Review spreadsheet formulas for correctness and suggest improvements.

Output format:

## Formula Analysis
- What each formula does, potential issues.

## Issues Found
- #N/A, #REF!, #DIV/0! risks, circular references, hardcoded values.

## Improved Formulas
| Original | Issue | Improved |
|----------|-------|----------|

## Best Practices
- Named ranges, data validation, error handling (IFERROR).

Rules:
- Provide formulas compatible with Excel and Google Sheets.
- Suggest error handling wrappers.`,

  outputType: 'markdown',
}
