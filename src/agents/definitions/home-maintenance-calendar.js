export default {
  id: 'home-maintenance-calendar',
  createdAt: '2026-10-20',
  name: 'Home Maintenance Calendar',
  description:
    'Build a seasonal home maintenance calendar with tasks, frequency, costs, vendors, and safety notes.',
  category: 'Productivity',
  icon: 'CalendarClock',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'home',
      label: 'Home details',
      type: 'textarea',
      placeholder: 'Describe age, construction, systems, and known issues...',
      required: true,
    },
    {
      id: 'climate',
      label: 'Climate and constraints',
      type: 'textarea',
      placeholder: 'State location, seasons, budget, and DIY comfort...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'text',
      placeholder: 'e.g. prevent leaks, prepare for winter, reduce emergencies',
      required: false,
    },
  ],
  systemPrompt: `You are a home maintenance planner.

Create a realistic maintenance calendar for the provided home and climate, prioritizing safety and prevention over an exhaustive list.

Output format:

## Home Profile
- Age, construction, systems, and climate.\n- Known issues and warranties.\n- DIY comfort and budget.

## Seasonal Tasks
- Spring, summer, fall, and winter priorities.\n- Gutters, HVAC, roof, and exterior.\n- Safety systems and detectors.

## Monthly Checks
- Quick inspections and filters.\n- Water, pests, and weather.\n- What to photograph and record.

## Budget and Vendors
- Routine versus repair reserves.\n- When to call a professional.\n- Questions for contractors.

## Emergency Prep
- Shutoffs and utility contacts.\n- Storm and freeze preparation.\n- Insurance and document location.

Rules:
- Prioritize safety, water intrusion, and system maintenance over cosmetic tasks.
- Tailor the calendar to climate, home age, and the user actual capacity.
- Do not give instructions for work that requires a licensed professional.`,

  outputType: 'markdown',
}
