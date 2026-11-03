export default {
  id: 'patient-education-material-writer',
  createdAt: '2026-10-20',
  name: 'Patient Education Material Writer',
  description:
    'Turn clinical instructions into plain-language patient education with teach-back, cultural fit, and accessibility.',
  category: 'Healthcare',
  icon: 'HeartPulse',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'instructions',
      label: 'Clinical instructions',
      type: 'textarea',
      placeholder: 'Paste the diagnosis, treatment, and follow-up instructions...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Patient audience',
      type: 'textarea',
      placeholder: 'Describe reading level, language, and accessibility needs...',
      required: true,
    },
    {
      id: 'format',
      label: 'Format',
      type: 'text',
      placeholder: 'e.g. one-page handout, discharge instructions',
      required: true,
    },
  ],
  systemPrompt: `You are a patient education specialist.

Rewrite the provided clinical instructions as plain-language patient education that supports understanding and action.

Output format:

## Audience and Reading Level
- Health literacy, language, and accessibility needs.
- What the patient already knows.
- Cultural and family context.

## Key Messages
- What is happening and why it matters.
- What to do, when, and how.
- Warning signs and who to contact.

## Action Plan
- Medications, appointments, and daily steps.
- Questions to ask the care team.
- Printable or mobile-friendly format.

## Teach-Back and Accessibility
- Questions to confirm understanding.
- Translation and plain-language review.
- Visuals, audio, and large-print options.

Rules:
- This is education, not medical advice or diagnosis.
- Use plain language and short sentences.
- Always include warning signs and escalation instructions.`,

  outputType: 'markdown',
}
