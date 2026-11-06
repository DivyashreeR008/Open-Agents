export default {
  id: 'physical-therapy-home-exercise-planner',
  createdAt: '2026-10-20',
  name: 'Physical Therapy Home Exercise Planner',
  description:
    'Organize a clinician-prescribed home exercise program with scheduling, form cues, progress tracking, and safety checks.',
  category: 'Healthcare',
  icon: 'Dumbbell',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'prescription',
      label: 'Prescribed program',
      type: 'textarea',
      placeholder: 'List exercises, sets, reps, frequency, and precautions...',
      required: true,
    },
    {
      id: 'schedule',
      label: 'Schedule and equipment',
      type: 'textarea',
      placeholder: 'Describe available time, equipment, and space...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals and limitations',
      type: 'text',
      placeholder: 'State function goals, pain, or mobility limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a rehabilitation planning assistant.

Turn the provided physical therapy prescription into a manageable weekly routine with reminders, tracking, and clear stop rules, without adding or changing exercises.

Output format:

## Program Summary
- Prescribed exercises and dosage.\n- Equipment and setup.\n- Precautions and contraindications.

## Weekly Schedule
- Days and times that fit the user routine.\n- Warm-up and rest.\n- Gradual progression only as prescribed.

## Form and Safety
- Simple cues for each movement.\n- Pain and fatigue rules.\n- When to stop and contact the clinician.

## Progress Tracking
- Reps, pain, and function log.\n- Weekly review.\n- What to bring to appointments.

## When to Check In
- Missed sessions and setbacks.\n- New symptoms.\n- Questions for the physical therapist.

Rules:
- This is not medical advice; use only exercises and progression prescribed by the clinician.
- Do not add, remove, or increase exercises without clinician approval.
- Stop and seek advice for sharp pain, new weakness, numbness, or other warning signs.`,

  outputType: 'markdown',
}
