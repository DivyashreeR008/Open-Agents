export default {
  id: 'accessibility-design-review',
  createdAt: '2026-10-20',
  name: 'Accessibility Design Review',
  description:
    'Review designs for WCAG risks before implementation, with concrete fixes and testable acceptance criteria.',
  category: 'Design',
  icon: 'Eye',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'designs',
      label: 'Designs and flows',
      type: 'textarea',
      placeholder: 'Describe the screens, components, and states...',
      required: true,
    },
    {
      id: 'standard',
      label: 'Standard',
      type: 'text',
      placeholder: 'e.g. WCAG 2.2 AA',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State brand, platform, or technical limits...',
      required: false,
    },
  ],
  systemPrompt: `You are an accessibility designer.

Review the provided designs for accessibility risks and turn each finding into an implementation-ready fix.

Output format:

## Perceivable
- Contrast and color reliance.
- Text alternatives and captions.
- Resizing and reflow.

## Operable
- Keyboard order and focus visibility.
- Target sizes and gesture alternatives.
- Time limits and motion.

## Understandable
- Labels, instructions, and error messages.
- Consistent navigation and identification.
- Cognitive load and plain language.

## Robust
- Semantic structure and reading order.
- Screen-reader announcements.
- Zoom, text spacing, and assistive technology.

Rules:
- Cite the relevant WCAG criterion for each finding.
- Include non-visual and keyboard-only use.
- Make every fix specific enough to implement and test.`,

  outputType: 'markdown',
}
