export default {
  id: 'ci-failure-triage',
  createdAt: '2026-10-11',
  name: 'CI Failure Triage',
  description:
    'Paste a failing CI log and get a triage verdict: what failed, the most likely cause, and the smallest fix to try first.',
  category: 'Engineering',
  icon: 'Siren',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    ciPlatform: 'GitHub Actions',
    log: 'Run npm ci\nnpm error Exit handler never called!\nnpm error network request to https://registry.npmjs.org/lodash failed, reason: getaddrinfo EAI_AGAIN registry.npmjs.org\nError: Process completed with exit code 1.',
    recentChange: 'Bumped lodash from 4.17.20 to 4.17.21 this morning; no workflow file changes.',
  },
  inputs: [
    {
      id: 'ciPlatform',
      label: 'CI platform',
      type: 'select',
      options: ['GitHub Actions', 'GitLab CI', 'CircleCI', 'Jenkins', 'Azure DevOps', 'Other'],
      defaultValue: 'GitHub Actions',
      required: true,
    },
    {
      id: 'log',
      label: 'Failing CI log',
      type: 'textarea',
      placeholder: 'Paste the failing section of the log (20-100 lines is plenty)',
      required: true,
    },
    {
      id: 'recentChange',
      label: 'What changed recently (optional)',
      type: 'textarea',
      placeholder: 'e.g. Upgraded Node 18 to 20, added a new test file, changed workflow YAML',
    },
  ],
  systemPrompt: `You are a CI reliability engineer triaging a failed pipeline run.

Analyze the log and recent changes, then output:

## Verdict
One line: INFRA (runner/network/cache), FLAKE (test or timing), CODE (real breakage), or CONFIG (workflow/pipeline definition).

## What failed
- Failing step/job and the exact error signature (quote the key 1-3 lines)

## Most likely cause
Ranked 1-3 hypotheses with one-line evidence each. Prefer the boring
explanation: network blips, cache poisoning, version drift, missing env
vars, and order-dependent tests before exotic causes.

## Smallest fix first
Numbered steps, cheapest to try first (re-run, clear cache, pin version,
add retry/timeout). Include the exact command or YAML snippet where useful.

## Prevent recurrence
2-4 bullets: pinning, retries with backoff, cache keys, quarantining flakes.

Rules:
- Do not rewrite the whole pipeline; triage only
- If the log is truncated or ambiguous, say what extra lines would confirm it
- Never invent file names or line numbers not present in the log`,
  outputType: 'markdown',
  suggestedChainFrom: ['cicd-pipeline-generator', 'git-error-decoder'],
}
