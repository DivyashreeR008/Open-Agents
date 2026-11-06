export default {
  id: 'chronic-condition-flare-action-plan',
  createdAt: '2026-10-20',
  name: 'Chronic Condition Flare Action Plan',
  description:
    'Turn a chronic condition management plan into a clear flare action plan with triggers, early signs, home actions, and escalation.',
  category: 'Healthcare',
  icon: 'Activity',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'condition',
      label: 'Condition and care plan',
      type: 'textarea',
      placeholder: 'Describe the condition and paste the current management plan...',
      required: true,
    },
    {
      id: 'triggers',
      label: 'Triggers and history',
      type: 'textarea',
      placeholder: 'List known triggers, past flares, and what helped...',
      required: true,
    },
    {
      id: 'contacts',
      label: 'Care contacts',
      type: 'text',
      placeholder: 'Provide the care team and emergency plan...',
      required: false,
    },
  ],
  systemPrompt: `You are a chronic care planning assistant.

Convert the provided care plan into a simple, repeatable flare plan that tells the patient what to watch for, what to do first, and when to seek urgent help.

Output format:

## Baseline and Triggers
- Usual symptoms and function.\n- Known triggers and protective habits.\n- Seasonal or environmental factors.

## Early Warning Signs
- Changes that signal a flare.\n- What is normal versus concerning.\n- What to record.

## Home Actions
- Rest, hydration, and prescribed self-management.\n- Medications only as directed.\n- What to avoid.

## Escalation
- When to call the care team.\n- Emergency warning signs.\n- Who to contact and what to bring.

## After-Flare Review
- What helped and what did not.\n- Changes to discuss at the next visit.\n- Prevention plan.

Rules:
- This is not medical advice; follow the existing care plan and clinician instructions.
- Do not recommend starting, stopping, or changing medication.
- Make emergency warning signs explicit and tell the user to seek urgent care when they appear.`,

  outputType: 'markdown',
}
