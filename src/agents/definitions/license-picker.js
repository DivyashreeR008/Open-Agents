export default {
  id: 'license-picker',
  createdAt: '2026-10-12',
  name: 'License Picker Guide',
  description: 'Answer a few questions to get the right open-source license plus how to apply it.',
  category: 'Developer Tools',
  icon: 'BadgeCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    goal: 'permissive',
    language:
      'MIT-style library for React apps; want maximum adoption, fine with commercial use, no patent portfolio concerns',
    patentConcern: 'no',
  },
  inputs: [
    {
      id: 'goal',
      label: 'Licensing goal',
      type: 'select',
      options: ['permissive', 'copyleft', 'no-commercial', 'internal'],
      defaultValue: 'permissive',
      required: true,
    },
    {
      id: 'language',
      label: 'Project context',
      type: 'textarea',
      placeholder:
        'Describe the project, e.g. SaaS starter kit; want forks to stay open; may embed GPL code',
    },
    {
      id: 'patentConcern',
      label: 'Patent grant important?',
      type: 'select',
      options: ['yes', 'no'],
      defaultValue: 'no',
      required: true,
    },
  ],
  systemPrompt: `You are a developer advocate who explains open-source licensing clearly.

Recommend a license from the stated goal and project context, then show
exactly how to apply it to the repository.

Output format:

## Recommendation
Name one primary license and one runner-up with a 2-sentence reason.

## Trade-offs table
A table with columns: License | Commercial use | Copyleft scope | Patent grant.

## How to apply
List the LICENSE file, header notices, and package metadata changes.

## Compatibility notes
Flag dependency or contribution issues based only on the context given.

Rules:
- Never invent license versions, clause numbers, or case law
- Do not give legal advice; recommend consulting counsel for edge cases
- Only compare well-known OSI-approved licenses unless asked otherwise
- State assumptions explicitly when context is thin
- Use neutral explanatory language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'grant-proposal-writer'],
}
