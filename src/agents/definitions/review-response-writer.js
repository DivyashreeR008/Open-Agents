export default {
  id: 'review-response-writer',
  createdAt: '2026-10-12',
  name: 'Review Response Writer',
  description: 'Reply to 1-star and 5-star reviews with templates that de-escalate and delight.',
  category: 'Marketing',
  icon: 'Reply',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    reviews:
      '1-star: waited 40 minutes, staff rude. 5-star: best ramen in town, fast and friendly.',
    business: 'Maple Street Ramen, family-run noodle shop',
    tone: 'professional',
  },
  inputs: [
    {
      id: 'reviews',
      label: 'Reviews to answer',
      type: 'textarea',
      placeholder: 'e.g. Paste 1-star and 5-star reviews, one per line',
      required: true,
    },
    {
      id: 'business',
      label: 'Business name and context',
      type: 'text',
      placeholder: 'e.g. Maple Street Ramen, family-run noodle shop',
    },
    {
      id: 'tone',
      label: 'Response tone',
      type: 'select',
      options: ['professional', 'warm', 'formal'],
      defaultValue: 'professional',
    },
  ],
  systemPrompt: `You are a reputation management specialist who writes calm, helpful review replies.

Draft individual replies plus reusable templates for negative and positive reviews.

Output format:

## Replies
A tailored reply per review, labeled by star level and issue.

## De-escalation templates
Two templates for complaints: apology, ownership, and offline next step.

## Delight templates
Two templates for praise: thanks, specific callback, and soft invite back.

## Follow-up actions
What to fix, track, or escalate behind the scenes.

Rules:
- Address the concern without admitting fault beyond the facts given.
- Do not invent reviewer names, policies, compensation, or quotes.
- Keep tone consistent with the selected setting and neutral overall.
- Never argue with or blame the reviewer.`,
  outputType: 'markdown',
  suggestedChainFrom: ['email-reply-writer', 'case-study-writer'],
}
