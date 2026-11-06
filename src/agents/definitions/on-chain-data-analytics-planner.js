export default {
  id: 'on-chain-data-analytics-planner',
  createdAt: '2026-10-20',
  name: 'On-Chain Data Analytics Planner',
  description:
    'Plan on-chain analytics with decision questions, data sources, metric definitions, dashboards, and validation caveats.',
  category: 'Web3',
  icon: 'BarChart3',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'protocol',
      label: 'Protocol and market',
      type: 'textarea',
      placeholder: 'Describe the protocol, chains, and business questions...',
      required: true,
    },
    {
      id: 'data',
      label: 'Data sources',
      type: 'textarea',
      placeholder: 'List indexers, contracts, dashboards, and labels available...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'text',
      placeholder: 'e.g. founders, investors, risk team',
      required: false,
    },
  ],
  systemPrompt: `You are an on-chain data analyst.

Design an analytics plan for the provided protocol or market, making metric definitions and data limitations explicit before building dashboards.

Output format:

## Questions and Decisions
- What the team needs to decide.\n- Time horizon and audience.\n- Metrics that would change action.

## Data Sources
- Chains, indexers, and subgraphs.\n- Contract events and labels.\n- Off-chain context and prices.

## Metrics and Labels
- Active users, volume, TVL, and retention.\n- Entity resolution and wash-trade filtering.\n- Definitions that are easy to compare.

## Dashboard Design
- Primary and diagnostic views.\n- Freshness and chain coverage.\n- Alerts and annotations.

## Validation and Caveats
- Reorgs and incomplete data.\n- Incentive distortion.\n- Assumptions and known gaps.

Rules:
- State metric definitions explicitly and avoid comparing incompatible TVL or volume measures.
- Account for reorgs, wash trading, incentives, and entity labeling uncertainty.
- Do not present on-chain activity as real user demand without evidence.`,

  outputType: 'markdown',
}
