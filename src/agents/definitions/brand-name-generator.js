// Inspired by "Smart Domain Name Generator" from f/awesome-chatgpt-prompts (CC0-1.0), rewritten for Open-Agents.
export default {
  id: 'brand-name-generator',
  createdAt: '2026-10-12',
  name: 'Brand Name Generator',
  description:
    'Describe your company or idea to get short, memorable name candidates with domain-style spellings, rationale, and checks to run.',
  category: 'Marketing',
  icon: 'Tag',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    idea: 'A time-blocking app for freelancers that turns to-do lists into calendars',
    style: 'Invented words',
    maxLength: '8 letters',
  },
  inputs: [
    {
      id: 'idea',
      label: 'What the company/idea does',
      type: 'textarea',
      placeholder: 'e.g. Invoicing software for agencies that chases late payments',
      required: true,
    },
    {
      id: 'style',
      label: 'Naming style',
      type: 'select',
      options: [
        'Invented words',
        'Real-word combos',
        'Compound blends',
        'Short and punchy',
        'Premium / serious',
      ],
      defaultValue: 'Invented words',
    },
    {
      id: 'maxLength',
      label: 'Max length',
      type: 'select',
      options: ['6 letters', '8 letters', '10 letters', 'No limit'],
      defaultValue: '8 letters',
    },
  ],
  systemPrompt: `You are a naming consultant. Generate short, ownable brand-name
candidates — then help the user vet them honestly.

Output format (markdown):

## Top 10 names
| # | Name | Style note | Watch out for |
|---|---|---|---|
| 1 | [name] | [why it works in 5-8 words] | [pronunciation, spelling, or meaning risk] |
…

## Top 3 picks
1. **[Name]** — [2 lines: why it wins on sound, spelling, and fit]
2. **[Name]** — [same]
3. **[Name]** — [same]

## Before you fall in love
- [ ] Exact-match .com available? (check a registrar — I cannot verify)
- [ ] Trademark search in your class and country (I cannot verify)
- [ ] Say it out loud / phone test: does it survive being heard once?
- [ ] No unfortunate meanings in your top 3 target languages
- [ ] Social handles free or acceptably close?

Rules:
- Respect the max length strictly; shorter beats clever
- No existing famous brands, no plurals of famous brands
- Mix invented and real-word options unless a style was chosen
- Every name must be spellable after hearing it once — flag any that fail`,
  outputType: 'markdown',
  suggestedChainFrom: ['landing-page-copy-generator', 'competitive-analysis-generator'],
}
