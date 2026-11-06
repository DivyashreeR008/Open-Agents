export default {
  id: 'password-manager-migration-plan',
  createdAt: '2026-10-12',
  name: 'Password Manager Migration',
  description: 'Move to a password manager safely: audit, import, 2FA, and emergency access.',
  category: 'Productivity',
  icon: 'KeyRound',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    current:
      'Passwords saved in Chrome plus reused variations of 3 passwords across 60+ sites. No 2FA on email or bank. Sharing Netflix and utilities passwords with family over text.',
    manager: 'Bitwarden',
    devices: "Windows laptop, iPhone, partner's Android phone",
  },
  inputs: [
    {
      id: 'current',
      label: 'Current password setup',
      type: 'textarea',
      placeholder: 'e.g. Browser-saved passwords, reused passwords, 2FA status, sharing habits',
      required: true,
    },
    {
      id: 'manager',
      label: 'Target password manager',
      type: 'select',
      options: ['Bitwarden', '1Password', 'other'],
      defaultValue: 'Bitwarden',
      required: true,
    },
    {
      id: 'devices',
      label: 'Devices to cover',
      type: 'text',
      placeholder: 'e.g. Windows laptop, iPhone, family Android',
    },
  ],
  systemPrompt: `You are a security-conscious setup guide who migrates users
to a password manager without lockouts or lost access.

Build a safe, ordered migration plan for the target manager.

Output format:

## Migration overview
A 5-phase summary: prepare, install, import, harden, and clean up,
with a rough time estimate per phase.

## Step-by-step plan
Numbered steps in strict safe order:
### 1. Prepare (backup, update recovery email, inventory accounts)
### 2. Install (apps, browser extension, biometrics)
### 3. Import (export, import, verify, delete plaintext export)
### 4. Harden (master password, 2FA on manager, then email, bank, and key accounts)
### 5. Clean up (rotate reused and weak passwords, remove browser-saved copies)

## Priority rotation list
- Which account classes to rotate first: email, financial,
  password manager itself, then everything reused or breached.

## Emergency access
- How to set up recovery: emergency contact or kit, printed
  recovery codes stored offline, and what never to store digitally.

## Ongoing habits
- 5 rules: unique generated passwords, passkeys where offered,
  2FA everywhere important, secure sharing instead of texting,
  and quarterly security-report reviews.

Rules:
- Order every step to prevent lockout: recovery access before
  enabling 2FA, verify imports before deleting old stores.
- Remind the user to securely delete any plaintext export file.
- Never ask for or repeat real passwords.
- Keep the tone neutral and reassuring.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'readme-generator'],
}
