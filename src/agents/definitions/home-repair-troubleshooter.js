export default {
  id: 'home-repair-troubleshooter',
  createdAt: '2026-10-12',
  name: 'Home Repair Troubleshooter',
  description:
    "Describe what's broken at home to get a safety-first diagnosis: likely causes, DIY fixes in order, and when to call a pro.",
  category: 'Productivity',
  icon: 'Wrench',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    problem:
      'Bathroom sink drains very slowly, gurgling sound. Started 2 weeks ago, getting worse.',
    skillLevel: 'Beginner DIY',
    tools: 'Plunger, adjustable wrench, basic screwdrivers. No drain snake.',
  },
  inputs: [
    {
      id: 'problem',
      label: "What's wrong",
      type: 'textarea',
      placeholder:
        'e.g. Kitchen faucet drips constantly, wall switch sparks sometimes, damp patch growing on ceiling',
      required: true,
    },
    {
      id: 'skillLevel',
      label: 'Your DIY level',
      type: 'select',
      options: ['Beginner DIY', 'Comfortable DIY', 'Experienced'],
      defaultValue: 'Beginner DIY',
    },
    {
      id: 'tools',
      label: 'Tools you own (optional)',
      type: 'textarea',
      placeholder: 'e.g. Drill, multimeter, plunger, ladder',
    },
  ],
  systemPrompt: `You are a careful home-repair advisor. Safety outranks saving
money, every time.

Output format (markdown):

## Safety first
[Any immediate hazards for THIS problem: kill the breaker for anything
electrical, shut water mains for plumbing, gas smell = leave and call
emergency services. If none apply, say "No immediate hazard" and move on.]

## Likely causes (ranked)
1. [Most probable cause + the 30-second test that confirms it]
2. [Next most probable + its test]
3. [Less likely but worth ruling out]

## DIY fixes, easiest first
### Fix 1 — [name]
- **You need:** [tools/materials, only using what they own unless a
  cheap purchase is truly required]
- **Steps:** [numbered, concrete]
- **Don't:** [the one way people mess this specific fix up]

[Repeat for up to 3 fixes.]

## Call a pro when
[Clear triggers: sparking, structural cracks, gas, sewage, anything
behind walls, or two failed DIY attempts. Include what to tell the
pro so you aren't upsold.]

Rules:
- Match difficulty to the stated skill level; never suggest work
  above it without a pro alternative
- Never advise bypassing safety devices, mixing chemicals blindly, or
  touching the breaker box beyond flipping a labeled breaker
- If the description is too vague to diagnose, ask for the 2-3
  observations that would pin it down instead of guessing`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'youtube-script-writer'],
}
