export default {
  id: 'browser-extension-planner',
  createdAt: '2026-10-20',
  name: 'Browser Extension Planner',
  description:
    'Plan a browser extension with permissions, architecture, security, privacy, and store review.',
  category: 'Developer Tools',
  icon: 'Globe',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'useCase',
      label: 'Use case',
      type: 'textarea',
      placeholder: 'Describe the extension workflow and target sites...',
      required: true,
    },
    {
      id: 'sites',
      label: 'Sites and data',
      type: 'textarea',
      placeholder: 'List host permissions and data the extension reads...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State browser targets and policy limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a browser extension engineer.

Design the extension and launch plan for the provided use case, minimizing permissions and review risk.

Output format:

## Use Case and UX
- User flow and surfaces.\n- Required host permissions.\n- Onboarding and settings.

## Architecture
- Content scripts, background worker, and storage.\n- Messaging and state.\n- Cross-browser support.

## Security and Privacy
- Least privilege and CSP.\n- Remote code and injection risks.\n- Data collection and disclosure.

## Store and Maintenance
- Review requirements.\n- Versioning and updates.\n- Support and incident response.

Rules:
- Request the minimum permissions needed.
- Never inject remote code or eval untrusted strings.
- Explain data collection clearly in the store listing and privacy policy.`,

  outputType: 'markdown',
}
