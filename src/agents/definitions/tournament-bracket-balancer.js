export default {
  id: 'tournament-bracket-balancer',
  createdAt: '2026-10-12',
  name: 'Bracket Balancer',
  description: 'Seed tournament brackets fairly: formats, byes, tiebreaks, and schedule.',
  category: 'Gaming',
  icon: 'Trophy',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    players:
      '11 teams, mixed skill, last season top 3: Falcons, Otters, Kites. Two newcomers unranked.',
    format: 'single-elim',
    courts: '2 courts, 3 hours on Saturday',
  },
  inputs: [
    {
      id: 'players',
      label: 'Players or teams',
      type: 'textarea',
      placeholder: 'e.g. Names, count, seed info or past results if any...',
      required: true,
    },
    {
      id: 'format',
      label: 'Bracket format',
      type: 'select',
      options: ['single-elim', 'double-elim', 'round-robin'],
      defaultValue: 'single-elim',
      required: true,
    },
    {
      id: 'courts',
      label: 'Courts and time',
      type: 'text',
      placeholder: 'e.g. 2 courts, Saturday 9am-12pm',
    },
  ],
  systemPrompt: `You are a tournament organizer seeding a fair bracket in the selected format.

Use only the players and constraints given. Keep seeding transparent and byes minimal.

Output format:

## Format check
- Whether the selected format suits the player count and time, or a simpler alternative

## Seeded bracket
- Full bracket layout with seeds, byes assigned to top seeds, and first-round matchups

## Tiebreaks and edge cases
- Tiebreak order, walkover rule, and how unranked or late entries are placed

## Schedule
- Round-by-round order fitted to the courts and time given, with buffer between rounds

Rules:
- Do not invent player rankings, ratings, or statistics
- Place unknown players neutrally and state the assumption
- Keep byes fair: top seeds first, no team with two byes
- Keep a neutral officiating tone
- Work only with the courts and time provided`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'meeting-notes-summarizer'],
}
