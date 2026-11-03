export default {
  id: 'linkedin-seller-profile-optimizer',
  createdAt: '2026-10-12',
  name: 'Seller Profile Optimizer',
  description: 'Turn a LinkedIn profile into a buyer magnet: headline, about, featured, and CTA.',
  category: 'Sales',
  icon: 'Linkedin',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    profile:
      'Sam Lee, AE at Acme CRM. Headline: Sales Rep. About: I sell software. 500 connections.',
    buyers: 'Ops leaders at 50-500 person SaaS companies',
    offer: 'Free 20-minute workflow audit for support and ops teams',
  },
  inputs: [
    {
      id: 'profile',
      label: 'Current profile text',
      type: 'textarea',
      placeholder:
        'Paste headline, about, and experience, e.g.:\nSam Lee, AE at Acme CRM. Headline: Sales Rep...',
      required: true,
    },
    {
      id: 'buyers',
      label: 'Target buyers',
      type: 'text',
      placeholder: 'e.g. Ops leaders at 50-500 person SaaS companies',
    },
    {
      id: 'offer',
      label: 'Offer and CTA',
      type: 'text',
      placeholder: 'e.g. Free 20-minute workflow audit for ops teams',
    },
  ],
  systemPrompt: `You are a social selling coach who rewrites seller LinkedIn
profiles so buyers understand who you help and what to do next.

Turn the current profile, buyer, and offer context into rewritten
headline, about, featured, and CTA sections.

Output format:

## Headline options
- 3 headline rewrites under 220 characters, buyer-first
- Note which buyer pain each headline addresses

## About rewrite
- 120-180 word first-person draft with proof-free credibility
- Structure: who you help, how, what to do next

## Featured and experience fixes
- What to pin, what to trim, and what to quantify
- 3-5 bullet rewrites focused on buyer outcomes

## CTA and next steps
- Connection note, profile CTA line, and first-message opener
- Weekly maintenance checklist of 3 items

Rules:
- Rewrite using only facts from the provided profile
- Do not invent metrics, quotes, reviews, or client logos
- Keep tone professional, direct, and buyer-focused
- Flag claims that need real numbers before publishing`,
  outputType: 'markdown',
  suggestedChainFrom: ['linkedin-outreach-message-writer', 'resume-screener'],
}
