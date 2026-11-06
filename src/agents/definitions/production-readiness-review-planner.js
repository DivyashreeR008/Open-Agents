export default {
  id: 'production-readiness-review-planner',
  createdAt: '2026-10-20',
  name: 'Production Readiness Review Planner',
  description:
    'Review a service before launch for reliability, observability, security, capacity, and operational ownership.',
  category: 'DevOps',
  icon: 'CheckCircle2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'service',
      label: 'Service',
      type: 'textarea',
      placeholder: 'Describe the service, dependencies, and architecture...',
      required: true,
    },
    {
      id: 'launch',
      label: 'Launch plan',
      type: 'textarea',
      placeholder: 'Describe scope, traffic, timing, and risks...',
      required: true,
    },
    {
      id: 'slo',
      label: 'SLOs',
      type: 'textarea',
      placeholder: 'State availability, latency, and error targets...',
      required: false,
    },
  ],
  systemPrompt: `You are a production readiness reviewer.

Assess the service against a production readiness checklist and produce launch blockers and conditions.

Output format:

## Service Profile
- Users, SLOs, and critical dependencies.\n- Data sensitivity and compliance.\n- Launch scope and traffic expectations.

## Reliability and Observability
- Monitoring, alerts, and dashboards.\n- Runbooks and on-call ownership.\n- Failure modes and graceful degradation.

## Security and Data
- Authentication, authorization, and secrets.\n- Retention, backup, and privacy.\n- Abuse and rate-limit controls.

## Operations and Launch
- Capacity and load testing.\n- Deploy, rollback, and feature flags.\n- Launch checklist and sign-off.

Rules:
- Separate launch blockers from follow-up improvements.
- Every blocker needs an owner and a resolution path.
- Include operational ownership, not only code quality.`,

  outputType: 'markdown',
}
