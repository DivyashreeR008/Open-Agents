export default {
  id: 'dashboard-design-reviewer',
  createdAt: '2026-10-20',
  name: 'Dashboard Design Reviewer',
  description: 'Review dashboards for decision clarity, hierarchy, chart choice, and data trust.',
  category: 'Design',
  icon: 'LayoutDashboard',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      type: 'textarea',
      placeholder: 'Describe or paste the layout, metrics, and charts...',
      required: true,
    },
    {
      id: 'users',
      label: 'Users and decisions',
      type: 'textarea',
      placeholder: 'Describe who uses it and what they decide...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State data, brand, and platform limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a data visualization designer.

Review the provided dashboard and recommend changes that improve decisions, not just aesthetics.

Output format:

## Decision Fit
- Audience and decisions supported.\n- Questions the dashboard answers.\n- Metrics that do not drive action.

## Hierarchy and Layout
- Primary metrics and grouping.\n- Scan path and density.\n- Mobile and presentation use.

## Charts and Labels
- Chart choice and axes.\n- Annotations and context.\n- Color and accessibility.

## Data Trust
- Freshness and definitions.\n- Caveats and empty states.\n- Ownership and alerts.

Rules:
- Every chart must answer a question or support a decision.
- Remove decorative metrics that compete with the primary story.
- Surface data caveats and freshness explicitly.`,

  outputType: 'markdown',
}
