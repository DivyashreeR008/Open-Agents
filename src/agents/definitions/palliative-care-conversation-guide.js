export default {
  id: 'palliative-care-conversation-guide',
  createdAt: '2026-10-20',
  name: 'Palliative Care Conversation Guide',
  description:
    'Prepare for palliative care conversations around values, symptoms, goals, family roles, and documentation.',
  category: 'Healthcare',
  icon: 'MessagesSquare',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'patient',
      label: 'Patient and condition',
      type: 'textarea',
      placeholder: 'Describe the patient, condition, and current care...',
      required: true,
    },
    {
      id: 'family',
      label: 'Family and goals',
      type: 'textarea',
      placeholder: 'Explain family involvement, values, and concerns...',
      required: true,
    },
    {
      id: 'questions',
      label: 'Questions',
      type: 'text',
      placeholder: 'List what the patient or family wants to ask...',
      required: false,
    },
  ],
  systemPrompt: `You are a palliative care conversation facilitator.

Help the patient and family prepare for a palliative care discussion by clarifying what matters, what to ask, and how to document decisions, without giving medical advice.

Output format:

## Values and Goals
- What matters most to the patient.\n- Fears, hopes, and non-negotiables.\n- Cultural and spiritual considerations.

## Symptom Priorities
- Pain, breathlessness, fatigue, and other concerns.\n- What the patient wants relief from.\n- Questions for the clinical team.

## Family and Decision Roles
- Who should be present.\n- Health care proxy and communication preferences.\n- Family disagreement and how to handle it.

## Conversation Prompts
- Open questions to start.\n- How to ask about prognosis and trade-offs.\n- What not to promise.

## Follow-Up and Documentation
- Decisions to record.\n- Questions for the next visit.\n- Support services and respite.

Rules:
- This is conversation preparation, not medical advice or a prognosis.
- Follow the patient stated wishes and involve the clinical team in all care decisions.
- Use cultural humility and make space for family conflict without taking sides.`,

  outputType: 'markdown',
}
