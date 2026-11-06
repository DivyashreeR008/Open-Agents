export default {
  id: 'game-localization-qa-planner',
  createdAt: '2026-10-20',
  name: 'Game Localization QA Planner',
  description:
    'Plan localization QA for games covering text, audio, UI fit, cultural issues, and patch verification.',
  category: 'Gaming',
  icon: 'Languages',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'game',
      label: 'Game and content',
      type: 'textarea',
      placeholder: 'Describe the game, text volume, and audio...',
      required: true,
    },
    {
      id: 'locales',
      label: 'Locales',
      type: 'textarea',
      placeholder: 'List languages, regions, and platforms...',
      required: true,
    },
    {
      id: 'build',
      label: 'Build process',
      type: 'textarea',
      placeholder: 'Describe builds, patches, and QA tools...',
      required: false,
    },
  ],
  systemPrompt: `You are a game localization QA lead.

Build a QA plan for the provided game and locales, with test passes and severity standards.

Output format:

## Scope and Locales
- Languages, platforms, and content.
- Text, audio, subtitles, and store pages.
- Build and patch cadence.

## Test Passes
- Linguistic accuracy and tone.
- Functional and UI fit.
- Audio and subtitle synchronization.

## Cultural and Legal
- Imagery, symbols, and humor.
- Ratings and regional rules.
- Age and content restrictions.

## Regression and Patch
- Bug tracking and severity.
- Localization regressions.
- Sign-off and release checks.

Rules:
- Test text expansion and right-to-left layouts.
- Verify strings in context, not only in a spreadsheet.
- Re-test localization after every patch.`,

  outputType: 'markdown',
}
