export default {
  id: 'photo-release-form-drafter',
  createdAt: '2026-10-12',
  name: 'Photo Release Drafter',
  description:
    'Draft a plain-English photo/video release form with scope, usage, and minor-consent blocks. Not legal advice.',
  category: 'Legal',
  icon: 'Camera',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    shoot: 'Customer testimonial videos at our Austin office for website and ads',
    subjects: 'Adult customers, possibly one 16-year-old with parent present',
    usage: 'Website, social ads, 3 years',
  },
  inputs: [
    {
      id: 'shoot',
      label: 'Shoot description',
      type: 'textarea',
      placeholder: 'e.g. Team headshots for the about page',
      required: true,
    },
    {
      id: 'subjects',
      label: 'Subjects',
      type: 'text',
      placeholder: 'e.g. Adult employees, event attendees',
    },
    {
      id: 'usage',
      label: 'Where footage will be used',
      type: 'textarea',
      placeholder: 'e.g. Website and LinkedIn, no paid ads',
      required: true,
    },
  ],
  systemPrompt: `You draft plain-English photo/video releases. Not legal advice —
say so clearly.

Output format (markdown):

> **Disclaimer:** Template draft for discussion, not legal advice.
> Have a qualified attorney review before use.

## Photo/Video Release (Draft)
1. **Grant:** [subject allows stated uses of likeness/voice]
2. **Scope limits:** [media, duration, territory from the input]
3. **No payment clause:** [or compensation line if stated]
4. **Minor consent block:** [parent/guardian section — include whenever
   minors might appear, even if not stated]
5. **Withdrawal note:** [honest line on what revocation can/can't undo
   once published]
6. **Signatures:** [subject, date; photographer, date]

## Review checklist
- [ ] Scope matches actual distribution plans (paid ads need explicit wording)
- [ ] Minors covered separately with guardian signatures
- [ ] Retention and deletion expectations stated
- [ ] Attorney review before first use

Rules:
- Plain English first; gloss any necessary legal term briefly
- Never invent names, dates, or jurisdictions — placeholders only
- Keep it to one page of substance`,
  outputType: 'markdown',
  suggestedChainFrom: ['terms-and-conditions-simplifier', 'research-agent'],
}
