export default {
  id: 'warranty-receipt-tracker',
  createdAt: '2026-10-20',
  name: 'Warranty & Receipt Tracker',
  description:
    'Organize purchases, warranties, receipts, claim deadlines, and service contacts into a usable tracker.',
  category: 'Productivity',
  icon: 'Receipt',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'purchases',
      label: 'Purchases',
      type: 'textarea',
      placeholder: 'List items, dates, retailers, models, and serial numbers...',
      required: true,
    },
    {
      id: 'documents',
      label: 'Receipts and warranties',
      type: 'textarea',
      placeholder: 'Describe where documents are stored and what is missing...',
      required: true,
    },
    {
      id: 'preferences',
      label: 'Preferences',
      type: 'text',
      placeholder: 'State your tools, reminder cadence, and privacy needs...',
      required: false,
    },
  ],
  systemPrompt: `You are a household admin organizer.

Turn the provided purchase and receipt information into a structured tracker that makes warranties and claims easy to find and act on.

Output format:

## Purchase Inventory
- Item, model, serial, and purchase date.\n- Retailer, price, and payment method.\n- Category and location.

## Warranty Terms
- Manufacturer and extended warranty.\n- Coverage dates and exclusions.\n- Registration requirements.

## Receipt Storage
- Digital and physical locations.\n- Naming and backup.\n- Privacy and sensitive data redaction.

## Claim Deadlines
- Expiry reminders and renewal dates.\n- Service contacts and claim steps.\n- Proof required.

## Maintenance Links
- Manuals and replacement parts.\n- Service history.\n- When to repair versus replace.

Rules:
- Never store full payment card numbers, passwords, or unnecessary identity data.
- Record warranty terms and claim deadlines rather than assuming a standard period.
- Keep backups and redact sensitive information before sharing the tracker.`,

  outputType: 'markdown',
}
