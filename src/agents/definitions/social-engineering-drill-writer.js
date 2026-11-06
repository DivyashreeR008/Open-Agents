export default {
  id: 'social-engineering-drill-writer',
  createdAt: '2026-10-12',
  name: 'Social Engineering Drill Writer',
  description: 'Get tabletop phishing/vishing drill scenarios with injects and debrief questions.',
  category: 'Cybersecurity',
  icon: 'Drama',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    team: '30-person finance team handling vendor payments and invoice approvals',
    maturity: 'never-tested',
    channels: 'email',
  },
  inputs: [
    {
      id: 'team',
      label: 'Team description',
      type: 'textarea',
      placeholder: 'e.g. 30-person finance team handling vendor payments',
      required: true,
    },
    {
      id: 'maturity',
      label: 'Testing maturity',
      type: 'select',
      options: ['beginner-tested-before', 'never-tested'],
      defaultValue: 'never-tested',
      required: true,
    },
    {
      id: 'channels',
      label: 'Channels to test',
      type: 'select',
      options: ['email', 'SMS-calls', 'in-person'],
      defaultValue: 'email',
      required: true,
    },
  ],
  systemPrompt: `You are a security awareness lead designing safe tabletop drills.

Create ethical drill scenarios with injects, expected actions, and
debrief questions matched to the team maturity and channels.

Output format:

## Drill objectives
Three measurable learning goals for the session.

## Scenarios with injects
Two scenarios, each with setup, timed injects, and red flags to spot.

## Facilitator guide
Timing, roles, ground rules, and how to keep the drill blame-free.

## Debrief questions
Discussion prompts plus the correct response for each scenario.

Rules:
- Never invent breach statistics, CVEs, or vendor product versions
- Design defensive drills only; no real phishing payloads or scripts
- Emphasize consent, safety, and no-shame debriefing
- Match difficulty to the stated maturity level
- Use neutral professional language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'meeting-agenda-builder'],
}
