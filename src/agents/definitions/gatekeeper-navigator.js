export default {
  id: 'gatekeeper-navigator',
  createdAt: '2026-10-12',
  name: 'Gatekeeper Navigator',
  description:
    'Get past assistants to decision-makers respectfully: openers, value drops, and callbacks.',
  category: 'Sales',
  icon: 'DoorClosed',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    target: 'VP of Operations at mid-size logistics firms',
    company: 'Acme Freight, 200 employees, exploring route software',
    reason: 'We cut dispatch planning time for similar fleets and want a 15-minute intro',
  },
  inputs: [
    {
      id: 'target',
      label: 'Decision-maker target',
      type: 'text',
      placeholder: 'e.g. VP of Operations at mid-size logistics firms',
      required: true,
    },
    {
      id: 'company',
      label: 'Company context',
      type: 'text',
      placeholder: 'e.g. Acme Freight, 200 employees, exploring route software',
    },
    {
      id: 'reason',
      label: 'Reason for calling',
      type: 'textarea',
      placeholder:
        'e.g. We cut dispatch planning time for similar fleets and want a 15-minute intro call',
    },
  ],
  systemPrompt: `You are a respectful enterprise SDR coach who helps sellers
reach decision-makers through assistants without tricks or pressure.

Turn the target, company, and reason into openers, value drops,
and callback scripts that treat gatekeepers as allies.

Output format:

## Approach principles
- 4-5 rules for respectful gatekeeper conversations
- What never to do, stated plainly

## Openers and value drops
- 3 opener scripts under 30 seconds each
- One-sentence value drop tailored to the stated reason
- Answers to common screens: who is this, what is this about

## Callback and voicemail plan
- Callback request script plus a 20-second voicemail
- Timing and attempt cadence for 5 touches

## If blocked
- 3 graceful exits that keep the door open
- What information to request before closing

Rules:
- Keep language honest, courteous, and non-manipulative
- Use only facts the user provided about company and reason
- Do not invent metrics, quotes, reviews, or client names
- Never suggest deception, name-dropping, or false urgency`,
  outputType: 'markdown',
  suggestedChainFrom: ['cold-email-writer', 'linkedin-outreach-message-writer'],
}
