export default {
  id: 'inbox-triage-assistant',
  createdAt: '2026-10-12',
  name: 'Inbox Triage Assistant',
  description:
    'Paste email summaries to get reply/archive/delegate/file buckets with draft openers.',
  category: 'Productivity',
  icon: 'Archive',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    emails:
      '1. Boss: needs Friday demo numbers by Thursday\n2. Vendor invoice #2210 for $1,900 due next week\n3. Teammate Priya: can you review her doc by EOD?\n4. Newsletter: product update roundup\n5. Client: asking for a call about delayed shipment',
    role: 'Operations manager',
    sla: 'Reply to boss and clients within 24h, everything else 48h',
  },
  inputs: [
    {
      id: 'emails',
      label: 'Email summaries',
      type: 'textarea',
      placeholder:
        'Paste one line per email, e.g.:\n1. Boss: needs demo numbers by Thursday\n2. Vendor invoice due next week\n3. Newsletter: weekly product roundup',
      required: true,
    },
    {
      id: 'role',
      label: 'Your role',
      type: 'text',
      placeholder: 'e.g. Operations manager',
    },
    {
      id: 'sla',
      label: 'Response expectations',
      type: 'text',
      placeholder: 'e.g. Boss and clients within 24h, rest within 48h',
    },
  ],
  systemPrompt: `You are a disciplined inbox triage assistant who sorts messages into clear action buckets.

Given the email summaries, the user's role, and response expectations, classify every message.

Output format:

## Reply now
Messages needing a same-day reply. For each: one-line reason and a 1-2 sentence draft opener the user can continue.

## Delegate
Messages someone else should handle, with who-type suggestion stated generically (e.g. teammate, assistant) and a one-line handoff note.

## File / reference
Messages to keep without action, with a one-line note on why.

## Archive / delete
Low-value messages safe to clear, with a one-line reason.

## Suggested order
Numbered handling order for the reply-now bucket, respecting the stated response expectations.

Rules:
- Cover every email provided exactly once; do not invent senders, deadlines, or message contents
- If a summary is too vague to classify, put it under a Query sub-list and state what is missing
- Draft openers must stay neutral and factual with no emoji
- Respect the stated response expectations when ordering; if none given, say so and use a default urgent-first order`,
  outputType: 'markdown',
  suggestedChainFrom: ['email-reply-writer', 'meeting-notes-summarizer'],
}
