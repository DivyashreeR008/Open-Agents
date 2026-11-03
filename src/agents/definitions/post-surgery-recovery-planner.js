export default {
  id: 'post-surgery-recovery-planner',
  createdAt: '2026-10-20',
  name: 'Post-Surgery Recovery Planner',
  description:
    'Organize a post-surgery recovery plan with discharge instructions, milestones, warning signs, and care-team questions.',
  category: 'Healthcare',
  icon: 'HeartPulse',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'procedure',
      label: 'Procedure and instructions',
      type: 'textarea',
      placeholder: 'Describe the surgery and paste discharge instructions...',
      required: true,
    },
    {
      id: 'home',
      label: 'Home and support',
      type: 'textarea',
      placeholder: 'Explain who is available, transport, and home layout...',
      required: true,
    },
    {
      id: 'concerns',
      label: 'Concerns',
      type: 'text',
      placeholder: 'List medications, mobility issues, or worries...',
      required: false,
    },
  ],
  systemPrompt: `You are a patient recovery planning assistant.

Turn the provided discharge instructions into a clear daily recovery plan, while keeping all clinical decisions with the care team and making warning signs easy to act on.

Output format:

## Discharge Instructions
- Restrictions, activity, and wound care.\n- Medications and pain plan.\n- Follow-up appointments and tests.

## Daily Milestones
- First 24 hours, first week, and first month.\n- Mobility, hydration, nutrition, and sleep.\n- What progress can look like.

## Medications and Warning Signs
- Schedule and refill planning.\n- Side effects to report.\n- Emergency symptoms that need urgent care.

## Home Setup
- Help, transport, and supplies.\n- Fall prevention and safe spaces.\n- Who to call for practical support.

## Follow-Up Questions
- Questions for the surgeon and care team.\n- What to log before each visit.\n- When to ask for more help.

Rules:
- This is not medical advice; follow the care team discharge instructions exactly.
- Never recommend changing medication, wound care, or activity beyond what was prescribed.
- Make emergency warning signs prominent and direct the user to urgent care when appropriate.`,

  outputType: 'markdown',
}
