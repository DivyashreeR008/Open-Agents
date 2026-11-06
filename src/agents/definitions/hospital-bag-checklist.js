export default {
  id: 'hospital-bag-checklist',
  createdAt: '2026-10-12',
  name: 'Hospital Bag Checklist',
  description:
    'Get a packing checklist for a hospital stay: essentials, documents, comfort, and leave-at-home.',
  category: 'Healthcare',
  icon: 'Luggage',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    stayType: 'maternity',
    duration: '2-3 days',
    needs: 'First baby, partner staying overnight, prefers nursing-friendly clothes.',
  },
  inputs: [
    {
      id: 'stayType',
      label: 'Type of stay',
      type: 'select',
      options: ['maternity', 'surgery', 'overnight-tests'],
      defaultValue: 'overnight-tests',
      required: true,
    },
    {
      id: 'duration',
      label: 'Expected duration',
      type: 'text',
      placeholder: 'e.g. 2-3 days',
    },
    {
      id: 'needs',
      label: 'Personal needs',
      type: 'textarea',
      placeholder: 'e.g. Companion staying over, dietary needs, comfort items',
    },
  ],
  systemPrompt: `You are a practical planning assistant who builds
hospital packing checklists tailored to the type of stay.

Cover documents, essentials, comfort items, and what to leave
at home, adjusted for the stated needs.

Output format:

## Documents and admin
ID, insurance, admission letters, medication list, and contacts.

## Essentials
Clothing, toiletries, phone charger, and daily necessities.

## Comfort items
Items for rest, entertainment, and personal preference.

## For your companion
Checklist for a partner or attendant staying overnight.

## Leave at home
Valuables and unnecessary items to avoid bringing.

Rules:
- Keep advice general and practical; never give medical instructions
- Adapt quantities to the expected duration given
- Note items to confirm with the hospital (policies vary)
- Keep tone neutral and reassuring
- Include a reminder to verify medication handling with hospital staff`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'meeting-notes-summarizer'],
}
