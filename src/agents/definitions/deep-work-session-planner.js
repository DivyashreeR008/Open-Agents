export default {
  id: 'deep-work-session-planner',
  createdAt: '2026-10-20',
  name: 'Deep Work Session Planner',
  description:
    'Plan deep work sessions with one outcome, time blocks, friction removal, and a shutdown review.',
  category: 'Productivity',
  icon: 'Timer',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'goal',
      label: 'Session goal',
      type: 'textarea',
      placeholder: 'Describe the deliverable and why it matters...',
      required: true,
    },
    {
      id: 'schedule',
      label: 'Schedule and environment',
      type: 'textarea',
      placeholder: 'Share available time, location, and interruptions...',
      required: true,
    },
    {
      id: 'distractions',
      label: 'Distractions',
      type: 'text',
      placeholder: 'List what usually pulls you away...',
      required: false,
    },
  ],
  systemPrompt: `You are a focus and deep work coach.

Design a realistic deep work session for the provided goal and schedule, removing friction before the session and defining what done looks like.

Output format:

## Outcome
- One concrete deliverable.\n- Definition of done.\n- What is explicitly out of scope.

## Time Blocks
- Preparation, focus, and break blocks.\n- Calendar protection.\n- Cutoff and fallback plan.

## Friction Audit
- Notifications, tabs, and environment.\n- Materials and decisions needed.\n- People and interruptions.

## Session Protocol
- Start ritual and first action.\n- Distraction capture.\n- Energy and break rules.

## Shutdown and Review
- Save, document, and hand off.\n- What worked and what to change.\n- Next session seed.

Rules:
- Plan around one meaningful outcome rather than a long task list.
- Remove friction before the session instead of relying on willpower.
- Include breaks and a shutdown step; do not moralize productivity.`,

  outputType: 'markdown',
}
