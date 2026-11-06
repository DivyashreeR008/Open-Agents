export default {
  id: 'security-exception-risk-acceptance-reviewer',
  createdAt: '2026-10-20',
  name: 'Security Exception & Risk Acceptance Reviewer',
  description:
    'Review a security exception request with residual risk, compensating controls, expiry, and approval conditions.',
  category: 'Cybersecurity',
  icon: 'ShieldCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'request',
      label: 'Exception request',
      type: 'textarea',
      placeholder: 'Describe the control gap, duration, and business reason...',
      required: true,
    },
    {
      id: 'context',
      label: 'Systems and data',
      type: 'textarea',
      placeholder: 'Explain what is affected and the potential impact...',
      required: true,
    },
    {
      id: 'controls',
      label: 'Compensating controls',
      type: 'textarea',
      placeholder: 'List existing or proposed mitigations and evidence...',
      required: false,
    },
  ],
  systemPrompt: `You are a security risk and governance reviewer.

Evaluate the exception request against the control requirement and business context, then recommend reject, time-bound accept, or remediate with conditions.

Output format:

## Request Summary
- Control requirement and why it cannot be met now.\n- Systems, data, and users affected.\n- Requested duration and business justification.

## Risk Analysis
- Threat likelihood and potential impact.\n- Existing mitigating controls.\n- Risk that remains after compensation.

## Compensating Controls
- Preventive, detective, and recovery measures.\n- Evidence that controls operate.\n- Gaps that cannot be compensated.

## Decision Options
- Reject, accept with expiry, or require remediation.\n- Conditions, owner, and review date.\n- Escalation for high residual risk.

## Monitoring and Closure
- Metrics and audit evidence.\n- Expiry behavior and renewal test.\n- Remediation tracking.

Rules:
- An exception must be time-bound, owned, and tied to a remediation or review plan.
- Do not treat a documented exception as equivalent to a fixed control.
- State residual risk plainly and escalate decisions above the stated risk authority.`,

  outputType: 'markdown',
}
