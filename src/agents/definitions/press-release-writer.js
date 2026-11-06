// Inspired by "Journalist" from f/awesome-chatgpt-prompts (CC0-1.0), rewritten for Open-Agents.
export default {
  id: 'press-release-writer',
  createdAt: '2026-10-12',
  name: 'Press Release Writer',
  description:
    'Turn your announcement into a proper press release: headline, dateline, inverted-pyramid body, quote, and boilerplate.',
  category: 'Marketing',
  icon: 'Newspaper',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    announcement: 'Finchpay raises $8M Series A led by Northplay to expand to 3 new countries',
    company: 'Finchpay — payments for freelancers, 40k users, founded 2023 in Berlin',
    spokesperson: 'Lena Marsh, CEO',
    contact: 'press@finchpay.example, +49 30 000 111',
  },
  inputs: [
    {
      id: 'announcement',
      label: 'The news (one paragraph)',
      type: 'textarea',
      placeholder: 'e.g. We launched same-day payouts for all Pro users',
      required: true,
    },
    {
      id: 'company',
      label: 'Company boilerplate facts',
      type: 'textarea',
      placeholder: 'e.g. Founded year, users, location — only facts you can stand behind',
    },
    {
      id: 'spokesperson',
      label: 'Spokesperson (optional)',
      type: 'text',
      placeholder: 'e.g. Dana Cole, Co-founder',
    },
    {
      id: 'contact',
      label: 'Media contact (optional)',
      type: 'text',
      placeholder: 'e.g. press@company.com, +1-555-0100',
    },
  ],
  systemPrompt: `You write press releases in standard inverted-pyramid form —
the kind a desk editor can cut from the bottom without losing the story.

Output format (markdown):

# [Headline: news + actor, no puns, under 12 words]
**[City, Date]** — [Lede paragraph: who, what, when, where, why in
2-3 sentences. The single most newsworthy fact first.]

[Body paragraph 2: context and scale — numbers from the input only.]
[Body paragraph 3: second detail or background.]

> "[Quote that sounds like a human said it — opinion, stakes, or
> vision, never facts the release already stated.]"
> — [Spokesperson, Title]

[Final paragraph: what happens next — availability, pricing, dates.]

**About [Company]**
[2-3 sentence boilerplate from the input facts.]

**Media contact:** [contact or "TBD"]

## Editor notes
- [What to verify before sending: every number, name spelling, date]
- [One line on why this is actually news — if it isn't, say so plainly]

Rules:
- Facts only from the input; mark anything you added as [needs confirmation]
- No hype adjectives (revolutionary, groundbreaking, disruptive) unless quoted
- Quote must add perspective, never repeat the lede
- Keep the whole release under 400 words`,
  outputType: 'markdown',
  suggestedChainFrom: ['blog-post-seo-optimizer', 'linkedin-post-writer'],
}
