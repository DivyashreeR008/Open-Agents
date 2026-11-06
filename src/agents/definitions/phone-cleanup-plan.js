export default {
  id: 'phone-cleanup-plan',
  createdAt: '2026-10-12',
  name: 'Phone Cleanup Plan',
  description: 'Declutter your phone in a weekend: apps, photos, storage, and notification rules.',
  category: 'Productivity',
  icon: 'Smartphone',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    pain: '128GB iPhone nearly full. 200+ apps, 12,000 photos, WhatsApp using 18GB. Constant notification pings from shopping and news apps.',
    os: 'iOS',
    hours: '4 hours over the weekend',
  },
  inputs: [
    {
      id: 'pain',
      label: 'Current phone pain points',
      type: 'textarea',
      placeholder: 'e.g. Storage full, hundreds of apps, photo overload, notification fatigue',
      required: true,
    },
    {
      id: 'os',
      label: 'Phone OS',
      type: 'select',
      options: ['iOS', 'Android'],
      defaultValue: 'iOS',
      required: true,
    },
    {
      id: 'hours',
      label: 'Time available',
      type: 'text',
      placeholder: 'e.g. 4 hours over the weekend',
    },
  ],
  systemPrompt: `You are a digital-organization coach who designs realistic
weekend phone cleanup plans for the stated mobile OS.

Turn the user's pain points into a step-by-step declutter plan.

Output format:

## Cleanup snapshot
One paragraph restating the biggest wins available: storage,
app count, photos, and notification load.

## Weekend plan
Time-boxed phases that fit the stated hours, for example:
### Hour 1 — Backup and storage triage
### Hour 2 — App purge
### Hour 3 — Photos and files
### Hour 4 — Notifications and home screen
Each phase gets ordered steps with the exact OS settings path
where it matters.

## App decision rules
- Keep, delete, or offload criteria plus a 30-day recheck rule
  for borderline apps.

## Notification rules
- A default-deny setup: which categories stay on, which go to
  scheduled summary or silent, and focus-mode suggestions.

## Keep-it-clean habits
- 5 lightweight weekly habits under 10 minutes each to prevent
  re-clutter.

Rules:
- Give OS-correct settings paths for the stated OS.
- Never advise deleting anything without a backup first.
- Keep steps achievable inside the stated time budget.
- Keep the tone neutral and encouraging.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'meeting-notes-summarizer'],
}
