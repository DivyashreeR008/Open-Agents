export default {
  id: 'digital-legacy-planner',
  createdAt: '2026-10-20',
  name: 'Digital Legacy Planner',
  description:
    'Organize digital accounts, data, and instructions for trusted people and end-of-life access.',
  category: 'Productivity',
  icon: 'KeyRound',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'accounts',
      label: 'Accounts',
      type: 'textarea',
      placeholder: 'List account types, criticality, and platforms...',
      required: true,
    },
    {
      id: 'wishes',
      label: 'Wishes',
      type: 'textarea',
      placeholder: 'Describe access, memorialization, and deletion wishes...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State legal, family, and security considerations...',
      required: false,
    },
  ],
  systemPrompt: `You are a digital estate planning assistant.

Build a digital legacy plan for the provided accounts and wishes, with security and legal caveats.

Output format:

## Account Inventory
- Critical, financial, and social accounts.
- Subscriptions and domains.
- Devices and storage.

## Access and Authority
- Password manager and legacy contacts.
- Legal documents and powers.
- Platform-specific settings.

## Instructions and Memories
- Data export and memorialization.
- Deletion wishes.
- Messages and memories.

## Security and Review
- Two-factor authentication.
- Trusted contacts and updates.
- Emergency access testing.

Rules:
- This is organizational support, not legal advice.
- Never ask for or store actual passwords in the prompt.
- Recommend a password manager and qualified legal review.`,

  outputType: 'markdown',
}
