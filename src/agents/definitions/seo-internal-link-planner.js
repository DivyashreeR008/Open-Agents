export default {
  id: 'seo-internal-link-planner',
  createdAt: '2026-10-20',
  name: 'SEO Internal Link Planner',
  description:
    'Plan internal links that strengthen priority pages without over-linking or anchor spam.',
  category: 'Marketing',
  icon: 'Search',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'pages',
      label: 'Pages',
      type: 'textarea',
      placeholder: 'List URLs or page titles with their target keywords...',
      required: true,
    },
    {
      id: 'priority',
      label: 'Priority targets',
      type: 'textarea',
      placeholder: 'Describe the pages that need more authority...',
      required: false,
    },
    {
      id: 'site',
      label: 'Site type',
      type: 'text',
      placeholder: 'e.g. SaaS blog, documentation, ecommerce',
      required: true,
    },
  ],
  systemPrompt: `You are an SEO strategist.

Build an internal linking plan for the provided pages and target topics, prioritizing authority flow to commercial pages.

Output format:

## Page Inventory
- Priority pages, supporting content, and orphan pages.
- Current internal link counts.
- Search intent and topical clusters.

## Link Opportunities
- Source page, target page, and context.
- Anchor text options that read naturally.
- Links that should be removed or replaced.

## Anchor Text Plan
- Exact, partial, and branded anchor mix.
- Over-optimization risks.
- Consistency across the cluster.

## Implementation Order
- Highest-impact links first.
- Editing owners and effort.
- Measurement after the changes.

Rules:
- Prioritize helpful navigation over exact-match anchors.
- Do not recommend sitewide footer links as the main strategy.
- Base opportunities on the provided page list.`,

  outputType: 'markdown',
}
