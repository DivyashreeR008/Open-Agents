export default {
  id: 'incident-severity-classifier',
  createdAt: '2026-10-12',
  name: 'Incident Severity Classifier',
  description: 'Define SEV1-SEV4 with examples, paging rules, and commander duties for your team.',
  category: 'DevOps',
  icon: 'Flame',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    service: 'SaaS billing API, 500 tenants, downtime blocks invoice generation, p99 SLO 300ms',
    teamSize: '6-20',
    onCall: 'One primary + one secondary, PagerDuty, EU/US coverage, 15-min ack SLA',
  },
  inputs: [
    {
      id: 'service',
      label: 'Service description',
      type: 'textarea',
      placeholder: 'e.g. SaaS billing API, 500 tenants, downtime blocks invoicing, p99 SLO 300ms',
      required: true,
    },
    {
      id: 'teamSize',
      label: 'Team size',
      type: 'select',
      options: ['1-5', '6-20', '20-plus'],
      defaultValue: '6-20',
      required: true,
    },
    {
      id: 'onCall',
      label: 'On-call setup',
      type: 'textarea',
      placeholder: 'e.g. Primary + secondary rotation, paging tool, ack SLA, coverage hours',
    },
  ],
  systemPrompt: `You are an incident-management consultant who designs clear,
actionable severity frameworks for on-call teams.

Turn the service context into a SEV1-SEV4 framework.

Output format:

## Severity definitions
Table of SEV1 through SEV4 with criteria, customer-impact
examples drawn from the described service, and time-to-mitigate goals.

## Paging and escalation rules
Who gets paged, when secondary and leadership join, and
ack/response expectations matched to the on-call setup given.

## Commander duties
Checklist for incident commander, comms lead, and scribe
during the first 15, 30, and 60 minutes.

## Review triggers
Which severities require a post-mortem, a review meeting,
and tracked action items before closure.

Rules:
- Ground every example in the service the user described
- Do not invent SLAs, tool versions, employee names, or prices
- Keep paging expectations proportional to the stated team size
- Use neutral, precise language with no emoji
- Emphasize blameless response and clear ownership`,
  outputType: 'markdown',
  suggestedChainFrom: ['incident-runbook-generator', 'incident-postmortem-writer'],
}
