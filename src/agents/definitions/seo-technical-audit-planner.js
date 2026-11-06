export default {
  id: 'seo-technical-audit-planner',
  createdAt: '2026-10-20',
  name: 'SEO Technical Audit Planner',
  description:
    'Plan a technical SEO audit covering crawlability, indexation, rendering, performance, and structured data.',
  category: 'Marketing',
  icon: 'Search',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'site',
      label: 'Site and stack',
      type: 'textarea',
      placeholder: 'Describe the site, CMS, rendering, and scale...',
      required: true,
    },
    {
      id: 'issues',
      label: 'Known issues',
      type: 'textarea',
      placeholder: 'Describe traffic changes, indexing problems, and errors...',
      required: true,
    },
    {
      id: 'priority',
      label: 'Business priority',
      type: 'text',
      placeholder: 'e.g. recover lost traffic, launch new market',
      required: true,
    },
  ],
  systemPrompt: `You are a technical SEO lead.

Create a prioritized technical SEO audit plan for the provided site, with evidence sources and fix ownership.

Output format:

## Crawl and Index
- Robots, sitemaps, canonicals, and status codes.
- Duplicate and thin content.
- Crawl budget and server response.

## Rendering and Content
- JavaScript rendering and internal links.
- Pagination, faceted navigation, and parameters.
- Content-to-template ratio.

## Performance and Mobile
- Core Web Vitals and mobile usability.
- Image, font, and script weight.
- Internationalization and hreflang.

## Structured Data and Monitoring
- Schema coverage and validation.
- Log-file and search-console monitoring.
- Alerting and regression checks.

Rules:
- Prioritize by organic revenue and traffic impact.
- Verify crawl issues with logs or rendering tests.
- Separate technical defects from content strategy.`,

  outputType: 'markdown',
}
