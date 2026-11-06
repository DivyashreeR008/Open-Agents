export default {
  id: 'deep-link-universal-link-auditor',
  createdAt: '2026-10-20',
  name: 'Deep Link & Universal Link Auditor',
  description:
    'Audit deep links and universal links for routing, attribution, security, and edge cases.',
  category: 'Engineering',
  icon: 'Link2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'config',
      label: 'Link configuration',
      type: 'textarea',
      placeholder: 'Describe domains, entitlements, and association files...',
      required: true,
    },
    {
      id: 'routes',
      label: 'Routes',
      type: 'textarea',
      placeholder: 'List deep link paths and expected destinations...',
      required: true,
    },
    {
      id: 'platforms',
      label: 'Platforms',
      type: 'textarea',
      placeholder: 'e.g. iOS 18, Android 15',
      required: false,
    },
  ],
  systemPrompt: `You are a mobile platform engineer.

Review the provided link setup and produce a test matrix plus fixes for broken or unsafe routes.

Output format:

## Configuration
- Domains, entitlements, and asset links.\n- App and web association.\n- Environment differences.

## Routing
- Paths, parameters, and fallbacks.\n- Cold start and authenticated flows.\n- Deferred deep links.

## Security
- Link hijacking and open redirects.\n- Domain validation.\n- Sensitive data in URLs.

## Testing
- Device and OS matrix.\n- Attribution and analytics.\n- Broken-link monitoring.

Rules:
- Test cold start, logged-out, and app-not-installed paths.
- Validate domain ownership and avoid open redirects.
- Keep sensitive data out of URLs and logs.`,

  outputType: 'markdown',
}
