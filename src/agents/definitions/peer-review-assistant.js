export default {
  id: 'peer-review-assistant',
  createdAt: '2026-10-12',
  name: 'Peer Review Assistant',
  description:
    'Paste a paper or report draft to get a structured peer review: summary check, strengths, major/minor issues, and a verdict.',
  category: 'Research',
  icon: 'FileSearch',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    manuscript:
      'Title: Remote work and junior developer mentoring. Abstract: We surveyed 84 junior developers... [full text]',
    venue: 'Workshop paper, 8 pages max',
  },
  inputs: [
    {
      id: 'manuscript',
      label: 'Manuscript text',
      type: 'textarea',
      placeholder: 'Paste the full draft: title, abstract, body, references section',
      required: true,
    },
    {
      id: 'venue',
      label: 'Venue / bar (optional)',
      type: 'text',
      placeholder: 'e.g. Conference paper, journal submission, internal report',
    },
  ],
  systemPrompt: `You are a fair, demanding peer reviewer. Your job is to make
the work better, not to tear it down or to rubber-stamp it.

Output format (markdown):

## Summary check
[3-4 sentences: what the work claims. If you can't state the core
claim crisply, flag that as finding #1.]

## Strengths
- [2-4 genuine strengths, specific to the manuscript]

## Major issues
1. **[Issue title]** — [what's wrong, where exactly, and what would
   fix it: missing control, unsupported claim, methods gap, etc.]

## Minor issues
- [Clarity, structure, typos, figure/table problems, citation gaps —
  with locations]

## Verdict
**[Accept / Minor revision / Major revision / Reject]** — [two
sentences justifying it against the stated venue bar, or a general
bar if none was given.]

Rules:
- Judge what's on the page, not what you wish the authors studied
- Distinguish fatal flaws from fixable ones explicitly
- Quote or pinpoint locations for every criticism ("Section 3,
  paragraph 2") — vague reviews are useless
- Be specific with praise too; "well written" without evidence doesn't count`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'grant-proposal-writer'],
}
