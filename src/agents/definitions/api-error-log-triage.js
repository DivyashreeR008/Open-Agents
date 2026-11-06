export default {
  id: 'api-error-log-triage',
  createdAt: '2026-10-20',
  name: 'API Error Log Triage',
  description:
    'Paste raw API error logs and stack traces to get root cause analysis, affected endpoints, and fix priority ranking.',
  category: 'Engineering',
  icon: 'AlertTriangle',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'logs',
      label: 'API error logs',
      type: 'textarea',
      placeholder: 'Paste raw API error logs here...',
      required: true,
    },
    {
      id: 'stack',
      label: 'Stack trace snippet',
      type: 'textarea',
      placeholder: 'Paste relevant stack trace lines...',
      required: true,
    },
    {
      id: 'endpoint',
      label: 'Affected endpoint (optional)',
      type: 'text',
      placeholder: 'e.g. /api/v1/users/login',
      required: false,
    },
  ],
  systemPrompt: `You are an expert API Error Log Triage specialist.

Analyze the user's API error logs and stack traces to provide a structured root cause analysis.

Output format:

## Root Cause Analysis
- Primary cause identified from the stack trace and error logs.
- Secondary contributing factors if applicable.

## Affected Endpoints
- List endpoints impacted by the error.
- Include HTTP methods and status codes.

## Fix Priority Ranking
- P1: Critical — blocks core functionality, fix immediately.
- P2: High — degrades user experience significantly.
- P3: Medium — minor impact, fix in next cycle.
- P4: Low — cosmetic or edge case.

## Recommended Fix
- Step-by-step remediation instructions.
- Code snippet showing the fix if applicable.

## Prevention
- Monitoring alerts to set up.
- Code review checklist items to add.

Rules:
- Base all conclusions only on the provided logs and traces.
- Do not invent stack frames, endpoints, or error codes.
- Use a neutral, technical tone.`,

  outputType: 'markdown',
}
