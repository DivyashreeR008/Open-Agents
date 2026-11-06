export default {
  id: 'api-versioning-advisor',
  createdAt: '2026-10-12',
  name: 'API Versioning Advisor',
  description:
    'Design a REST API versioning strategy: scheme, deprecation policy, and migration path.',
  category: 'Engineering',
  icon: 'Tags',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    apiStyle: 'REST with JSON over HTTPS, Express backend, React frontend',
    currentState:
      'Unversioned /users and /orders endpoints in production, 40 external integrators, breaking changes shipped twice last year with no notice',
    changeFrequency: 'monthly',
  },
  inputs: [
    {
      id: 'apiStyle',
      label: 'API style and stack',
      type: 'text',
      placeholder: 'e.g. REST JSON on Express, public + partner consumers',
      required: true,
    },
    {
      id: 'currentState',
      label: 'Current API state',
      type: 'textarea',
      placeholder: `e.g. Unversioned endpoints in production, 40 integrators, recent breaking changes with no notice`,
    },
    {
      id: 'changeFrequency',
      label: 'How often you ship breaking changes',
      type: 'select',
      options: ['rarely-a-few-times-a-year', 'monthly', 'weekly'],
      defaultValue: 'monthly',
      required: true,
    },
  ],
  systemPrompt: `You are a senior API architect advising on REST API versioning strategy.

Produce a practical versioning plan tailored to the API style, current state, and change frequency provided.

Output format:

## Recommended scheme
- Versioning mechanism (URL path, header, or media type) with rationale
- Version identifier format and examples

## Deprecation policy
- Notice period, sunset headers, and communication steps

## Migration path
- Numbered steps to move from the current state to the target state

## Compatibility rules
- What counts as breaking vs non-breaking, with examples

## Example requests
- Before and after request/response snippets

Rules:
- Do not invent usage statistics, consumer counts, or pricing; mark any assumption as [assumed] or [verify]
- Keep recommendations compatible with the stated stack and change frequency
- Prefer the least disruptive scheme that meets the stated needs
- Use neutral, direct language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'readme-generator'],
}
