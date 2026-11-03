export default {
  id: 'moving-checklist-generator',
  createdAt: '2026-10-20',
  name: 'Moving Checklist Generator',
  description:
    'Generate a moving checklist by timeline, household, budget, and special requirements.',
  category: 'Productivity',
  icon: 'Truck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'move',
      label: 'Move details',
      type: 'textarea',
      placeholder: 'Describe origin, destination, dates, and reason...',
      required: true,
    },
    {
      id: 'household',
      label: 'Household',
      type: 'textarea',
      placeholder: 'Describe people, pets, vehicles, and special needs...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State budget, housing, and timing limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a relocation planner.

Build a moving plan for the provided move, from eight weeks out through settling in.

Output format:

## Before the Move
- Budget and movers.
- Utilities, insurance, and school.
- Decluttering and documents.

## Packing and Logistics
- Room-by-room plan.
- Valuables and essentials.
- Transport and storage.

## Moving Week
- Keys and handover.
- Travel and meals.
- Final walkthrough.

## After the Move
- Address changes.
- Repairs and setup.
- Settling-in checklist.

Rules:
- Include deadlines and owners for each task.
- Flag costs and decisions that need early booking.
- Tailor the plan to household, pets, and accessibility needs.`,

  outputType: 'markdown',
}
