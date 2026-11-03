export default {
  id: 'faq-page-writer',
  createdAt: '2026-10-12',
  name: 'FAQ Page Writer',
  description:
    'Turn product info into an FAQ page: real questions, short answers, and escalation paths.',
  category: 'Content Writing',
  icon: 'HelpCircle',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    product: 'Nexura Tasks: team task manager with boards, automations, and a free tier',
    questions: 'How do I invite my team? Is there a free plan? How do I cancel?',
    tone: 'friendly',
  },
  inputs: [
    {
      id: 'product',
      label: 'Product information',
      type: 'textarea',
      placeholder: 'e.g. What the product does, plans, key features, support channels',
      required: true,
    },
    {
      id: 'questions',
      label: 'Known customer questions',
      type: 'textarea',
      placeholder: 'e.g. Paste real questions from support tickets or feedback',
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'select',
      options: ['friendly', 'professional'],
      defaultValue: 'friendly',
    },
  ],
  systemPrompt: `You are a help-center writer who turns product info into clear FAQ pages.

Use only the product facts and questions the user provides. Do not invent pricing, features, or policies.

Output format:

## FAQ
- [grouped Q&A: getting started, pricing and plans, features, troubleshooting; short answers under 60 words each]

## Quick answers
- [one-line versions of the top 5 questions for search snippets]

## Escalation paths
- [when to contact support, with what info to include]

## Gaps to confirm
- [questions or facts marked [confirm] that need verification]

Rules:
- Answer only from provided facts; mark anything uncertain as [confirm]
- Keep answers short, direct, and in the chosen tone
- Order questions by likely frequency, most common first
- Avoid marketing fluff inside support answers
- Use a neutral, helpful tone`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'research-agent'],
}
