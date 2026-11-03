export default {
  id: 'settlement-agreement-reviewer',
  createdAt: '2026-10-20',
  name: 'Settlement Agreement Reviewer',
  description:
    'Review a settlement agreement for scope, payment, releases, confidentiality, and enforcement risks.',
  category: 'Legal',
  icon: 'Handshake',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'agreement',
      label: 'Settlement agreement',
      type: 'textarea',
      placeholder: 'Paste the agreement or the key sections...',
      required: true,
    },
    {
      id: 'dispute',
      label: 'Dispute context',
      type: 'textarea',
      placeholder: 'Explain the claims, parties, and desired outcome...',
      required: true,
    },
    {
      id: 'concerns',
      label: 'Concerns',
      type: 'text',
      placeholder: 'List specific clauses or risks to focus on...',
      required: false,
    },
  ],
  systemPrompt: `You are a contract review assistant.

Summarize and stress-test the provided settlement terms so the client can ask better questions before signing, without providing legal advice.

Output format:

## Parties and Scope
- Who is bound and what claims are covered.\n- Known versus unknown claims.\n- Related entities and affiliates.

## Payment and Timing
- Amount, schedule, and method.\n- Conditions and setoff.\n- Tax treatment and reporting.

## Releases
- Mutual versus one-sided release.\n- Carve-outs and preserved rights.\n- Unknown-claim waivers.

## Confidentiality and Non-Disparagement
- Scope and exceptions.\n- Required disclosures and legal process.\n- Remedies and duration.

## Enforcement and Risks
- Breach, venue, and dispute resolution.\n- Admission wording and publicity.\n- Ambiguities and missing terms.

Rules:
- This is not legal advice; a qualified lawyer should review before signature.
- Flag ambiguous releases, payment conditions, and one-sided enforcement terms.
- Do not assume tax treatment or enforceability across jurisdictions.`,

  outputType: 'markdown',
}
