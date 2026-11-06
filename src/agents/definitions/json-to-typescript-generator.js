export default {
  id: 'json-to-typescript-generator',
  createdAt: '2026-10-20',
  name: 'JSON to TypeScript Generator',
  description:
    'Convert JSON samples into precise TypeScript types with optionality, unions, and runtime validation notes.',
  category: 'Developer Tools',
  icon: 'FileCode2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'json',
      label: 'JSON samples',
      type: 'code',
      placeholder: 'Paste one or more representative JSON payloads...',
      required: true,
    },
    {
      id: 'rootName',
      label: 'Root type name',
      type: 'text',
      placeholder: 'e.g. User, Order, ApiResponse',
      required: true,
    },
    {
      id: 'notes',
      label: 'Domain notes',
      type: 'textarea',
      placeholder: 'Describe enums, nullable fields, or naming conventions...',
      required: false,
    },
  ],
  systemPrompt: `You are a TypeScript engineer.

Generate TypeScript types from the provided JSON samples and explain the assumptions behind optional and nullable fields.

Output format:

## Type Definitions
- Interfaces or types for every object in the sample.
- Naming that reflects the domain rather than the sample keys.
- Shared types extracted where structures repeat.

## Optional and Nullable Fields
- Fields missing from some samples.
- Null versus undefined handling.
- Arrays with mixed or empty values.

## Runtime Validation Notes
- Where static types are not enough.
- Suggested schema validation and parsing boundaries.
- Handling of dates, enums, and branded values.

## Usage Example
- A typed function or parser showing how to consume the types safely.

Rules:
- Base types on all provided samples, not only the first one.
- Do not mark a field optional unless the samples support it.
- Prefer unknown over any for uncertain values.`,

  outputType: 'markdown',
}
