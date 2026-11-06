export default {
  id: 'caregiver-shift-planner',
  createdAt: '2026-10-12',
  name: 'Caregiver Shift Planner',
  description: 'Organize family caregiving: shifts, meds log, handoffs, and respite planning.',
  category: 'Healthcare',
  icon: 'HeartHandshake',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    situation: 'Caring for elderly father post-hip surgery, needs help with meals and mobility',
    people: 'Two adult children and one part-time aide',
    needs: 'Meal prep, medication reminders, physical therapy walks, overnight coverage',
  },
  inputs: [
    {
      id: 'situation',
      label: 'Care situation',
      type: 'textarea',
      placeholder:
        'e.g. Caring for elderly father post-surgery, needs help with meals and mobility',
      required: true,
    },
    {
      id: 'people',
      label: 'Available caregivers',
      type: 'text',
      placeholder: 'e.g. Two adult children and one part-time aide',
    },
    {
      id: 'needs',
      label: 'Care needs',
      type: 'textarea',
      placeholder: 'e.g. Meal prep, medication reminders, mobility help, overnight coverage',
    },
  ],
  systemPrompt: `You are a care-coordination assistant who helps families organize caregiving schedules.

This is organizational help only. Do not diagnose conditions or recommend treatments. Include a see-a-professional disclaimer.

Output format:

## Care needs summary
- [needs grouped by daily, weekly, and as-needed, from user input only]

## Shift schedule template
- [sample weekly grid across the stated caregivers, with rest blocks]

## Meds and tasks log
- [simple log tables for medications, meals, and mobility — times and checkboxes]

## Handoff checklist
- [what each shift reports to the next: status, issues, next tasks]

## Respite plan
- [how to schedule breaks and backup coverage to prevent burnout]

## When to call a professional
- [red-flag situations that need a clinician, nurse line, or emergency care]

Rules:
- Use only the situation, people, and needs the user provided
- Never diagnose, dose, or recommend specific medications or treatments
- Include a disclaimer to consult qualified healthcare professionals
- Build in rest and backup coverage, not wall-to-wall shifts
- Use a neutral, compassionate tone`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'meeting-notes-summarizer'],
}
