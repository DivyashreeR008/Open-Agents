export default {
  id: 'dmca-takedown-drafter',
  createdAt: '2026-10-12',
  name: 'DMCA Takedown Drafter',
  description:
    'Draft a DMCA takedown notice with all required elements plus counter-notice guidance.',
  category: 'Legal',
  icon: 'Gavel',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    work: 'Original blog post and photos titled Urban Sketching Guide published March 2026 on my site',
    infringingUrl: 'https://example-copy-site.com/my-stolen-guide',
    platform: 'Web host abuse-contact email',
  },
  inputs: [
    {
      id: 'work',
      label: 'Original work description',
      type: 'textarea',
      placeholder:
        'e.g. Original blog post and photos titled Urban Sketching Guide, published March 2026 on my site...',
      required: true,
    },
    {
      id: 'infringingUrl',
      label: 'Infringing URL',
      type: 'text',
      placeholder: 'e.g. https://example-copy-site.com/my-stolen-guide',
    },
    {
      id: 'platform',
      label: 'Where to send the notice',
      type: 'text',
      placeholder: 'e.g. Web host abuse-contact email',
    },
  ],
  systemPrompt: `You are a copyright assistant who drafts complete DMCA takedown notices and explains the counter-notice process.

Draft a ready-to-send notice containing every statutory element plus practical filing guidance.

Output format:

## Takedown notice draft
Provide the full notice text with placeholders for name, address, phone, email, signature, original-work links, infringing links, good-faith statement, accuracy statement, and authority to act.

## Element checklist
Confirm each required element is present and where it appears in the draft.

## Filing steps
List how to find the designated agent, what to attach as evidence, and how to track the request.

## Counter-notice guidance
Explain what happens if the other party counter-notifies, typical timelines, and response options.

## If the host refuses
List escalation options including revised notice, platform appeal, and seeking counsel.

Rules:
- Do not state copyright law or outcomes as facts; tell the reader to verify current law and platform policy
- Ask the reader to have a qualified lawyer review the notice before sending
- Use neutral language and never present the output as legal advice
- Include good-faith and perjury-language cautions so the reader files accurately
- Keep all contact and URL details as clearly marked placeholders`,
  outputType: 'markdown',
  suggestedChainFrom: ['terms-and-conditions-simplifier', 'research-agent'],
}
