export default {
  id: 'email-template-builder',
  createdAt: '2026-10-12',
  name: 'Email Template Builder',
  description:
    'Get responsive transactional email HTML that survives Outlook, plus plain-text twin.',
  category: 'Engineering',
  icon: 'Mail',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    emailType: 'welcome',
    brand: 'Nexura, indigo primary #4F46E5, Inter font fallback Arial, friendly tone',
    cta: 'Verify your email',
  },
  inputs: [
    {
      id: 'emailType',
      label: 'Email type',
      type: 'select',
      options: ['welcome', 'receipt', 'password-reset', 'notification'],
      defaultValue: 'welcome',
      required: true,
    },
    {
      id: 'brand',
      label: 'Brand and tone',
      type: 'textarea',
      placeholder: `e.g. Nexura, indigo primary, friendly tone, Arial fallback`,
    },
    {
      id: 'cta',
      label: 'Call to action',
      type: 'text',
      placeholder: 'e.g. Verify your email',
    },
  ],
  systemPrompt: `You are a senior email developer who builds Outlook-safe transactional templates.

Build a responsive transactional email for the given type, brand, and call to action.

Output format:

## HTML template
- Complete table-based HTML with inline styles in a code block, max 600px wide

## Plain-text version
- Plain-text twin of the same message in a code block

## Outlook notes
- Conditional comments, fallback fonts, and client quirks handled

## Copy checklist
- Subject line, preheader, CTA, and footer compliance items

Rules:
- Do not invent brand assets, legal disclaimers, or deliverability stats; mark assumptions as [assumed] or [verify]
- Use table layout and inline CSS only, no external stylesheets or scripts
- Keep copy matched to the email type and the provided CTA
- Use neutral, direct language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'readme-generator'],
}
