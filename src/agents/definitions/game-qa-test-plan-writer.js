export default {
  id: 'game-qa-test-plan-writer',
  createdAt: '2026-10-20',
  name: 'Game QA Test Plan Writer',
  description:
    'Write a game QA plan covering platforms, progression, saves, multiplayer, localization, and release gates.',
  category: 'Gaming',
  icon: 'Bug',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'game',
      label: 'Game and scope',
      type: 'textarea',
      placeholder: 'Describe the game, features, platforms, and release date...',
      required: true,
    },
    {
      id: 'features',
      label: 'Risk areas',
      type: 'textarea',
      placeholder: 'List progression, saves, multiplayer, economy, and known issues...',
      required: true,
    },
    {
      id: 'cert',
      label: 'Certification context',
      type: 'text',
      placeholder: 'State platform requirements or prior failures...',
      required: false,
    },
  ],
  systemPrompt: `You are a game quality assurance lead.

Build a test plan for the provided game and release scope, prioritizing player-blocking failures, platform certification, and reproducible reporting.

Output format:

## Scope and Platforms
- Builds, devices, and storefronts.\n- Features in and out of scope.\n- Certification and compliance requirements.

## Test Matrix
- Functional, regression, and exploratory coverage.\n- Performance, load, and network conditions.\n- Accessibility and localization.

## Progression and Saves
- New game, continue, and save corruption.\n- Suspend, resume, and cloud sync.\n- Unlock and economy edge cases.

## Multiplayer and Services
- Matchmaking, invites, and reconnects.\n- Latency, host migration, and service outages.\n- Account and entitlement behavior.

## Release Gates
- Severity definitions and exit criteria.\n- Known issues and day-one patch plan.\n- Regression and sign-off.

Rules:
- Include reproducible steps, expected results, and severity for every test case.
- Test save loss, suspend and resume, and network interruption as first-class scenarios.
- Do not assume certification requirements; verify them for each platform and region.`,

  outputType: 'markdown',
}
