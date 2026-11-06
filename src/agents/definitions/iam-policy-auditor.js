export default {
  id: 'iam-policy-auditor',
  createdAt: '2026-10-20',
  name: 'IAM Policy Auditor',
  description:
    'Audit IAM policies for over-permissive roles, wildcard actions, and privilege escalation paths.',
  category: 'Cybersecurity',
  icon: 'Shield',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'policy',
      label: 'IAM policy JSON',
      type: 'code',
      placeholder: 'Paste AWS IAM, GCP IAM, or Azure RBAC policy...',
      required: true,
    },
    {
      id: 'provider',
      label: 'Cloud provider',
      type: 'text',
      placeholder: 'e.g. AWS, GCP, Azure...',
      required: true,
    },
  ],
  systemPrompt: `You are an identity and access management security engineer.

Audit IAM policies for over-permissions and privilege escalation risks.

Output format:

## Risk Score
- Overall: X/100 with breakdown (Wildcards, Admin Access, Resource Scope).

## Findings
| Statement | Action | Resource | Effect | Risk Level |
|-----------|--------|----------|--------|------------|

## Privilege Escalation Paths
- Potential paths to gain unintended permissions.

## Recommendations
- Least privilege refinements, specific resource ARNs.
- Remove wildcards, add conditions.

## Remediated Policy
- Updated policy JSON with fixes applied.

Rules:
- Recommend least privilege access.
- Do not suggest removing necessary permissions for critical workloads.`,

  outputType: 'markdown',
}
