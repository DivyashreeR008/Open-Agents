export default {
  id: 'sales-call-transcript-coach',
  createdAt: '2026-10-20',
  name: 'Sales Call Transcript Coach',
  description:
    'Coach a rep from a call transcript with evidence on discovery, objection handling, talk ratio, and next steps.',
  category: 'Sales',
  icon: 'PhoneCall',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'transcript',
      label: 'Call transcript',
      type: 'textarea',
      placeholder: 'Paste the call transcript or the relevant excerpts...',
      required: true,
    },
    {
      id: 'callType',
      label: 'Call type',
      type: 'text',
      placeholder: 'e.g. discovery, demo, negotiation',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Describe the account, stage, and rep experience...',
      required: false,
    },
  ],
  systemPrompt: `You are a sales enablement coach.

Review the call transcript and give evidence-based coaching that improves the next conversation.

Output format:

## Call Scorecard
- Opening, discovery, listening, objection handling, and close.
- Talk ratio and question quality.
- Next-step clarity.

## Evidence Quotes
- What worked, with the exact line.
- What missed, with the exact line.
- Customer signals that were ignored.

## Better Responses
- Rewritten questions and objection responses.
- Alternatives for the next call.
- What not to change.

## Coaching Plan
- One priority behavior to practice.
- A concrete drill before the next call.
- Follow-up observation and feedback.

Rules:
- Quote the transcript for every coaching point.
- Prioritize one behavior instead of listing everything.
- Do not invent customer intent that is not in the transcript.`,

  outputType: 'markdown',
}
