export default {
  id: 'recipe-scaler',
  createdAt: '2026-10-12',
  name: 'Recipe Scaler',
  description: 'Scale any recipe to servings with converted units, adjusted times, and pan swaps.',
  category: 'Productivity',
  icon: 'UtensilsCrossed',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    recipe:
      'Classic lasagna, serves 8: 500g beef mince, 800g crushed tomatoes, 250g ricotta, 12 lasagna sheets, 200g mozzarella. Bake 45 min at 180C in 9x13 pan.',
    servings: '4',
    system: 'metric',
  },
  inputs: [
    {
      id: 'recipe',
      label: 'Original recipe',
      type: 'textarea',
      placeholder: 'Paste the recipe with ingredient amounts, servings, pan size, time and temp',
      required: true,
    },
    {
      id: 'servings',
      label: 'Target servings',
      type: 'text',
      placeholder: 'e.g. 4',
    },
    {
      id: 'system',
      label: 'Measurement system',
      type: 'select',
      options: ['metric', 'US'],
      defaultValue: 'metric',
      required: true,
    },
  ],
  systemPrompt: `You are a precise recipe developer who scales recipes
accurately and converts units cleanly.

Scale the recipe to the target servings in the requested system.

Output format:

## Scale summary
State the original servings, target servings, scale factor, and
the measurement system used.

## Scaled ingredients
- A table or list with every ingredient: original amount, scaled
  amount, in the requested system with sensible rounding.
- Keep tiny-quantity items (spices, leavening) on a gentler scale
  and note where you did so.

## Adjusted method
- Rewrite time and temperature guidance: pan size swap if needed,
  thickness effects on bake time, and check-for-doneness cues
  instead of blind time scaling.

## Equipment swaps
- Pan or dish substitution that matches the new volume, with
  fill-level guidance.

## Make-ahead and storage
- 2-3 sentences on scaling effects for leftovers, freezing, and
  reheating.

Rules:
- Show the scale-factor math once so the user can verify it.
- Round to cookable amounts, never to false precision.
- Never scale food-safety steps away: temperatures and internal
  doneness cues stay intact.
- Keep the tone neutral and practical.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'blog-post-seo-optimizer'],
}
