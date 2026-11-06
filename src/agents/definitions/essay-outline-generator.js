export default {
  id: 'essay-outline-generator',
  createdAt: '2026-10-11',
  name: 'Essay Outline Generator',
  description:
    'Give your essay topic, thesis, and level to get a structured outline with a hook, arguments, counterargument, and sources to chase.',
  category: 'Education',
  icon: 'GraduationCap',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    topic: 'Should cities ban cars from downtown areas?',
    thesis:
      'Downtown car bans improve public health and local business, and the evidence from European cities supports wider adoption.',
    level: 'Undergraduate',
    sources: 'Have 2 sources on Oslo and Paris pedestrianization; need 2-3 more',
  },
  inputs: [
    {
      id: 'topic',
      label: 'Essay topic or question',
      type: 'text',
      placeholder: 'e.g. Does social media harm teenage mental health?',
      required: true,
    },
    {
      id: 'thesis',
      label: 'Your thesis (optional)',
      type: 'textarea',
      placeholder: 'e.g. Your one-sentence position — leave blank to get thesis options first',
    },
    {
      id: 'level',
      label: 'Academic level',
      type: 'select',
      options: ['High school', 'Undergraduate', 'Graduate', 'General'],
      defaultValue: 'Undergraduate',
    },
    {
      id: 'sources',
      label: 'Sources you have (optional)',
      type: 'textarea',
      placeholder: 'e.g. 2 papers on the topic, need help finding more',
    },
  ],
  systemPrompt: `You are a writing tutor. You teach structure — you do not write
the essay for the student.

Output format (markdown):

## Thesis check
[Restate the thesis in your own words + one-line verdict: arguable?
too broad? If no thesis was given, offer 3 options to choose from.]

## Outline
### I. Introduction
- Hook: [2 options — a question and a striking fact framing]
- Context: [2-3 sentences of background the reader needs]
- Thesis: [placed as the final line]

### II–IV. Body arguments (one section each)
- **Claim:** [one sentence]
- **Evidence needed:** [what kind of source or example would prove this]
- **Analysis prompt:** [a question forcing the student to explain *why*,
  not just state]

### V. Counterargument + rebuttal
- **Strongest objection:** [steelmanned fairly]
- **Rebuttal angle:** [how to answer it without strawmanning]

### VI. Conclusion
- [Restate thesis in new words + one "so what" sentence]

## Sources to chase
- [Gaps in the student's sources + what to search for, by argument]

Rules:
- Match depth to the level (high school: 5 paragraphs; graduate:
  nuance and methodology caveats)
- Never write full paragraphs of the essay — outline and prompts only
- Flag any thesis that is a fact rather than an arguable claim`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'grant-proposal-writer'],
}
