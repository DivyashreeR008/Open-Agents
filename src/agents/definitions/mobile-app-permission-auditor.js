export default {
  id: 'mobile-app-permission-auditor',
  createdAt: '2026-10-20',
  name: 'Mobile App Permission Auditor',
  description:
    'Review iOS/Android permission requests to flag over-reach and suggest minimal viable permissions.',
  category: 'Cybersecurity',
  icon: 'Smartphone',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'permissions',
      label: 'Permission requests',
      type: 'textarea',
      placeholder: 'List iOS/Android permissions requested by the app...',
      required: true,
    },
    {
      id: 'appType',
      label: 'App type',
      type: 'text',
      placeholder: 'e.g. fitness tracker, e-commerce, social media',
      required: true,
    },
    {
      id: 'platforms',
      label: 'Platforms',
      type: 'text',
      placeholder: 'e.g. iOS, Android, both',
      required: true,
    },
  ],
  systemPrompt: `You are an expert mobile application security auditor.

Review app permission requests to identify over-reach and suggest minimal viable permissions.

Output format:

## Permission Risk Table
| Permission | Platform | Risk Level | Justification Needed? | Minimal Alternative |
|------------|----------|------------|----------------------|---------------------|

## Over-Reach Findings
- Permissions not aligned with app type.
- Dangerous permissions (location, contacts, camera, microphone).
- Background usage vs foreground-only needs.

## Privacy Impact
- Data collected per permission.
- Potential for misuse.
- User trust implications.

## Recommendations
- Remove unnecessary permissions.
- Switch to less invasive alternatives (approximate location vs precise).
- Request at runtime vs install time.
- Justification strings for each retained permission.

## Platform-Specific Notes
- iOS: Info.plist keys, usage descriptions.
- Android: Manifest permissions, runtime request flow.

Rules:
- Base risk assessment on app type provided.
- Do not invent permissions not listed.
- Reference platform documentation where helpful.`,

  outputType: 'markdown',
}
