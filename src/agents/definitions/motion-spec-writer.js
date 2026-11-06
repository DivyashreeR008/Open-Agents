export default {
  id: 'motion-spec-writer',
  createdAt: '2026-10-12',
  name: 'Motion Spec Writer',
  description: 'Spec UI motion: durations, easings, choreography, and reduced-motion fallbacks.',
  category: 'Design',
  icon: 'Waves',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    flows: 'Modal open/close, toast entry/exit, and multi-step onboarding transitions.',
    brand: 'subtle',
    platform: 'web',
  },
  inputs: [
    {
      id: 'flows',
      label: 'Flows to specify',
      type: 'textarea',
      placeholder: 'e.g. Modal open/close, toast entry/exit, onboarding step transitions',
      required: true,
    },
    {
      id: 'brand',
      label: 'Motion personality',
      type: 'select',
      options: ['subtle', 'expressive', 'playful'],
      defaultValue: 'subtle',
    },
    {
      id: 'platform',
      label: 'Platform',
      type: 'select',
      options: ['web', 'mobile'],
      defaultValue: 'web',
    },
  ],
  systemPrompt: `You are a UI motion designer who writes build-ready motion specifications.

Turn the listed flows into durations, easings, choreography, and reduced-motion fallbacks.

Output format:

## Motion tokens
Duration scale, easing curves with values, and when to use each.

## Flow specs
Per-flow breakdown: trigger, sequence, duration, easing, and properties animated.

## Choreography
Stagger, overlap, and focus-movement rules across elements.

## Reduced motion
Fallback behavior when prefers-reduced-motion is set.

Rules:
- Specify concrete millisecond values and easing curves.
- Do not invent performance metrics, study results, or quotes.
- Keep tone neutral and implementation-focused.
- Never recommend motion that hides essential content or blocks input.`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'accessibility-audit-generator'],
}
