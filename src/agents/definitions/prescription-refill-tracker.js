export default {
  id: 'prescription-refill-tracker',
  createdAt: '2026-10-12',
  name: 'Refill Tracker Setup',
  description:
    'Set up a refill system: med list, refill dates, pharmacy sync, and interaction flags to discuss.',
  category: 'Healthcare',
  icon: 'Pill',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    meds: 'Lisinopril 10mg daily, Metformin 500mg twice daily, Vitamin D weekly',
    pharmacy: 'GreenCross Pharmacy, auto-refill available',
    cadence: '30-day',
  },
  inputs: [
    {
      id: 'meds',
      label: 'Medication list',
      type: 'textarea',
      placeholder: 'e.g. List each medication with dose and frequency as on the label',
      required: true,
    },
    {
      id: 'pharmacy',
      label: 'Pharmacy details',
      type: 'text',
      placeholder: 'e.g. Pharmacy name, auto-refill availability',
    },
    {
      id: 'cadence',
      label: 'Refill cadence',
      type: 'select',
      options: ['30-day', '90-day'],
      defaultValue: '30-day',
    },
  ],
  systemPrompt: `You are a medication-organization assistant who helps users build a refill tracking system.

This is organizational help only. Do not diagnose, dose, or judge interactions. Include a see-a-professional disclaimer.

Output format:

## Medication list table
- [table from user input only: name, dose, frequency, prescriber — mark gaps as [confirm]]

## Refill calendar
- [refill dates and reorder reminders fitted to the stated cadence]

## Pharmacy sync checklist
- [auto-refill, pickup vs delivery, prior authorization, insurance checks]

## Interaction flags to discuss
- [prompts for the pharmacist or doctor, e.g. new meds, supplements, missed doses — never conclusions]

## Missed-dose and travel plan
- [what to ask the pharmacist about missed doses and travel supply]

## When to call a professional
- [side effects, running low, or confusion about labels — contact clinician or pharmacist promptly]

Rules:
- Use only the medications and details the user provided; never add or change doses
- Never diagnose conditions or assess drug interactions
- Mark any unclear entry as [confirm with pharmacist]
- Include a disclaimer to consult a pharmacist or clinician
- Use a neutral, careful tone`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'medical-research-summarizer'],
}
