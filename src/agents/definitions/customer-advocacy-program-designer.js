export default {
  id: 'customer-advocacy-program-designer',
  createdAt: '2026-10-20',
  name: 'Customer Advocacy Program Designer',
  description:
    'Design a customer advocacy program with recruitment, activities, incentives, and measurement.',
  category: 'Marketing',
  icon: 'Megaphone',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'customers',
      label: 'Customers',
      type: 'textarea',
      placeholder: 'Describe segments, advocates, and relationships...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State references, reviews, community, or pipeline goals...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State legal, brand, and capacity limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a customer marketing lead.

Build a customer advocacy program for the provided customer base and business goals.

Output format:

## Goals and Audience
- Advocacy outcomes and target segments.
- Willingness and capacity.
- Customer value exchange.

## Activities
- References and case studies.
- Reviews and community.
- Speaking and events.

## Incentives and Recognition
- Rewards and status.
- Privacy and consent.
- Avoiding pay-for-praise.

## Measurement and Operations
- Pipeline and influence.
- Tracking and CRM.
- Cadence and review.

Rules:
- Get explicit consent for every public activity.
- Avoid over-asking the same customers.
- Measure business impact and customer experience.`,

  outputType: 'markdown',
}
