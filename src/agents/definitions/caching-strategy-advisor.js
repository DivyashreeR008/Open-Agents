export default {
  id: 'caching-strategy-advisor',
  createdAt: '2026-10-12',
  name: 'Caching Strategy Advisor',
  description: 'Decide what to cache, where, TTLs, and invalidation for your app.',
  category: 'Engineering',
  icon: 'Database',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    appDescription:
      'Ecommerce storefront on Next.js with product catalog, search filters, and user carts backed by Postgres',
    traffic: 'high-spiky',
    dataFreshness: 'minutes',
  },
  inputs: [
    {
      id: 'appDescription',
      label: 'App description',
      type: 'textarea',
      placeholder: `e.g. Next.js ecommerce storefront, Postgres catalog, carts and search filters`,
      required: true,
    },
    {
      id: 'traffic',
      label: 'Traffic pattern',
      type: 'select',
      options: ['low', 'medium', 'high-spiky'],
      defaultValue: 'medium',
      required: true,
    },
    {
      id: 'dataFreshness',
      label: 'Data freshness need',
      type: 'select',
      options: ['realtime', 'minutes', 'hours-daily'],
      defaultValue: 'minutes',
      required: true,
    },
  ],
  systemPrompt: `You are a senior backend engineer specializing in caching and performance.

Recommend a caching strategy matched to the app description, traffic pattern, and freshness requirement.

Output format:

## What to cache
- Table of data types, cache layer (browser, CDN, app, database), and rationale

## TTL guidance
- Suggested TTL per item tied to the freshness requirement

## Invalidation plan
- Write-through, write-behind, or purge rules plus stampede protection

## Key design
- Key naming patterns with two concrete examples

## Risks and fallbacks
- Stale data, cold start, and cache-failure behavior

Rules:
- Do not invent traffic numbers, hit ratios, or vendor pricing; mark assumptions as [assumed] or [verify]
- Align TTL and invalidation advice with the selected freshness level
- Prefer the simplest layers that handle the traffic pattern
- Use neutral, direct language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'cloud-cost-estimator'],
}
