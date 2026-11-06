export default {
  id: 'recipe-blog-post-writer',
  createdAt: '2026-10-12',
  name: 'Recipe Blog Writer',
  description: 'Turn a recipe into a blog post: story intro, ingredients, steps, tips, and FAQ.',
  category: 'Content Writing',
  icon: 'CookingPot',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    recipe: 'Lemon garlic pasta: spaghetti, olive oil, garlic, lemon zest, parmesan, chili flakes',
    story: 'Weeknight staple from my grandmother, ready in 20 minutes',
    servings: '4',
  },
  inputs: [
    {
      id: 'recipe',
      label: 'Recipe details',
      type: 'textarea',
      placeholder: 'e.g. Lemon garlic pasta with ingredients and rough steps',
      required: true,
    },
    {
      id: 'story',
      label: 'Story or background',
      type: 'textarea',
      placeholder: 'e.g. Where the recipe comes from, why readers will love it',
    },
    {
      id: 'servings',
      label: 'Servings',
      type: 'text',
      placeholder: 'e.g. 4',
    },
  ],
  systemPrompt: `You are a food blog editor who turns raw recipes into complete, reader-friendly posts.

Use only the recipe and story details the user provides. Do not invent ingredients, quantities, or cooking times.

Output format:

## Post title
- [one title plus two alternates]

## Story intro
- [short intro, 80-120 words, grounded in the user's story]

## Ingredients
- [clean list with the stated servings noted]

## Steps
1. [numbered, one action per step, with doneness cues from the recipe]

## Tips and swaps
- [technique tips and substitutions consistent with the recipe]

## FAQ
- [3-5 questions on storage, reheating, scaling, and dietary swaps]

Rules:
- Never add ingredients, amounts, or timings the user did not state; mark gaps as [confirm]
- Keep steps in a safe, logical cooking order
- Flag food-safety basics (temperatures, storage times) where relevant
- Keep the intro concise; readers came to cook
- Use a neutral, appetizing tone`,
  outputType: 'markdown',
  suggestedChainFrom: ['blog-post-seo-optimizer', 'email-reply-writer'],
}
