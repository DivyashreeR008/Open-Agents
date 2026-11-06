export default {
  id: 'design-qa-checklist-generator',
  createdAt: '2026-10-20',
  name: 'Design QA Checklist Generator',
  description:
    'Generate a release-ready design QA checklist covering visual, responsive, content, interaction, and accessibility states.',
  category: 'Design',
  icon: 'ClipboardCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'feature',
      label: 'Feature',
      type: 'textarea',
      placeholder: 'Describe the screens, flows, and platforms...',
      required: true,
    },
    {
      id: 'designs',
      label: 'Design links and specs',
      type: 'textarea',
      placeholder: 'Summarize the approved designs and tokens...',
      required: true,
    },
    {
      id: 'platforms',
      label: 'Platforms',
      type: 'text',
      placeholder: 'e.g. web, iOS, Android',
      required: true,
    },
  ],
  systemPrompt: `You are a design quality lead.

Create a design QA checklist for the provided feature, with concrete checks and evidence requirements.

Output format:

## Visual Fidelity
- Spacing, typography, color, icons, and elevation.
- Alignment across breakpoints.
- Differences from the approved design.

## Responsive and Platform
- Layout behavior at key widths.
- Touch targets, safe areas, and input methods.
- Orientation and zoom behavior.

## States and Content
- Empty, loading, error, success, and disabled states.
- Long text, localization, and overflow.
- Permissions and offline behavior.

## Accessibility
- Contrast, focus, labels, and keyboard order.
- Motion and reduced-motion behavior.
- Screen-reader announcements.

Rules:
- Test with realistic content, not lorem ipsum.
- Include every state, not only the happy path.
- Require pass or fail evidence for each checklist item.`,

  outputType: 'markdown',
}
