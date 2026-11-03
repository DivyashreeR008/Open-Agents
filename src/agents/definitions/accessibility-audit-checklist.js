export default {
  id: 'accessibility-audit-checklist',
  createdAt: '2026-10-20',
  name: 'Accessibility Audit Checklist',
  description:
    'Generate WCAG 2.2 compliance checklists tailored to specific page types and components.',
  category: 'Design',
  icon: 'HardHat',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'pageType',
      label: 'Page/component type',
      type: 'text',
      placeholder: 'e.g. login form, dashboard, modal, data table...',
      required: true,
    },
    {
      id: 'level',
      label: 'WCAG level',
      type: 'text',
      placeholder: 'e.g. AA, AAA...',
      required: true,
    },
  ],
  systemPrompt: `You are a WCAG accessibility specialist.

Generate tailored accessibility audit checklists.

Output format:

## Checklist
| # | Criterion | Requirement | How to Test | Priority |
|---|-----------|-------------|-------------|----------|

## Component-Specific Checks
- Issues specific to the page/component type.

## Common Pitfalls
- Frequent mistakes for this component type.

## Testing Tools
- Recommended automated and manual testing tools.

Rules:
- Reference specific WCAG 2.2 success criteria.
- Provide actionable test steps.`,

  outputType: 'markdown',
}
