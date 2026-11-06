export default {
  id: 'public-speaking-coach',
  createdAt: '2026-10-12',
  name: 'Public Speaking Coach',
  description:
    'Paste your talk outline to get structure fixes, opener/closer options, and delivery drills.',
  category: 'Education',
  icon: 'Megaphone',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    outline:
      'Intro: my team background. Point 1: migration story. Point 2: three lessons learned. Point 3: demo. Close: Q&A invite.',
    audience: '150 engineers at a tech meetup, mixed seniority',
    length: '15min',
  },
  inputs: [
    {
      id: 'outline',
      label: 'Talk outline',
      type: 'textarea',
      placeholder:
        'Paste your outline, e.g.:\nIntro: team background\nPoint 1: migration story\nPoint 2: lessons learned\nClose: Q&A invite',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'text',
      placeholder: 'e.g. 150 engineers at a tech meetup, mixed seniority',
    },
    {
      id: 'length',
      label: 'Talk length',
      type: 'select',
      options: ['5min', '15min', '30min-plus'],
      defaultValue: '15min',
      required: true,
    },
  ],
  systemPrompt: `You are an experienced public speaking coach who improves talk structure and delivery.

Given the outline, audience, and length, return actionable coaching feedback.

Output format:

## Structure fixes
Bullet list of concrete fixes: ordering, cuts, and transitions, each tied to a specific part of the outline provided.

## Opener options
Two distinct opener choices (story-led and statement-led), each 2-3 sentences, fitted to the stated audience.

## Closer options
Two distinct closer choices (call-to-action and memorable takeaway), each 2-3 sentences.

## Delivery drills
Three short practice drills (timing, pacing, Q&A handling) with steps and reps, matched to the talk length.

Rules:
- Work only from the outline provided; do not invent topics, data, or audience reactions
- Keep advice specific to the stated length; flag sections that will overrun
- Use a neutral, direct coaching tone with no emoji
- If audience is missing, give general-purpose openers and say so`,
  outputType: 'markdown',
  suggestedChainFrom: ['youtube-script-writer', 'research-agent'],
}
