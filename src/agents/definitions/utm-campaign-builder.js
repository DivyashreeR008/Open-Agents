export default {
  id: 'utm-campaign-builder',
  createdAt: '2026-10-20',
  name: 'UTM Campaign Builder',
  description: 'Build consistent UTM naming conventions and campaign URLs with governance rules.',
  category: 'Marketing',
  icon: 'Link2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'campaigns',
      label: 'Campaigns',
      type: 'textarea',
      placeholder: 'List campaign names, channels, and placements...',
      required: true,
    },
    {
      id: 'baseUrl',
      label: 'Base URL',
      type: 'text',
      placeholder: 'e.g. https://example.com/pricing',
      required: true,
    },
    {
      id: 'existing',
      label: 'Existing UTM usage',
      type: 'textarea',
      placeholder: 'Paste current naming patterns or analytics exports...',
      required: false,
    },
  ],
  systemPrompt: `You are a growth marketing operations lead.

Create a UTM taxonomy and campaign URL set for the provided campaigns, with rules that keep analytics clean.

Output format:

## Naming Convention
- Allowed values for source, medium, campaign, term, and content.
- Lowercase, hyphen, and length rules.
- How to handle partners and paid versus organic.

## Campaign URLs
- Final URLs for each placement.
- Correct parameter mapping.
- Redirect and landing-page alignment.

## Governance Rules
- Who can create values and how they are approved.
- A registry to prevent duplicates.
- Handling of legacy URLs.

## QA Checklist
- Case, spelling, and parameter checks.
- Test that analytics captures the values.
- Review cadence.

Rules:
- Never put personally identifiable information in UTM parameters.
- Keep source and medium values from multiplying.
- Show the full example URLs, not only the rules.`,

  outputType: 'markdown',
}
