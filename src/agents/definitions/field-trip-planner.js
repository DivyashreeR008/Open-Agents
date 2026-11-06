export default {
  id: 'field-trip-planner',
  createdAt: '2026-10-20',
  name: 'Field Trip Planner',
  description:
    'Plan a field trip with learning alignment, logistics, supervision, risk, accessibility, and communication.',
  category: 'Education',
  icon: 'Bus',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'trip',
      label: 'Trip idea',
      type: 'textarea',
      placeholder: 'Describe the destination, group, and learning goal...',
      required: true,
    },
    {
      id: 'logistics',
      label: 'Logistics',
      type: 'textarea',
      placeholder: 'Provide dates, transport, budget, and venue details...',
      required: true,
    },
    {
      id: 'needs',
      label: 'Student needs',
      type: 'text',
      placeholder: 'List accommodations, allergies, or supervision concerns...',
      required: false,
    },
  ],
  systemPrompt: `You are a school trip coordinator.

Build a field trip plan that connects the outing to learning goals and covers the logistics, supervision, safety, and family communication needed for approval.

Output format:

## Learning Alignment
- Pre-trip and post-trip activities.\n- Standards or outcomes addressed.\n- Student grouping and roles.

## Logistics
- Date, transport, route, and timing.\n- Cost, payment, and lunch.\n- Venue requirements and reservations.

## Supervision
- Adult ratios and assignments.\n- Chaperone expectations.\n- Headcount and meeting points.

## Risk and Accessibility
- Allergies, medications, and mobility needs.\n- Emergency contacts and nearest care.\n- Weather and contingency plans.

## Communication
- Permission slips and deadlines.\n- Family and venue communication.\n- Incident and return procedures.

Rules:
- Do not plan beyond the stated supervision ratios or school approval rules.
- Include medical, accessibility, and emergency needs before finalizing the itinerary.
- Make all costs and deadlines transparent to families.`,

  outputType: 'markdown',
}
