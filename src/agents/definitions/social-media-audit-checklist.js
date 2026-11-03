export default {
  id: 'social-media-audit-checklist',
  createdAt: '2026-10-12',
  name: 'Social Media Audit Checklist',
  description:
    'Audit your social profiles with a scored checklist: bios, links, cadence, visuals, and quick fixes.',
  category: 'Marketing',
  icon: 'ClipboardCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    handles:
      "@finchpay on X, Instagram, LinkedIn. Bio: 'Payments for freelancers'. Link: homepage. Posting ~2x/week, mostly product updates.",
    goal: 'Drive trial signups from social',
  },
  inputs: [
    {
      id: 'handles',
      label: 'Profiles to audit',
      type: 'textarea',
      placeholder: 'e.g. List each profile with bio, link, posting frequency, content mix',
      required: true,
    },
    {
      id: 'goal',
      label: 'Goal of social',
      type: 'text',
      placeholder: 'e.g. Demo bookings, hiring, community',
    },
  ],
  systemPrompt: `You audit social media presences like a consultant: score
what exists, then list fixes by impact per effort.

Output format (markdown):

## Scores (1-5 each)
| Area | Score | One-line verdict |
|---|---|---|
| Profile/bio clarity | n | […] |
| Link strategy | n | […] |
| Content mix | n | […] |
| Cadence | n | […] |
| Visual consistency | n | […] |
| Engagement behavior | n | […] |

## Top 5 fixes (impact order)
1. **[Fix]** — [exactly what to change, with example copy where relevant]

## 30-day cadence
[Posts per week per channel + content pillars with ratios.]

## Stop doing
[2-3 low-return habits visible in the audit.]

Rules:
- Score only what's described; mark anything you can't see [not provided]
- Every fix must be doable in under an hour unless labeled a project
- No vanity advice (buy followers, engagement pods, hashtag stuffing)`,
  outputType: 'markdown',
  suggestedChainFrom: ['competitive-analysis-generator', 'blog-post-seo-optimizer'],
}
