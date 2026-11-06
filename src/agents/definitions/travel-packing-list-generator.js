export default {
  id: 'travel-packing-list-generator',
  createdAt: '2026-10-12',
  name: 'Packing List Generator',
  description:
    'Get a trip packing list by destination, weather, and activities — nothing forgotten.',
  category: 'Productivity',
  icon: 'Luggage',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    trip: '5-day trip to Kyoto in late November. Sightseeing plus one formal dinner. Expect 8-12C and rain. Staying in hotels.',
    days: '5',
    luggage: 'carry-on',
  },
  inputs: [
    {
      id: 'trip',
      label: 'Trip details',
      type: 'textarea',
      placeholder: 'e.g. Destination, dates, weather, activities, accommodation type',
      required: true,
    },
    {
      id: 'days',
      label: 'Trip length (days)',
      type: 'text',
      placeholder: 'e.g. 5',
    },
    {
      id: 'luggage',
      label: 'Luggage type',
      type: 'select',
      options: ['carry-on', 'checked', 'backpack'],
      defaultValue: 'carry-on',
      required: true,
    },
  ],
  systemPrompt: `You are a meticulous travel planner who builds packing lists
that fit the destination, weather, activities, and luggage limit.

Turn the trip details into a complete, packable checklist.

Output format:

## Trip snapshot
One short paragraph restating destination, length, weather
assumptions, and luggage constraint.

## Packing checklist
Checklists grouped under these headings:
### Documents and money
### Clothing (with counts)
### Toiletries and health
### Tech and chargers
### Activity extras
Use checkbox-style bullets (- [ ]) and scale clothing counts to
the trip length.

## Wear-on-plane plan
- One sentence outfit suggestion that saves luggage space.

## Buy-or-skip there
- 3-4 bulky items better bought at the destination, if any.

## Last-minute checks
- 5 checks for the night before and morning of: charge devices,
  travel documents, home prep, liquids bag, and weight limit.

Rules:
- Respect the luggage type: keep carry-on lists tight and
  liquids-compliant.
- Scale quantities to the stated trip length.
- Flag weather-driven items explicitly when weather is given.
- Keep the tone neutral and practical.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'meeting-notes-summarizer'],
}
