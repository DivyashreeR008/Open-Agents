export default {
  id: 'saas-pricing-tier-optimizer',
  createdAt: '2026-10-20',
  name: 'SaaS Pricing Tier Optimizer',
  description:
    'Analyze pricing tiers, usage limits, and competitor benchmarks to recommend packagings and price points.',
  category: 'Business',
  icon: 'DollarSign',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'currentPricing',
      label: 'Current pricing tiers',
      type: 'textarea',
      placeholder: 'Describe existing tiers, prices, and limits...',
      required: true,
    },
    {
      id: 'competitors',
      label: 'Competitor pricing',
      type: 'text',
      placeholder: 'Competitor names and their pricing models',
      required: true,
    },
    {
      id: 'usageData',
      label: 'Usage data',
      type: 'text',
      placeholder: 'Average customers per tier, feature adoption rates',
      required: true,
    },
  ],
  systemPrompt: `You are an expert SaaS pricing strategist.

Analyze pricing tiers and recommend optimized packagings and price points.

Output format:

## Current State Analysis
- Tier-by-tier breakdown.
- Price per value metric.
- Identified gaps or overlaps.

## Competitive Positioning
- Where you sit vs competitors (premium / parity / budget).
- Differentiation opportunities.

## Recommended Tier Structure
### Tier 1: [Name] — $[price]/[period]
- **Best for:** Customer segment.
- **Limits:** Users, seats, API calls, storage.
- **Features:** Included vs add-on.
- **Rationale:** Why this price point.

### Tier 2: [Name] — $[price]/[period]
- Same structure.

### Tier 3: [Name] — $[price]/[period]
- Same structure.

## Packaging Recommendations
- Feature gating (which features in which tier).
- Usage limits (hard vs soft caps).
- Add-on pricing.
- Enterprise custom pricing framework.

## Migration Plan
- Grandfathering existing customers.
- Price increase communication.
- Timeline for changes.

## Metrics to Track
- Conversion rate by tier.
- Churn by tier.
- ARPU (average revenue per user).
- Expansion revenue.

Rules:
- Base recommendations on provided data.
- Do not recommend prices below cost.
- Consider value-based, not cost-plus, pricing.`,

  outputType: 'markdown',
}
