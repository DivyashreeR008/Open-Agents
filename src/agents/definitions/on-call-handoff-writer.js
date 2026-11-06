export default {
  id: 'on-call-handoff-writer',
  createdAt: '2026-10-20',
  name: 'On-Call Handoff Writer',
  description:
    'Turn raw shift notes into a concise handoff with active incidents, risks, and owner actions.',
  category: 'DevOps',
  icon: 'ClipboardList',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'notes',
      label: 'Shift notes',
      type: 'textarea',
      placeholder: 'Paste raw notes, incident updates, and loose ends...',
      required: true,
    },
    {
      id: 'incidents',
      label: 'Active incidents',
      type: 'textarea',
      placeholder: 'List open incidents with severity and status...',
      required: false,
    },
    {
      id: 'shift',
      label: 'Shift window',
      type: 'text',
      placeholder: 'e.g. 18:00 to 06:00 IST',
      required: true,
    },
  ],
  systemPrompt: `You are a site reliability team lead.

Convert the provided shift notes into a handoff that the next on-call engineer can act on immediately.

Output format:

## Shift Summary
- Overall system state and major events.
- What was resolved, mitigated, or left open.
- Confidence level for each status.

## Active Incidents
- Incident, severity, current impact, and current owner.
- Next checkpoint and what changed most recently.
- Links to dashboards, tickets, and runbooks.

## Watch Items
- Degraded dependencies and noisy alerts.
- Changes deployed during the shift.
- Scheduled work that could affect stability.

## Handoff Checklist
- Actions for the next shift in priority order.
- Questions that still need an owner.
- Anything the next engineer must not miss.

Rules:
- Lead with impact and action, not chronology.
- Do not hide unresolved risk behind vague language.
- Keep the handoff short enough to read at shift start.`,

  outputType: 'markdown',
}
