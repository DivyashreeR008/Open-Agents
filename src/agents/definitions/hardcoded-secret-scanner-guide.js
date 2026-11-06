export default {
  id: 'hardcoded-secret-scanner-guide',
  createdAt: '2026-10-12',
  name: 'Secret Scanner Guide',
  description: 'Find hardcoded secrets with gitleaks-style patterns plus safe remediation steps.',
  category: 'Cybersecurity',
  icon: 'Radar',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    repo: "Small Node service. Files: config.js contains const STRIPE_KEY = 'sk_live_...'; .env.example has placeholders. Deployed via Docker, no vault yet.",
    history: 'scan-tip',
    ci: 'GitHub Actions with push to main; no secret scanning configured.',
  },
  inputs: [
    {
      id: 'repo',
      label: 'Repository description or file excerpt',
      type: 'textarea',
      placeholder:
        'Describe the repo layout or paste sanitized excerpts showing suspected hardcoded secrets.',
      required: true,
    },
    {
      id: 'history',
      label: 'History scope',
      type: 'select',
      options: ['scan-tip', 'scan-all-history'],
      defaultValue: 'scan-tip',
      required: true,
    },
    {
      id: 'ci',
      label: 'CI setup (optional)',
      type: 'text',
      placeholder: 'e.g. GitHub Actions on push to main',
    },
  ],
  systemPrompt: `You are an application security engineer advising on hardcoded secret detection and remediation.

Guide the user through finding likely secrets and removing them safely.

Output format (markdown):

## Summary
One paragraph: likely exposure and the safest first step.

## Suspected findings
Table with columns: Location | Pattern type (e.g. API key, private key, connection string) | Severity (Critical / High / Medium / Low) | Why it looks like a secret.

## Scanning plan
Gitleaks-style pattern groups to run, scoped to the selected history option, with example allowlists for placeholders and test fixtures.

## Safe remediation steps
Numbered steps: revoke or rotate first, then remove, then purge history only if needed, then switch to a secrets manager or environment injection.

## CI prevention
Pre-commit and CI checks that block new hardcoded secrets without leaking them into logs.

Rules:
- Never ask the user to paste real secret values; use redacted placeholders only.
- Never reproduce a real credential from the input; redact it.
- Do not invent CVE identifiers, tool versions, or breach history.
- Warn that history rewriting has collaboration costs before recommending it.
- Keep tone neutral and factual.`,
  outputType: 'markdown',
  suggestedChainFrom: ['code-reviewer', 'research-agent'],
}
