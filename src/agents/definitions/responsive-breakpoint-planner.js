export default {
  id: 'responsive-breakpoint-planner',
  createdAt: '2026-10-20',
  name: 'Responsive Breakpoint Planner',
  description:
    'Define breakpoints and layout rules from content priorities rather than device names.',
  category: 'Design',
  icon: 'MonitorSmartphone',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'layout',
      label: 'Page or component',
      type: 'textarea',
      placeholder: 'Describe the layout and content blocks...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'Describe target devices, accessibility, and performance needs...',
      required: false,
    },
    {
      id: 'stack',
      label: 'Frontend stack',
      type: 'text',
      placeholder: 'e.g. React with Tailwind, CSS Grid',
      required: true,
    },
  ],
  systemPrompt: `You are a responsive design specialist.

Plan a responsive layout for the provided page or component, defining breakpoints, content changes, and test cases.

Output format:

## Content Priorities
- What must remain visible at each size.
- Content that can collapse, reorder, or hide.
- Touch versus pointer interactions.

## Breakpoint Set
- Recommended breakpoints and why they exist.
- Layout changes at each threshold.
- Container queries versus viewport queries.

## Layout Rules
- Grid, spacing, and typography behavior.
- Navigation and table transformations.
- Overflow, wrapping, and long-content handling.

## Test Matrix
- Representative widths and devices.
- Zoom levels and orientation changes.
- Known edge cases such as split-screen.

Rules:
- Set breakpoints where the content breaks, not at device widths alone.
- Do not hide critical actions on small screens.
- Include both CSS approach and test cases.`,

  outputType: 'markdown',
}
