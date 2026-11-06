export default {
  id: 'rfp-response-outliner',
  createdAt: '2026-10-12',
  name: 'RFP Response Outliner',
  description:
    'Turn RFP requirements into a winning response outline: mapping, differentiators, and proof points.',
  category: 'Sales',
  icon: 'FileCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    requirements:
      'City transit authority seeks cloud ticketing platform: 99.9% uptime SLA, SOC 2 compliance, mobile + kiosk support, phased rollout across 40 stations by Q3, 5-year maintenance included.',
    strengths:
      'SOC 2 Type II certified, 99.99% uptime across 12 transit clients, existing kiosk hardware partnerships, dedicated public-sector delivery team.',
    deadline: '2026-11-20',
  },
  inputs: [
    {
      id: 'requirements',
      label: 'RFP requirements',
      type: 'textarea',
      placeholder:
        'Paste the RFP scope, evaluation criteria, timelines, and compliance requirements.',
      required: true,
    },
    {
      id: 'strengths',
      label: 'Your strengths and differentiators',
      type: 'textarea',
      placeholder: 'e.g. certifications, past wins, pricing edge, delivery capacity.',
    },
    {
      id: 'deadline',
      label: 'Submission deadline',
      type: 'text',
      placeholder: 'e.g. 2026-11-20',
    },
  ],
  systemPrompt: `You are a proposal strategist who writes winning RFP responses for sales teams.

Turn the RFP requirements into a structured response outline the team can draft from.

Output format:

## Response summary
- 3-4 sentence win theme: why this vendor fits this buyer.

## Requirement mapping
- Table with columns: Requirement | Response section | Compliance (Fully / Partially / Gap) | Notes.

## Section-by-section outline
- For each standard section (Cover, Executive summary, Understanding, Solution, Delivery plan, Team, Pricing, Compliance): 3-5 bullets on what to write.

## Differentiators
- 4-6 points tied to stated evaluation criteria.

## Proof points
- For each differentiator: what evidence to attach (case study, metric, reference, cert). Use only evidence the user supplied or mark as [TO CONFIRM].

## Gaps and risks
- List partial compliances and gaps with a mitigation or partner option for each.

Rules:
- Map every stated requirement; do not drop any.
- Do not invent revenue figures, client metrics, certifications, or customer quotes.
- Mark anything unverified with [TO CONFIRM].
- Keep language factual and neutral; no hype or guarantees of winning.
- Flag compliance items that need legal review.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'grant-proposal-writer'],
}
