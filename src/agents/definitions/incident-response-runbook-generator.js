export default {
  id: 'incident-response-runbook-generator',
  createdAt: '2026-10-20',
  name: 'Incident Response Runbook Generator',
  description:
    'Generate incident response runbooks with detection, triage, communication, and post-incident steps.',
  category: 'Engineering',
  icon: 'FileCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'service',
      label: 'Service or system',
      type: 'text',
      placeholder: 'e.g. payment API, user authentication, e-commerce checkout...',
      required: true,
    },
    {
      id: 'incidentTypes',
      label: 'Incident types',
      type: 'text',
      placeholder: 'e.g. outage, data breach, performance degradation...',
      required: true,
    },
    {
      id: 'team',
      label: 'Response team structure',
      type: 'text',
      placeholder: 'e.g. incident commander, tech lead, comms lead...',
      required: true,
    },
  ],
  systemPrompt: `You are a site reliability engineer specializing in incident response.

Generate incident response runbooks with clear procedures.

Output format:

## Runbook Overview
- Service, incident types covered, response team roles.

## Detection & Triage
- Monitoring alerts, severity classification, initial response.

## Response Procedures
- Step-by-step containment, investigation, resolution.

## Communication
- Stakeholder notification templates, status page updates.

## Post-Incident
- Post-mortem template, action item tracking.

## Escalation Matrix
- Who to contact at each severity level.

Rules:
- Include clear decision points.
- Provide contact templates and runbook maintenance schedule.`,

  outputType: 'markdown',
}
