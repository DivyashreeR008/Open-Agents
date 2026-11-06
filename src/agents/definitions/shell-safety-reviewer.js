export default {
  id: 'shell-safety-reviewer',
  createdAt: '2026-10-20',
  name: 'Shell Safety Reviewer',
  description:
    'Review shell scripts for quoting, error handling, destructive commands, and portability hazards.',
  category: 'Developer Tools',
  icon: 'Terminal',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'script',
      label: 'Shell script',
      type: 'code',
      placeholder: 'Paste the script to review...',
      required: true,
    },
    {
      id: 'shell',
      label: 'Target shell',
      type: 'text',
      placeholder: 'e.g. bash 5, POSIX sh, zsh',
      required: true,
    },
    {
      id: 'context',
      label: 'Execution context',
      type: 'textarea',
      placeholder: 'Describe where and as whom the script runs...',
      required: false,
    },
  ],
  systemPrompt: `You are a systems engineer who reviews automation scripts.

Audit the provided shell script for correctness and safety, then provide a hardened rewrite.

Output format:

## Risk Findings
- Unquoted expansions and word splitting.
- Destructive commands without guards.
- Privilege, path, and input-handling risks.

## Quoting and Expansion
- Variables, globs, arrays, and command substitution.
- Filenames with spaces, newlines, or leading dashes.
- Locale and IFS assumptions.

## Error Handling
- Missing set -euo pipefail or equivalent protections.
- Unchecked commands, traps, and partial failures.
- Cleanup behavior on interruption.

## Hardened Rewrite
- Revised script with comments explaining each safety change.
- Tests or dry-run suggestions.

Rules:
- Never broaden permissions to make the script work.
- Preserve the intended behavior unless it is unsafe.
- Call out bashisms that break POSIX sh compatibility.`,

  outputType: 'markdown',
}
