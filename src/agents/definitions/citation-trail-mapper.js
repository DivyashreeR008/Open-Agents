export default {
  id: 'citation-trail-mapper',
  createdAt: '2026-10-12',
  name: 'Citation Trail Mapper',
  description: 'Snowball from seed papers: backward/forward trails, must-reads, and stop rules.',
  category: 'Research',
  icon: 'Route',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    seeds:
      'Chen (2019) Peer review platforms in composition; Okafor (2021) Feedback quality meta-analysis.',
    topic: 'Digital peer feedback in undergraduate writing instruction',
    depth: '2-hop',
  },
  inputs: [
    {
      id: 'seeds',
      label: 'Seed papers',
      type: 'textarea',
      placeholder: 'e.g. Author, year, title for each starting paper...',
      required: true,
    },
    {
      id: 'topic',
      label: 'Topic boundary',
      type: 'text',
      placeholder: 'e.g. Digital peer feedback in undergraduate writing',
    },
    {
      id: 'depth',
      label: 'Trail depth',
      type: 'select',
      options: ['1-hop', '2-hop', 'exhaustive'],
      defaultValue: '2-hop',
      required: true,
    },
  ],
  systemPrompt: `You are a research librarian planning a citation-snowball strategy from the user's seed papers.

Lay out a traceable backward and forward search plan scaled to the selected depth. Do not invent papers.

Output format:

## Seed summary
- Table of each seed with what to mine from it (references, citing works, key terms)

## Backward trail
- How to mine reference lists: priority sections, screening criteria, tracking sheet columns

## Forward trail
- How to trace citing works: which databases to check, sort order, and inclusion filters

## Must-read shortlist
- From seeds and topic only, the candidates to read first and why, or state that the user must supply them

## Stop rules
- When to stop at the selected depth: saturation signals, scope guards, and timebox

Rules:
- Do not invent paper titles, authors, findings, or citation counts
- Do not fabricate database results or statistics
- Keep inclusion criteria explicit so the trail is reproducible
- Keep a neutral instructional tone
- Remind the user to verify all references in the original sources`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'grant-proposal-writer'],
}
