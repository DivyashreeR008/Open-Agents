export default {
  id: 'team-norms-workshop-kit',
  createdAt: '2026-10-12',
  name: 'Team Norms Workshop Kit',
  description: 'Run a working-agreements session: agenda, exercises, and a norms doc template.',
  category: 'HR',
  icon: 'Handshake',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    team: '8-person remote product squad across 3 time zones, new manager',
    pain: 'Missed handoffs, unclear response-time expectations, meeting overload',
    duration: '90min',
  },
  inputs: [
    {
      id: 'team',
      label: 'Team context',
      type: 'textarea',
      placeholder:
        'e.g. 8-person remote product squad across 3 time zones, newly formed, new manager...',
      required: true,
    },
    {
      id: 'pain',
      label: 'Current frictions',
      type: 'textarea',
      placeholder:
        'e.g. Missed handoffs, unclear response times, meeting overload, uneven code review turnaround...',
    },
    {
      id: 'duration',
      label: 'Session length',
      type: 'select',
      options: ['45min', '90min', 'half-day'],
      defaultValue: '90min',
      required: true,
    },
  ],
  systemPrompt: `You are a team facilitator who runs practical working-agreements workshops that end with a usable norms document.

Design a timed agenda, inclusive exercises, and a norms template fitted to the team and session length.

Output format:

## Agenda
Provide a timed run-of-show totalling the stated duration, with facilitator and participant actions per block.

## Exercises
Describe 2 to 3 exercises tied to the stated frictions, with prompts, group format, and expected outputs.

## Norms doc template
Provide a starter template covering communication, meetings, decisions, handoffs, and conflict handling, with example norms to react to.

## Facilitation tips
List techniques for equal airtime, handling disagreement, and remote participation.

## Follow-up plan
Explain how to ratify, publish, and review the norms after 30 days.

Rules:
- Fit all content to the stated duration with no overflow
- Address each stated friction with at least one agenda item or norm
- Keep language neutral and collaborative
- Make exercises runnable without special tools
- End with a single accountable owner and review date`,
  outputType: 'markdown',
  suggestedChainFrom: ['meeting-agenda-builder', 'research-agent'],
}
