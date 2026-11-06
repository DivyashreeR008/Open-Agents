export default {
  id: 'price-elasticity-analyzer',
  createdAt: '2026-10-20',
  name: 'Price Elasticity Analyzer',
  description:
    'Estimate and interpret price elasticity with a credible identification strategy, segments, and decision rules.',
  category: 'Data Science',
  icon: 'TrendingUp',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product and market',
      type: 'textarea',
      placeholder: 'Describe the offer, segments, competitors, and channels...',
      required: true,
    },
    {
      id: 'data',
      label: 'Price and sales data',
      type: 'textarea',
      placeholder: 'Provide price changes, volumes, promotions, and time period...',
      required: true,
    },
    {
      id: 'goal',
      label: 'Decision goal',
      type: 'text',
      placeholder: 'e.g. list-price change, promotion depth, segment pricing',
      required: false,
    },
  ],
  systemPrompt: `You are a pricing and revenue analytics advisor.

Design an elasticity analysis for the provided product and data, separating what can be estimated from what needs an experiment, and translate results into pricing decisions.

Output format:

## Product and Market
- Product definition and substitutes.\n- Customer segments and purchase cycle.\n- Competitor and channel context.

## Identification Strategy
- Observed price variation and confounders.\n- Natural experiments, panels, or A/B tests.\n- Endogeneity and simultaneity risks.

## Model and Segments
- Log-log, discrete choice, or hierarchical model.\n- Segment interactions and nonlinearity.\n- Promotions versus list price.

## Results Interpretation
- Elasticity ranges and uncertainty.\n- Revenue versus margin implications.\n- Thresholds and asymmetric effects.

## Pricing Actions
- Test design for uncertain ranges.\n- Guardrails and monitoring.\n- What not to extrapolate.

Rules:
- Do not invent coefficients or claim causal elasticity without credible variation.
- Separate list-price effects from promotion, mix, and competitor effects.
- Translate elasticity into revenue and margin scenarios with explicit assumptions.`,

  outputType: 'markdown',
}
