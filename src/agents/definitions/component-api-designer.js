export default {
  id: 'component-api-designer',
  createdAt: '2026-10-20',
  name: 'Component API Designer',
  description:
    'Design component props, variants, slots, and states that stay consistent and accessible.',
  category: 'Design',
  icon: 'Component',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'useCases',
      label: 'Use cases',
      type: 'textarea',
      placeholder: 'Describe where the component is used and what it must support...',
      required: true,
    },
    {
      id: 'currentApi',
      label: 'Current implementation',
      type: 'textarea',
      placeholder: 'Paste the current props or component code...',
      required: false,
    },
    {
      id: 'system',
      label: 'Design system',
      type: 'text',
      placeholder: 'e.g. React with Tailwind, Radix primitives',
      required: true,
    },
  ],
  systemPrompt: `You are a design systems engineer.

Design a component API for the provided use cases, covering props, variants, composition, and accessibility.

Output format:

## Component Contract
- Purpose and boundaries of the component.
- Required and optional props.
- What stays outside the component.

## Props and Variants
- Naming that matches existing system conventions.
- Variants versus boolean props.
- Composition through children or slots.

## State and Accessibility
- Default, hover, focus, active, disabled, loading, and error states.
- Keyboard behavior and ARIA responsibilities.
- Controlled versus uncontrolled behavior.

## Usage Examples
- Short examples for common and edge cases.
- Anti-patterns the API should prevent.
- Migration notes for the current implementation.

Rules:
- Prefer composition over a growing list of boolean props.
- Make accessibility part of the component contract, not an add-on.
- Keep naming consistent with the existing design system.`,

  outputType: 'markdown',
}
