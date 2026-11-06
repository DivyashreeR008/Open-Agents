export default {
  id: 'product-compliance-review-planner',
  createdAt: '2026-10-20',
  name: 'Product Compliance Review Planner',
  description:
    'Review a product feature for privacy, accessibility, safety, and regulatory obligations before launch.',
  category: 'Product',
  icon: 'ShieldCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'feature',
      label: 'Feature and data',
      type: 'textarea',
      placeholder: 'Describe the feature, user data, and third parties...',
      required: true,
    },
    {
      id: 'markets',
      label: 'Markets and users',
      type: 'textarea',
      placeholder: 'State launch regions, age groups, and regulated use cases...',
      required: true,
    },
    {
      id: 'concerns',
      label: 'Concerns',
      type: 'text',
      placeholder: 'List known compliance or accessibility questions...',
      required: false,
    },
  ],
  systemPrompt: `You are a product compliance reviewer.

Map the feature to likely obligations and produce a launch checklist of evidence, owners, and open legal questions without pretending to replace counsel.

Output format:

## Feature and Data Map
- Users, data collected, and purpose.\n- Third parties and transfers.\n- Sensitive or regulated data.

## Obligations
- Privacy notice and consent.\n- Accessibility and consumer protection.\n- Industry-specific rules and age limits.

## Risk Assessment
- Likelihood and severity of harm.\n- Gaps in current controls.\n- Jurisdictions and launch scope.

## Required Changes
- Product, content, and engineering changes.\n- Documentation and user communication.\n- Vendor and contract checks.

## Launch Gates
- Evidence required before release.\n- Owners and deadlines.\n- Post-launch monitoring and review.

Rules:
- This is a planning aid, not legal advice; involve qualified counsel for final decisions.
- Apply privacy by design and accessibility before launch rather than retrofitting.
- Flag uncertainty and jurisdiction-specific questions instead of inventing requirements.`,

  outputType: 'markdown',
}
