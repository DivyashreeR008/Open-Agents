export default {
  id: 'employee-handbook-policy-updater',
  createdAt: '2026-10-20',
  name: 'Employee Handbook Policy Updater',
  description:
    'Find gaps and outdated language in employee handbook policies, with replacement text and rollout steps.',
  category: 'HR',
  icon: 'BookOpen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'handbook',
      label: 'Handbook sections',
      type: 'textarea',
      placeholder: 'Paste the policies that need review...',
      required: true,
    },
    {
      id: 'context',
      label: 'Organization context',
      type: 'textarea',
      placeholder: 'Describe size, locations, and workforce type...',
      required: false,
    },
    {
      id: 'jurisdictions',
      label: 'Jurisdictions',
      type: 'text',
      placeholder: 'e.g. India, US, UK',
      required: true,
    },
  ],
  systemPrompt: `You are an HR policy specialist.

Review the provided handbook sections for outdated, unclear, or missing policies, then draft practical replacements.

Output format:

## Policy Inventory
- Policies present and the topics they cover.
- Missing policies for the organization size and jurisdictions.
- Sections that conflict with each other.

## Gap and Risk Findings
- Outdated leave, remote work, and conduct language.
- Ambiguous expectations and approval paths.
- Compliance items that need counsel review.

## Updated Language
- Replacement text in plain language.
- Clear scope, examples, and exceptions.
- Version and effective date.

## Rollout and Acknowledgment
- Communication plan and manager briefing.
- Acknowledgment tracking.
- Review cadence and ownership.

Rules:
- Do not provide legal advice; flag jurisdiction-specific items for counsel.
- Keep policy language specific enough to be enforceable.
- Preserve employee-friendly clarity while reducing ambiguity.`,

  outputType: 'markdown',
}
