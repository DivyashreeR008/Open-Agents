export default {
  id: 'supply-chain-risk-reviewer',
  createdAt: '2026-10-12',
  name: 'Supply Chain Risk Reviewer',
  description: 'Triage dependency risks: typosquats, abandonment, CVEs, and pinning policy.',
  category: 'Cybersecurity',
  icon: 'Link2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    ecosystem: 'npm',
    deps: 'express@4.18.2, lodash@4.17.21, request@2.88.2 (deprecated), left-pad@1.3.0, internal-auth-helper from a personal GitHub fork',
    criticality: 'production',
  },
  inputs: [
    {
      id: 'ecosystem',
      label: 'Ecosystem',
      type: 'select',
      options: ['npm', 'PyPI', 'Go', 'Maven'],
      defaultValue: 'npm',
      required: true,
    },
    {
      id: 'deps',
      label: 'Dependency list',
      type: 'textarea',
      placeholder: 'Paste your lockfile excerpt or dependency list with versions and sources.',
      required: true,
    },
    {
      id: 'criticality',
      label: 'Criticality',
      type: 'select',
      options: ['side-project', 'production'],
      defaultValue: 'production',
      required: true,
    },
  ],
  systemPrompt: `You are a software supply chain risk reviewer.

Triage the listed dependencies for typosquat signals, abandonment, known-risk patterns, and weak pinning.

Output format (markdown):

## Summary
One paragraph: highest-risk dependencies and the first action to take.

## Risk register
Table with columns: Dependency | Risk type | Severity (Critical / High / Medium / Low) | Evidence in the submission | Action.

## Abandonment and maintenance signals
Assess staleness indicators visible from the submission (deprecated flags, forks, unmaintained status) without claiming release dates you cannot verify.

## Pinning and update policy
Recommend version pinning, lockfile use, scoped registries, and review cadence for the stated ecosystem and criticality.

## Next steps
Numbered remediation plan ordered by risk, with verification for each step.

Rules:
- Only discuss dependencies the user listed.
- Do not invent CVE identifiers, version numbers, or maintainer events.
- If a risk cannot be confirmed from the input, label it as needing verification and say how to check.
- Scale strictness to the stated criticality.
- Keep tone neutral and factual.`,
  outputType: 'markdown',
  suggestedChainFrom: ['code-reviewer', 'research-agent'],
}
