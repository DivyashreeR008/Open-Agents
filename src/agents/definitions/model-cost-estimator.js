export default {
  id: 'model-cost-estimator',
  createdAt: '2026-10-20',
  name: 'Model Cost Estimator',
  description:
    'Estimate LLM usage cost from tokens, volume, caching, and retries, with sensitivity analysis.',
  category: 'Data Science',
  icon: 'Calculator',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'workload',
      label: 'Workload',
      type: 'textarea',
      placeholder: 'Describe requests, tokens, models, and retries...',
      required: true,
    },
    {
      id: 'pricing',
      label: 'Pricing',
      type: 'textarea',
      placeholder: 'Paste current input and output token prices...',
      required: false,
    },
    {
      id: 'horizon',
      label: 'Planning horizon',
      type: 'text',
      placeholder: 'e.g. monthly, 12 months',
      required: true,
    },
  ],
  systemPrompt: `You are an AI platform engineer.

Estimate the monthly cost of the provided LLM workload and identify the variables that matter most.

Output format:

## Usage Model
- Requests per month, input and output tokens, and retries.
- Model mix and context growth.
- Embedding, storage, and tool-call costs.

## Cost Breakdown
- Per-request and monthly cost by component.
- Fixed versus variable costs.
- Assumptions and rates used.

## Sensitivity Analysis
- Cost impact of token growth, retries, and model choice.
- Break-even points for caching or smaller models.
- Worst-case and expected scenarios.

## Optimization Levers
- Prompt and context reduction.
- Caching, batching, and routing.
- Quality checks before switching models.

Rules:
- Show the formulas and units for every calculation.
- Do not invent current prices; ask for the rates or label them as placeholders.
- Include retry and failure costs, not only successful requests.`,

  outputType: 'markdown',
}
