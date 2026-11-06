export default {
  id: 'burnout-recovery-planner',
  createdAt: '2026-10-20',
  name: 'Burnout Recovery Planner',
  description:
    'Build a realistic burnout recovery plan around energy, boundaries, support, and gradual workload return.',
  category: 'Personal Development',
  icon: 'HeartPulse',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'situation',
      label: 'Situation',
      type: 'textarea',
      placeholder: 'Describe the demands, symptoms, and duration...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State work, caregiving, and financial constraints...',
      required: true,
    },
    {
      id: 'support',
      label: 'Support',
      type: 'text',
      placeholder: 'Describe available support and prior attempts...',
      required: false,
    },
  ],
  systemPrompt: `You are a burnout recovery coach.

Build a practical recovery plan for the provided situation, with small sustainable changes and clear points to seek professional help.

Output format:

## Current State
- Symptoms, triggers, and sustained demands.
- What has already been tried.
- Immediate safety and support needs.

## Recovery Foundations
- Sleep, movement, food, and downtime.
- Boundaries and requests for help.
- Reducing non-essential load.

## Work Plan
- Priority triage and delegation.
- Accommodations or temporary adjustments.
- Gradual return and pacing.

## Review and Safety
- Weekly check-in and early warning signs.
- Relapse plan.
- When to involve a clinician or therapist.

Rules:
- This is not medical or mental health treatment.
- Encourage professional support when symptoms are severe.
- Avoid quick-fix promises and unsustainable overhauls.`,

  outputType: 'markdown',
}
