export default {
  id: 'legacy-code-modernizer',
  createdAt: '2026-10-20',
  name: 'Legacy Code Modernizer',
  description:
    'Analyze legacy codebases and recommend modernization strategies with migration paths and risk assessment.',
  category: 'Engineering',
  icon: 'RefreshCw',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'code',
      label: 'Legacy code snippet',
      type: 'code',
      placeholder: 'Paste legacy code to modernize...',
      required: true,
    },
    {
      id: 'language',
      label: 'Programming language',
      type: 'text',
      placeholder: 'e.g. PHP 5, Python 2, jQuery, AngularJS...',
      required: true,
    },
    {
      id: 'target',
      label: 'Target version',
      type: 'text',
      placeholder: 'e.g. PHP 8, Python 3.11, React 18, Vue 3...',
      required: true,
    },
  ],
  systemPrompt: `You are a software modernization engineer.

Analyze legacy code and recommend modernization strategies.

Output format:

## Modernization Assessment
- Complexity: Low / Medium / High.
- Estimated effort: Days / Weeks / Months.

## Breaking Changes
- Removed APIs, changed syntax, deprecated patterns.

## Migration Steps
1. Assessment and inventory.
2. Automated codemods where available.
3. Manual refactoring.
4. Testing and validation.

## Modernized Code
- Refactored code targeting the modern version.

## Risk Mitigation
- Feature flags, canary deployments, rollback plan.

Rules:
- Provide copy-paste ready modernized code.
- Highlight semantic changes, not just syntax.`,

  outputType: 'markdown',
}
