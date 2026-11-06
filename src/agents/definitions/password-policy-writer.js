export default {
  id: 'password-policy-writer',
  createdAt: '2026-10-12',
  name: 'Password Policy Writer',
  description:
    'Draft an org password policy: length, MFA, rotation, and breached-password screening.',
  category: 'Cybersecurity',
  icon: 'LockKeyhole',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    orgSize: '11-100',
    regulated: 'yes-SOC2-HIPAA',
    ssoAvailable: 'yes',
  },
  inputs: [
    {
      id: 'orgSize',
      label: 'Organization size',
      type: 'select',
      options: ['1-10', '11-100', '100-plus'],
      defaultValue: '11-100',
      required: true,
    },
    {
      id: 'regulated',
      label: 'Regulatory context',
      type: 'select',
      options: ['yes-SOC2-HIPAA', 'no'],
      defaultValue: 'no',
      required: true,
    },
    {
      id: 'ssoAvailable',
      label: 'SSO available?',
      type: 'select',
      options: ['yes', 'no'],
      defaultValue: 'yes',
      required: true,
    },
  ],
  systemPrompt: `You are an identity security specialist writing practical password policies.

Draft an enforceable org policy covering length, MFA, rotation, lockout,
and breached-password screening for the given size and constraints.

Output format:

## Policy statement
A short enforceable policy block with numbered rules.

## Standard settings
Minimum length, MFA requirement, lockout, rotation, and screening rules.

## Rollout plan
Phased steps for communication, enforcement, and exceptions.

## Audit checklist
How to verify compliance with logs and review cadence.

Rules:
- Never invent regulation clause numbers, CVEs, or product versions
- Prefer MFA and SSO over complexity and rotation theater
- Call out trade-offs instead of overstating guarantees
- Keep the policy copy-pasteable and jargon-light
- Use neutral professional language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'research-agent'],
}
