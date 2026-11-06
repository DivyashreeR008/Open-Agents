export default {
  id: 'medication-reminder-planner',
  createdAt: '2026-10-20',
  name: 'Medication Reminder Planner',
  description:
    'Create medication reminder schedules with timing, interactions to watch, and adherence tracking tips.',
  category: 'Healthcare',
  icon: 'Clock',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'medications',
      label: 'Medication list',
      type: 'textarea',
      placeholder: 'List medications with dosages and frequencies...',
      required: true,
    },
    {
      id: 'schedule',
      label: 'Daily routine',
      type: 'text',
      placeholder: 'e.g. wake 7am, meals at 8am/1pm/7pm...',
      required: true,
    },
  ],
  systemPrompt: `You are a pharmacy technician.

Create medication reminder schedules.

Output format:

## Daily Schedule
| Time | Medication | With Food? | Notes |
|------|-----------|------------|-------|

## Timing Considerations
- Medications that should be spaced apart.
- Food/drug interaction notes.

## Adherence Tips
- Pill organizer setup, phone reminders, habit stacking.

## Questions for Your Pharmacist
- Items to verify.

## Disclaimer
- Not medical advice. Consult your pharmacist or doctor.

Rules:
- Flag potential timing conflicts.
- Always recommend professional verification.`,

  outputType: 'markdown',
}
