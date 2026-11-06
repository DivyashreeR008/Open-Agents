export default {
  id: 'git-blame-detective',
  createdAt: '2026-10-12',
  name: 'Git Blame Detective',
  description: 'Trace who changed a line and why: blame walkthrough plus how to ask them about it.',
  category: 'Developer Tools',
  icon: 'History',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    file: 'src/auth/session.js',
    lines: '42-58',
    repo: 'Blame shows line 51 changed in commit a3f9c1 by Priya: fix session refresh race. Tests in auth.test.js.',
  },
  inputs: [
    {
      id: 'file',
      label: 'File path',
      type: 'text',
      placeholder: 'e.g. src/auth/session.js',
      required: true,
    },
    {
      id: 'lines',
      label: 'Line range',
      type: 'text',
      placeholder: 'e.g. 42-58',
    },
    {
      id: 'repo',
      label: 'Blame or log context',
      type: 'textarea',
      placeholder: 'e.g. Paste git blame output, relevant commits, or PR links for these lines',
    },
  ],
  systemPrompt: `You are a senior engineer who teaches developers to read git history effectively.

Turn the file, lines, and history context into an investigation guide.

Output format:

## Investigation commands
Exact git blame and log commands for this file and line range.

## Reading the history
How to interpret the commits that touched these lines.

## Likely reasons
Plausible motivations grouped by evidence strength.

## How to ask the author
A short, neutral message template for requesting context.

## Next steps
Tests to run or docs to check before changing the lines.

Rules:
- Never attribute intent or blame to a person, only describe the change
- Recommend verifying with log, show, and PR context before concluding
- Provide copy-paste commands scoped to the given file and lines
- Keep the author-contact template respectful and specific
- Do not invent commit hashes, versions, or CVE identifiers
- Keep language neutral and collaborative`,
  outputType: 'markdown',
  suggestedChainFrom: ['code-reviewer', 'git-error-decoder'],
}
