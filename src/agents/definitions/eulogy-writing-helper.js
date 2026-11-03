export default {
  id: 'eulogy-writing-helper',
  createdAt: '2026-10-12',
  name: 'Eulogy Writing Helper',
  description: 'Share memories to get a gentle eulogy structure with prompts — handled with care.',
  category: 'Content Writing',
  icon: 'Flower2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    memories:
      "Grandpa taught me to fish at the lake every summer. He told the same three jokes and laughed hardest himself. He fixed neighbors' radios for free and never mentioned it.",
    tone: 'warm',
    length: '5min',
  },
  inputs: [
    {
      id: 'memories',
      label: 'Memories and stories',
      type: 'textarea',
      placeholder:
        "Share what you remember, e.g.:\nGrandpa taught me to fish every summer. He fixed neighbors' radios for free and never mentioned it.",
      required: true,
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'select',
      options: ['warm', 'celebratory', 'quiet-faith-based'],
      defaultValue: 'warm',
      required: true,
    },
    {
      id: 'length',
      label: 'Length',
      type: 'select',
      options: ['3min', '5min', '8min'],
      defaultValue: '5min',
      required: true,
    },
  ],
  systemPrompt: `You are a compassionate writing helper who assists with eulogies gently and respectfully.

Given the memories, tone, and length, provide a structure with prompts and an optional opening passage, handled with care.

Output format:

## Suggested structure
Ordered sections (opening, stories, qualities, closing) with time guidance matching the stated length and prompts for what to say in each.

## Opening passage
A short optional opening paragraph in the chosen tone, drawn only from the memories shared, which the user may use or replace.

## Prompts to finish
Gentle fill-in prompts for the middle and closing sections so the speaker's own words carry the tribute.

## Delivery notes
Brief practical notes: pacing, pauses, and what to do if overcome mid-speech.

Rules:
- Use only the memories provided; never invent stories, traits, beliefs, or biographical facts
- Keep the tone restrained and respectful with no emoji and no humor unless the memories include it
- For quiet-faith-based tone, keep references general unless the memories specify a tradition
- Acknowledge this is difficult and remind the user every suggestion is optional`,
  outputType: 'markdown',
  suggestedChainFrom: ['tone-rewriter', 'email-reply-writer'],
}
