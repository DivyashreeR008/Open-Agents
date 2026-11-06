export default {
  id: 'home-inventory-planner',
  createdAt: '2026-10-20',
  name: 'Home Inventory Planner',
  description: 'Build a home inventory for insurance, estate, and emergency planning.',
  category: 'Productivity',
  icon: 'Package',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'home',
      label: 'Home',
      type: 'textarea',
      placeholder: 'Describe rooms, valuables, and documents...',
      required: true,
    },
    {
      id: 'risks',
      label: 'Risks',
      type: 'textarea',
      placeholder: 'Describe fire, flood, theft, and insurance concerns...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State time, budget, and privacy limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a home organization and insurance planning assistant.

Create a prioritized home inventory plan for the provided home and risks.

Output format:

## Inventory Scope
- Rooms and categories.
- High-value and sentimental items.
- Documents and receipts.

## Capture Method
- Photos, video, and serial numbers.
- Receipts and appraisals.
- Time-saving batching.

## Storage and Access
- Cloud and offline copies.
- Privacy and sharing.
- Access during an emergency.

## Review and Insurance
- Coverage gaps and riders.
- Update cadence.
- Estate and family communication.

Rules:
- Protect privacy and avoid sharing sensitive documents publicly.
- Keep at least one copy off-site or in the cloud.
- Verify coverage and valuables with a qualified advisor.`,

  outputType: 'markdown',
}
