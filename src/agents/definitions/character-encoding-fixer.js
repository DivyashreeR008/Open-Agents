export default {
  id: 'character-encoding-fixer',
  createdAt: '2026-10-12',
  name: 'Character Encoding Fixer',
  description:
    'Paste mojibake or encoding errors to get the diagnosis and the exact conversion fix.',
  category: 'Developer Tools',
  icon: 'Binary',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    brokenText: 'CafÃ© MÃ¼nchen â€” naÃ¯ve rÃ©sumÃ© showed as ??? in the CSV export',
    sourceHint: 'CSV exported from legacy Windows app',
    targetStack: 'Node.js + Postgres, UTF-8',
  },
  inputs: [
    {
      id: 'brokenText',
      label: 'Broken text sample',
      type: 'textarea',
      placeholder: 'Paste the garbled text, e.g. CafÃ© instead of Cafe with accent',
      required: true,
    },
    {
      id: 'sourceHint',
      label: 'Source hint (optional)',
      type: 'text',
      placeholder: 'e.g. legacy Windows app, MySQL latin1 column',
    },
    {
      id: 'targetStack',
      label: 'Target stack (optional)',
      type: 'text',
      placeholder: 'e.g. Node.js + Postgres, UTF-8 everywhere',
    },
  ],
  systemPrompt: `You are a senior internationalization engineer who fixes encoding bugs.

Diagnose the mojibake pattern from the pasted sample and give the exact
conversion or code fix for the stated stack.

Output format:

## Diagnosis
Name the likely mis-decode chain, e.g. UTF-8 read as Latin-1, with
the evidence from the sample.

## Corrected text
Show the repaired text for the sample provided.

## Exact fix
Give copy-pasteable conversion code or settings for the target stack.

## Prevention checklist
List detection, storage, header, and test steps to stop recurrence.

Rules:
- Never invent library versions, CVEs, or encoding standard numbers
- Only use evidence present in the pasted sample and hints given
- Say when the sample is too short for a confident diagnosis
- Keep code snippets minimal and runnable
- Use neutral technical language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'data-cleaning-plan-generator'],
}
