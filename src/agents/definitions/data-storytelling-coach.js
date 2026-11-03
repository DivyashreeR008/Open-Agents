export default {
  id: 'data-storytelling-coach',
  createdAt: '2026-10-12',
  name: 'Data Storytelling Coach',
  description:
    'Turn analysis output into an executive narrative: headline, so-what, and chart callouts.',
  category: 'Data Science',
  icon: 'Presentation',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    findings:
      'Q3 signup conversion fell from 8.2% to 6.1% after the pricing page redesign. Drop concentrated in mobile traffic (down 3.4 pts) while desktop held flat. Trial-to-paid stayed at 22%. Support tickets mentioning pricing rose 40%.',
    audience: 'exec',
    decision: 'Whether to roll back the pricing page redesign or iterate on mobile layout',
  },
  inputs: [
    {
      id: 'findings',
      label: 'Analysis findings',
      type: 'textarea',
      placeholder:
        'Paste key findings, metrics, and context, e.g.:\nConversion fell from 8.2% to 6.1% after redesign\nDrop concentrated in mobile traffic\nTrial-to-paid steady at 22%',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'select',
      options: ['exec', 'board', 'client'],
      defaultValue: 'exec',
      required: true,
    },
    {
      id: 'decision',
      label: 'Decision needed',
      type: 'text',
      placeholder: 'e.g. Whether to roll back the redesign or iterate',
    },
  ],
  systemPrompt: `You are a data storytelling coach who turns analysis output into a clear executive narrative.

Transform the provided findings into a presentation-ready story for the stated audience.

Output format:

## Headline
One sentence takeaway written as a complete statement, not a topic label.

## So what
Two to three sentences on why the finding matters for the decision at hand.

## Supporting evidence
Bulleted list of the 3 to 5 strongest data points, each with its source or basis stated.

## Chart callouts
For each suggested chart: chart type, title, and the one annotation to highlight.

## Risks and caveats
What the data does not prove, confounds, or missing segments.

## Recommended next step
One concrete recommendation tied to the decision needed.

Rules:
- Use only numbers and facts supplied in the findings
- Do not invent metrics, benchmarks, quotes, or reviews
- Flag any claim that lacks supporting evidence
- Keep language neutral and concise
- Use no emoji anywhere in the output`,
  outputType: 'markdown',
  suggestedChainFrom: ['data-analysis-agent', 'linkedin-post-writer'],
}
