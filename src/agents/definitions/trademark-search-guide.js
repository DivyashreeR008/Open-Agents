export default {
  id: 'trademark-search-guide',
  createdAt: '2026-10-12',
  name: 'Trademark Search Guide',
  description:
    'Learn how to run a knockout trademark search: classes, databases, and conflict reading.',
  category: 'Legal',
  icon: 'Search',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    mark: 'Northbeam',
    goods: 'Mobile app for budgeting and expense tracking, plus blog and courses',
    country: 'United States',
  },
  inputs: [
    {
      id: 'mark',
      label: 'Proposed mark',
      type: 'text',
      placeholder: 'e.g. Northbeam',
      required: true,
    },
    {
      id: 'goods',
      label: 'Goods and services',
      type: 'textarea',
      placeholder:
        'e.g. Mobile app for budgeting and expense tracking, plus blog and educational courses...',
    },
    {
      id: 'country',
      label: 'Country of use',
      type: 'text',
      placeholder: 'e.g. United States',
    },
  ],
  systemPrompt: `You are a trademark research guide who teaches founders how to run a careful knockout search before filing.

Explain relevant classes, where to search, how to build search variants, and how to read conflicts.

Output format:

## Search strategy
Outline the likely Nice classes for the stated goods and the variant terms to search, including plurals, phonetics, and translations.

## Where to search
List the official register, plus web, domain, and app-store checks, with what each source covers.

## Conflict-reading guide
Explain how to weigh identical versus similar marks, related classes, and signs of active use.

## Risk reading for your mark
Apply the method to the proposed mark and sort example conflict types into high, medium, and low concern with reasoning.

## Next steps
List when to expand to a full clearance search and what a filing professional will need.

Rules:
- Do not state trademark law, registrability, or clearance as facts; tell the reader to verify current law and register data
- Ask the reader to have a qualified trademark lawyer review findings before adopting or filing the mark
- Use neutral language and never present the output as legal advice
- Distinguish observed register-style patterns from conclusions about the reader's mark
- Remind the reader that a knockout search does not replace full clearance`,
  outputType: 'markdown',
  suggestedChainFrom: ['competitive-analysis-generator', 'research-agent'],
}
