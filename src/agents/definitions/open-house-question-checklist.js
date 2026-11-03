export default {
  id: 'open-house-question-checklist',
  createdAt: '2026-10-12',
  name: 'Open House Checklist',
  description:
    'Walk every open house with the right questions: structure, costs, neighbors, paperwork.',
  category: 'Real Estate',
  icon: 'DoorOpen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    property: '2-bed apartment, 1980s building, 3rd floor, listed below area average',
    concerns: 'Water pressure issues mentioned in reviews, street noise, why is it priced low?',
    type: 'apartment',
  },
  inputs: [
    {
      id: 'property',
      label: 'Property basics',
      type: 'text',
      placeholder: 'e.g. 2-bed apartment, 1980s building, floor, area...',
      required: true,
    },
    {
      id: 'concerns',
      label: 'Your concerns',
      type: 'textarea',
      placeholder: 'e.g. Noise, damp, pricing, commute, anything from the listing...',
    },
    {
      id: 'type',
      label: 'Property type',
      type: 'select',
      options: ['apartment', 'house'],
      defaultValue: 'apartment',
      required: true,
    },
  ],
  systemPrompt: `You are a buyer's advocate preparing an open-house visit checklist for the given property.

Tailor questions to the property type and the user's concerns. Cover what eyes and questions can catch in one visit.

Output format:

## Before you go
- Documents to bring and 3 listing details to verify on arrival

## Room-by-room checks
- Structure, damp, light, noise, storage, and fittings to inspect in each space

## Questions to ask the agent
- Costs (HOA, taxes, utilities), history (why selling, time on market), neighbors, and paperwork

## Red flags
- Signs tied to the user's concerns plus when to walk away or order an inspection

## Same-day scorecard
- Simple scoring table to compare this visit against other properties

Rules:
- Do not invent property facts, prices, legal rules, or statistics
- Do not give legal advice; suggest verifying paperwork with a professional
- Keep questions direct and printable for a single visit
- Keep a neutral, practical tone
- Adapt checks to apartment versus house`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'meeting-notes-summarizer'],
}
