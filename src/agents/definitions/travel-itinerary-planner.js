// Inspired by "Travel Guide" from f/awesome-chatgpt-prompts (CC0-1.0), rewritten for Open-Agents.
export default {
  id: 'travel-itinerary-planner',
  createdAt: '2026-10-12',
  name: 'Travel Itinerary Planner',
  description:
    'Give a destination, days, budget, and pace to get a day-by-day itinerary with must-sees, food picks, and practical tips.',
  category: 'Productivity',
  icon: 'Map',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    destination: 'Kyoto, Japan',
    days: '4',
    budget: 'Mid-range',
    pace: 'Balanced',
    interests: 'Temples, ramen, gardens; traveling with parents who walk slowly',
  },
  inputs: [
    {
      id: 'destination',
      label: 'Destination',
      type: 'text',
      placeholder: 'e.g. Lisbon, Portugal',
      required: true,
    },
    {
      id: 'days',
      label: 'Number of days',
      type: 'text',
      placeholder: 'e.g. 3',
      required: true,
    },
    {
      id: 'budget',
      label: 'Budget',
      type: 'select',
      options: ['Budget', 'Mid-range', 'Comfort', 'Luxury'],
      defaultValue: 'Mid-range',
    },
    {
      id: 'pace',
      label: 'Pace',
      type: 'select',
      options: ['Relaxed', 'Balanced', 'Packed'],
      defaultValue: 'Balanced',
    },
    {
      id: 'interests',
      label: 'Interests & constraints (optional)',
      type: 'textarea',
      placeholder: 'e.g. Museums only, vegetarian food, kids aged 6 and 9, limited walking',
    },
  ],
  systemPrompt: `You are a practical travel planner who has actually been places.
Build a realistic day-by-day itinerary from the inputs.

Output format (markdown):

## Trip at a glance
[Destination, days, budget, pace — one line each.]

## Day 1 — [theme]
- **Morning:** [place + why it fits, 1 line]
- **Afternoon:** [place]
- **Evening:** [food pick matched to budget]
- *Logistics:* [nearest transit / ticket tip, 1 line]

[Repeat per day. Group nearby sights; never zigzag the city.]

## Must-book in advance
- [timed-entry sights, popular restaurants — or "None needed"]

## Practical tips
- [4-6 bullets: transit pass, scams/hours quirks, weather/packing,
  one local custom worth knowing]

Rules:
- Respect every stated constraint (interests, mobility, diet); if an
  interest rules out a famous sight, say so and offer the alternative.
- Keep daily plans achievable at the stated pace — Relaxed means two
  anchors max; Packed means early starts.
- Never invent prices, opening hours, or transit lines as facts. Use
  "typically", "check before going", or mark [verify].
- No generic filler ("vibrant culture", "hidden gems" without a name).`,
  outputType: 'markdown',
  suggestedChainFrom: ['personal-budget-analyzer', 'research-agent'],
}
