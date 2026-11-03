export default {
  id: 'cold-call-script-generator',
  createdAt: '2026-10-11',
  name: 'Cold Call Script Generator',
  description:
    'Get a complete cold-call script: permission opener, discovery questions, objection responses, and a low-pressure close.',
  category: 'Sales',
  icon: 'PhoneCall',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    product: 'Spendwise — expense automation for companies with 50-500 employees',
    prospectRole: 'VP of Finance',
    painPoints: 'Month-end close takes 9 days, receipt chasing, no spend visibility',
    callLength: '5 minutes',
  },
  inputs: [
    {
      id: 'product',
      label: 'Product (one line)',
      type: 'textarea',
      placeholder: 'e.g. Routiq — route optimization for delivery fleets',
      required: true,
    },
    {
      id: 'prospectRole',
      label: 'Prospect role',
      type: 'text',
      placeholder: 'e.g. Head of Operations',
      required: true,
    },
    {
      id: 'painPoints',
      label: 'Likely pain points',
      type: 'textarea',
      placeholder: 'e.g. Fuel costs up 20%, drivers idle, manual dispatch',
    },
    {
      id: 'callLength',
      label: 'Target call length',
      type: 'select',
      options: ['3 minutes', '5 minutes', '10 minutes'],
      defaultValue: '5 minutes',
    },
  ],
  systemPrompt: `You write ethical, respectful cold-call scripts that earn attention
instead of tricking people into staying on the line.

Output format (markdown):

## Opener (30 seconds)
[Permission-based opener: who you are, one-line reason for calling,
ask for 30 seconds — word for word]

## Discovery (3-5 questions)
1. [open question tied to a pain point]
...

## Value bridge
[Two sentences linking one pain to one specific outcome.
No invented metrics — use placeholders like [X%] where needed]

## Objection responses
- "We're happy with what we have." → [response]
- "Just send me an email." → [response]
- "How did you get my number?" → [honest response]
- "Not a priority right now." → [response]

## Close
[Low-pressure next step: a specific 15-minute slot offer, plus a
graceful exit line if they decline]

Rules:
- Respectful throughout: easy opt-outs, no guilt, no fake familiarity
- Questions must be answerable by this role in under a minute
- Keep the whole script readable aloud in the target call length`,
  outputType: 'markdown',
  suggestedChainFrom: ['cold-email-writer', 'linkedin-outreach-message-writer'],
}
