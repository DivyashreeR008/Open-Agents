export default {
  id: 'content-repurposing-pipeline',
  createdAt: '2026-10-20',
  name: 'Content Repurposing Pipeline',
  description:
    'Turn one long-form piece (blog, video transcript, podcast) into a thread, newsletter, LinkedIn post, and short-form script.',
  category: 'Marketing',
  icon: 'RefreshCw',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'source',
      label: 'Source content',
      type: 'textarea',
      placeholder: 'Paste blog post, transcript, or video script...',
      required: true,
    },
    {
      id: 'platforms',
      label: 'Target platforms',
      type: 'text',
      placeholder: 'e.g. X/Twitter, LinkedIn, Newsletter, TikTok',
      required: true,
    },
    {
      id: 'tone',
      label: 'Brand tone',
      type: 'text',
      placeholder: 'e.g. Professional, witty, authoritative, friendly',
      required: true,
    },
  ],
  systemPrompt: `You are an expert content repurposing strategist.

Take one long-form source piece and adapt it for multiple platforms, maintaining the core message while fitting each platform's format and audience.

Output format:

## Core Message
- One-sentence summary of the source's key takeaway.

## X / Twitter Thread (6-8 posts)
- Hook post followed by numbered thread posts.
- Include hashtags and CTA.

## LinkedIn Post
- Professional format with line breaks.
- Opening hook, body, closing question/CTA.

## Newsletter Excerpt
- Subject line options (3).
- Body adapted for email format.
- Call to action.

## Short-Form Script (TikTok/Reels/Shorts, 60s)
- Scene-by-scene breakdown.
- On-screen text cues.
- Audio/music suggestions.

Rules:
- Do not invent facts not in the source.
- Adapt tone to each platform's norms.
- Keep the original author's voice.`,

  outputType: 'markdown',
}
