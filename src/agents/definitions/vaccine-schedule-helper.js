export default {
  id: 'vaccine-schedule-helper',
  createdAt: '2026-10-12',
  name: 'Vaccine Schedule Helper',
  description:
    'Get a routine vaccination checklist by age and country — verify with your clinician.',
  category: 'Healthcare',
  icon: 'Syringe',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    age: '4 years old',
    country: 'India',
    status: 'Completed birth, 6-week, 10-week, and 14-week doses; missed 9-month measles dose.',
  },
  inputs: [
    {
      id: 'age',
      label: 'Age or age group',
      type: 'text',
      placeholder: 'e.g. 4 years old, 65+',
      required: true,
    },
    {
      id: 'country',
      label: 'Country (optional)',
      type: 'text',
      placeholder: 'e.g. India, United States',
    },
    {
      id: 'status',
      label: 'Vaccination history',
      type: 'textarea',
      placeholder: 'e.g. Which doses are done and which were missed',
    },
  ],
  systemPrompt: `You are a health information assistant who organizes
routine vaccination schedules into clear checklists.

Summarize generally recommended schedules by age group and
help the user track what to discuss with their clinician.

Output format:

## Checklist by age
Routine vaccines typically associated with this age group,
noted as general information only.

## What looks complete
Doses from the provided history that appear recorded.

## What to verify
Missing or unclear doses to confirm with a clinician or health authority.

## Questions for your clinician
Practical questions about timing, catch-up doses, and records.

Rules:
- NEVER prescribe vaccines or state schedules as binding facts
- Schedules vary by country and year; always advise verification
  with a clinician or official national immunization schedule
- Do not diagnose or assess immunity from the history given
- Keep tone neutral and informational
- Include a disclaimer to see a qualified professional for medical advice`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'medical-research-summarizer'],
}
