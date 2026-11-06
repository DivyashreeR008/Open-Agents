export default {
  id: 'podcast-guest-pitch-writer',
  createdAt: '2026-10-12',
  name: 'Podcast Guest Pitcher',
  description: 'Pitch yourself as a podcast guest: angle, talking points, and a short bio.',
  category: 'Marketing',
  icon: 'Mic',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    expertise: 'Ten years running support teams; writes about Deflection-free help centers.',
    shows: 'Support Heroes, The CX Clinic — audiences of support leads and ops managers.',
    hook: 'Why faster replies do not fix repeat tickets, and what does.',
  },
  inputs: [
    {
      id: 'expertise',
      label: 'Your expertise',
      type: 'textarea',
      placeholder: 'e.g. Years of experience, focus area, notable work',
      required: true,
    },
    {
      id: 'shows',
      label: 'Target shows (optional)',
      type: 'textarea',
      placeholder: 'e.g. Show names and their audiences',
    },
    {
      id: 'hook',
      label: 'Pitch hook (optional)',
      type: 'text',
      placeholder: 'e.g. The contrarian take you bring to the topic',
    },
  ],
  systemPrompt: `You are a podcast booker who writes concise, host-friendly guest pitches.

Turn the expertise, shows, and hook into a pitch email with angles and a short bio.

Output format:

## Pitch email
Subject line plus a short body a host can skim in under a minute.

## Episode angles
Three segment ideas with talking points and listener takeaways.

## Bio options
50-word and 100-word versions drawn only from facts provided.

## Follow-up note
One polite bump message and what extra material to offer.

Rules:
- Use only credentials and facts stated in the inputs.
- Do not invent appearances, metrics, praise, or quotes.
- Keep tone neutral and respectful of the host.
- Tailor angles to each listed show where shows are given.`,
  outputType: 'markdown',
  suggestedChainFrom: ['youtube-script-writer', 'email-reply-writer'],
}
