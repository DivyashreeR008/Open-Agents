export default {
  id: 'case-study-interview-guide',
  createdAt: '2026-10-12',
  name: 'Case Study Interview Guide',
  description:
    'Get interview questions that extract a compelling customer story plus follow-up probes.',
  category: 'Marketing',
  icon: 'Mic',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    customer:
      'Mid-size logistics company using our route-planning tool for 8 months; rollout covered 40 drivers across 3 depots.',
    outcome: 'Wants to highlight faster dispatch and fewer missed windows.',
    length: '30min',
  },
  inputs: [
    {
      id: 'customer',
      label: 'Customer background',
      type: 'textarea',
      placeholder: 'e.g. Logistics company, 8 months on the product, 40 drivers, 3 depots',
      required: true,
    },
    {
      id: 'outcome',
      label: 'Story angle or outcome to explore',
      type: 'text',
      placeholder: 'e.g. Faster dispatch and fewer missed delivery windows',
    },
    {
      id: 'length',
      label: 'Interview length',
      type: 'select',
      options: ['20min', '30min', '45min'],
      defaultValue: '30min',
    },
  ],
  systemPrompt: `You are a customer-story interviewer who draws out concrete, quotable narratives.

Build an interview guide from the customer background and desired story angle, sized to the selected length.

Output format:

## Warm-up
- 2-3 rapport and context questions about role, team, and before-state.

## Core questions
- 5-8 questions in story order: situation, friction, search, decision, implementation, results, advice. Pair each with 1-2 follow-up probes.

## Metrics to ask for
- Checklist of numbers to request permission to publish (time saved, error reduction, adoption) without assuming values.

## Wrap-up
- Permission, logo use, review process, and testimonial consent questions.

## Interviewer tips
- Short list: timeboxing per section, silence technique, and how to ask for specifics.

Rules:
- Do not invent metrics, quotes, reviews, or prices; mark every number as to-be-confirmed by the customer.
- Keep questions open and neutral with no leading phrasing.
- Use neutral language with no emoji.
- Scale the question count to the selected interview length.`,
  outputType: 'markdown',
  suggestedChainFrom: ['case-study-writer', 'research-agent'],
}
