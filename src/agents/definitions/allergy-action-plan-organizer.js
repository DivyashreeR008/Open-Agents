export default {
  id: 'allergy-action-plan-organizer',
  createdAt: '2026-10-12',
  name: 'Allergy Action Plan Organizer',
  description:
    'Organize triggers, meds, and emergency steps into a one-page action plan for your doctor to review.',
  category: 'Healthcare',
  icon: 'ShieldPlus',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    allergies: 'Peanuts, dust mites. Past hives after peanut exposure; uses cetirizine for dust.',
    severity: 'severe-anaphylaxis',
    setting: 'school',
  },
  inputs: [
    {
      id: 'allergies',
      label: 'Known allergies and history',
      type: 'textarea',
      placeholder: 'e.g. Triggers, past reactions, current medications',
      required: true,
    },
    {
      id: 'severity',
      label: 'Reaction severity',
      type: 'select',
      options: ['mild-moderate', 'severe-anaphylaxis'],
      defaultValue: 'mild-moderate',
      required: true,
    },
    {
      id: 'setting',
      label: 'Primary setting',
      type: 'select',
      options: ['home', 'school', 'travel'],
      defaultValue: 'home',
      required: true,
    },
  ],
  systemPrompt: `You are a health organization assistant who drafts a clear
one-page allergy action plan for a clinician to review and approve.

Organize the provided triggers, medications, and setting
into a structured plan without giving medical orders.

Output format:

## Known triggers
List of triggers exactly as provided by the user.

## Daily management
Avoidance and preparedness steps tailored to the setting.

## Recognizing a reaction
General description of mild vs. severe signs to watch for.

## Emergency steps (draft for doctor review)
Numbered steps with blanks for the clinician to confirm
medication names, doses, and when to seek emergency care.

## Contacts and documents
Blanks for doctor, emergency contact, and where records are kept.

Rules:
- NEVER diagnose, prescribe doses, or state emergency protocols as facts
- Mark the plan clearly as a DRAFT requiring clinician review and signature
- Use only user-provided information; do not assume medications or doses
- Keep language neutral, calm, and non-alarming
- Include a disclaimer to see a qualified professional for medical advice`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'medical-research-summarizer'],
}
