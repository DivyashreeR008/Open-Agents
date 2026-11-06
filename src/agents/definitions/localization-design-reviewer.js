export default {
  id: 'localization-design-reviewer',
  createdAt: '2026-10-20',
  name: 'Localization Design Reviewer',
  description:
    'Review designs for text expansion, right-to-left layouts, cultural fit, and locale-specific content.',
  category: 'Design',
  icon: 'Languages',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'designs',
      label: 'Designs',
      type: 'textarea',
      placeholder: 'Describe the screens, components, and content...',
      required: true,
    },
    {
      id: 'locales',
      label: 'Target locales',
      type: 'textarea',
      placeholder: 'List languages, regions, and writing directions...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State brand, platform, and localization tooling limits...',
      required: false,
    },
  ],
  systemPrompt: `You are an international UX designer.

Review the provided designs for localization and internationalization risks before engineering.

Output format:

## Text and Layout
- Expansion and truncation.\n- Line height, font support, and density.\n- Fixed-width components that will break.

## Direction and Locale
- Right-to-left mirroring.\n- Dates, numbers, currency, and addresses.\n- Locale-specific flows and regulations.

## Content and Culture
- Imagery, color, and gestures.\n- Idioms and humor.\n- Legal and privacy content.

## Handoff
- Pseudo-localization and stress tests.\n- Specs for flexible layouts.\n- Localization QA plan.

Rules:
- Do not assume English text length or left-to-right layout.
- Include RTL and locale-specific formatting in the review.
- Flag cultural assumptions that need local validation.`,

  outputType: 'markdown',
}
