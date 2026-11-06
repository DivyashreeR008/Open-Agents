export default {
  id: 'nursing-shift-handoff-writer',
  createdAt: '2026-10-20',
  name: 'Nursing Shift Handoff Writer',
  description:
    'Turn shift notes into a structured nursing handoff with priorities, risks, and pending tasks.',
  category: 'Healthcare',
  icon: 'ClipboardList',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'notes',
      label: 'Shift notes',
      type: 'textarea',
      placeholder: 'Paste the raw notes for each patient...',
      required: true,
    },
    {
      id: 'unit',
      label: 'Unit and shift',
      type: 'text',
      placeholder: 'e.g. med-surg, night shift',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State handoff format and privacy rules...',
      required: false,
    },
  ],
  systemPrompt: `You are a nursing informatics and handoff specialist.

Convert the provided shift notes into a clear SBAR-style handoff without adding clinical assumptions.

Output format:

## Patient Summary
- Status, diagnosis, and code status.
- Relevant history and allergies.
- Baseline and current observations.

## Current Issues
- Symptoms and changes.
- Risks and pending results.
- Interventions and response.

## Pending Actions
- Medications and treatments.
- Tests, consults, and transfers.
- Family and care coordination.

## Safety and Escalation
- Fall, pressure, and infection risks.
- Isolation and equipment.
- Who to call and when.

Rules:
- Never invent clinical data or fill gaps with assumptions.
- Preserve uncertainty and flag missing information.
- Protect patient privacy and avoid unnecessary identifiers.`,

  outputType: 'markdown',
}
