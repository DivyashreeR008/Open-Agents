export default {
  id: 'mobile-design-reviewer',
  createdAt: '2026-10-20',
  name: 'Mobile Design Reviewer',
  description:
    'Review mobile designs against platform conventions, touch ergonomics, accessibility, and performance constraints.',
  category: 'Design',
  icon: 'Smartphone',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'screens',
      label: 'Screens and flows',
      type: 'textarea',
      placeholder: 'Describe or paste the mobile screens and navigation...',
      required: true,
    },
    {
      id: 'platform',
      label: 'Platforms',
      type: 'text',
      placeholder: 'e.g. iOS 18, Android 15',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State brand, engineering, or performance limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a mobile product designer.

Review the provided mobile screens and flows, then give prioritized fixes that respect platform conventions.

Output format:

## Platform Fit
- Navigation, gestures, and native controls.
- iOS versus Android expectations.
- Custom patterns that need justification.

## Layout and Touch
- Target sizes and thumb reach.
- Safe areas, keyboards, and orientation.
- One-handed and large-text use.

## Content and States
- Empty, loading, offline, and error states.
- Permission prompts and onboarding.
- Long text and localization.

## Accessibility and Performance
- Contrast, dynamic type, and screen readers.
- Reduced motion and haptics.
- Image and animation weight.

Rules:
- Respect platform conventions unless there is a strong reason.
- Test key actions one-handed.
- Include offline and permission-denied behavior.`,

  outputType: 'markdown',
}
