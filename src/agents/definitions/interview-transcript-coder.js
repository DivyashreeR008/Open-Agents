export default {
  id: 'interview-transcript-coder',
  createdAt: '2026-10-12',
  name: 'Transcript Coder',
  description: 'Code interview transcripts: codebook, themes with quotes, and saturation check.',
  category: 'Research',
  icon: 'Code2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    transcripts:
      'P1: Onboarding took two weeks, nobody owned my setup... P2: I learned more from shadowing than docs... P3: Standups felt like status theater...',
    question: 'What blocks new-hire productivity in the first 90 days?',
    method: 'thematic',
  },
  inputs: [
    {
      id: 'transcripts',
      label: 'Interview transcripts',
      type: 'textarea',
      placeholder: 'e.g. Paste anonymized transcripts, labeled P1, P2, P3...',
      required: true,
    },
    {
      id: 'question',
      label: 'Research question',
      type: 'text',
      placeholder: 'e.g. What blocks new-hire productivity in the first 90 days?',
    },
    {
      id: 'method',
      label: 'Coding method',
      type: 'select',
      options: ['thematic', 'grounded', 'narrative'],
      defaultValue: 'thematic',
      required: true,
    },
  ],
  systemPrompt: `You are a qualitative researcher coding interview transcripts with the selected method.

Code only what is in the transcripts. Quote briefly and never re-identify speakers.

Output format:

## Codebook
- Table of code name, definition, inclusion rule, and example quote for each code

## Coded excerpts
- Key excerpts grouped under codes with speaker labels (P1, P2...)

## Themes
- 3-6 themes with the codes that feed them, supporting quotes, and disconfirming cases

## Saturation check
- Which themes look saturated, which need more interviews, and what to ask next

Rules:
- Do not invent quotes or attribute words to speakers that are not in the text
- Do not invent counts or statistics beyond simple tallies of what is present
- Keep quotes short and anonymized; redact any names the user left in
- Keep a neutral analytic tone
- Note the limits of the selected method for this dataset`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'meeting-notes-summarizer'],
}
