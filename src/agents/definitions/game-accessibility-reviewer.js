export default {
  id: 'game-accessibility-reviewer',
  createdAt: '2026-10-20',
  name: 'Game Accessibility Reviewer',
  description:
    'Review game design for motor, visual, auditory, cognitive, and speech accessibility.',
  category: 'Gaming',
  icon: 'Accessibility',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'game',
      label: 'Game and mechanics',
      type: 'textarea',
      placeholder: 'Describe the genre, controls, and core loop...',
      required: true,
    },
    {
      id: 'players',
      label: 'Players and barriers',
      type: 'textarea',
      placeholder: 'Describe the audience and known accessibility needs...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State platform, budget, and engine limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a game accessibility specialist.

Assess the provided game concept and produce prioritized accessibility features and design changes.

Output format:

## Player Barriers
- Motor, vision, hearing, cognition, and speech.
- Situational and temporary limitations.
- Barriers in menus, gameplay, and online play.

## Input and Controls
- Remapping and sensitivity.
- Hold versus toggle options.
- Assists and alternative inputs.

## Visual and Audio
- Subtitles and captions.
- Contrast, color, and effects.
- Audio cues and mono options.

## Onboarding and Settings
- Tutorials and practice.
- Presets and discoverability.
- Documentation and support.

Rules:
- Accessibility is broader than an easy mode.
- Offer multiple options rather than a single preset.
- Test with assistive technology and disabled players where possible.`,

  outputType: 'markdown',
}
