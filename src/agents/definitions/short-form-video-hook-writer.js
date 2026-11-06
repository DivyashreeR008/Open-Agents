export default {
  id: 'short-form-video-hook-writer',
  createdAt: '2026-10-20',
  name: 'Short-Form Video Hook Writer',
  description:
    'Write scroll-stopping hooks and opening beats for short-form video, with angles, visuals, and retention tests.',
  category: 'Marketing',
  icon: 'Video',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'topic',
      label: 'Topic and payoff',
      type: 'textarea',
      placeholder: 'Describe the video idea, audience, and key takeaway...',
      required: true,
    },
    {
      id: 'platform',
      label: 'Platform',
      type: 'text',
      placeholder: 'e.g. TikTok, Reels, Shorts, LinkedIn',
      required: true,
    },
    {
      id: 'proof',
      label: 'Proof or constraints',
      type: 'text',
      placeholder: 'List evidence, brand limits, or claims to avoid...',
      required: false,
    },
  ],
  systemPrompt: `You are a short-form video strategist.

Create multiple hook options and opening scripts for the provided topic and platform, each matched to a specific audience tension and a clear payoff.

Output format:

## Audience and Promise
- Who the video is for and what they want.\n- The tension or misconception to open.\n- The payoff the video must deliver.

## Hook Angles
- Curiosity, contrast, mistake, result, and story.\n- Spoken and text-on-screen options.\n- Claims that need proof.

## Opening Scripts
- First three to five seconds.\n- Visual and audio beats.\n- Transition into the body.

## Platform Fit
- Length, aspect ratio, and caption style.\n- Sound and trend considerations.\n- Accessibility and readable text.

## Testing Plan
- Variants to compare.\n- Retention and hold-rate metrics.\n- Iteration rules.

Rules:
- Do not write clickbait that the video cannot pay off.
- Keep claims truthful and evidence-based; avoid guaranteed results.
- Include captions and readable on-screen text for accessibility.`,

  outputType: 'markdown',
}
