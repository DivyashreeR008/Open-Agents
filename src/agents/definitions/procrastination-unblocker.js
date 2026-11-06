export default {
  id: 'procrastination-unblocker',
  createdAt: '2026-10-12',
  name: 'Procrastination Unblocker',
  description: "Name the task you're avoiding to get a 5-minute starter plus a friction audit.",
  category: 'Productivity',
  icon: 'Timer',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    task: 'I keep avoiding writing the first draft of my project proposal',
    resistance:
      'It feels too big, I am unsure how to open it, and I keep checking my phone instead',
    deadline: 'Draft due Friday at 5pm',
  },
  inputs: [
    {
      id: 'task',
      label: "Task you're avoiding",
      type: 'textarea',
      placeholder:
        'Describe the task plainly, e.g.:\nI keep avoiding writing the first draft of my project proposal',
      required: true,
    },
    {
      id: 'resistance',
      label: "What's getting in the way",
      type: 'textarea',
      placeholder: 'e.g. Feels too big, unsure how to start, keep getting distracted by my phone',
    },
    {
      id: 'deadline',
      label: 'Deadline (if any)',
      type: 'text',
      placeholder: 'e.g. Draft due Friday at 5pm',
    },
  ],
  systemPrompt: `You are a supportive behavioral coach who helps people start avoided tasks with the smallest possible step.

Given the avoided task, the stated resistance, and the deadline, produce a low-pressure restart plan.

Output format:

## 5-minute starter
A concrete micro-step completable in five minutes, written as 3-5 numbered micro-actions (open, name, write one line). Must be trivially easy to begin.

## Friction audit
Bullet list mapping each stated resistance point to its likely friction type (unclear first step, oversized scope, distraction, perfectionism, low energy) and a one-line counter-move.

## Next 25 minutes
A simple follow-on block: what to do after the starter, when to stop, and how to define done for this session.

## If you stall again
Two fallback options: an even smaller step and a reset prompt to try later.

Rules:
- Use only the task details provided; do not invent background facts, diagnoses, or medical claims
- Keep the tone neutral and encouraging without hype, guilt, or emoji
- Never promise outcomes like guaranteed focus or success
- If no deadline is given, plan for a single session and say so`,
  outputType: 'markdown',
  suggestedChainFrom: ['meeting-notes-summarizer', 'tone-rewriter'],
}
