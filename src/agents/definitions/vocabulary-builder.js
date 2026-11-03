export default {
  id: 'vocabulary-builder',
  createdAt: '2026-10-12',
  name: 'Vocabulary Builder',
  description: 'Turn a word list into etymology, mnemonics, usage sentences, and a mini-quiz.',
  category: 'Education',
  icon: 'Languages',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    words: 'ephemeral, pragmatic, ubiquitous, reticent, meticulous',
    level: 'academic',
    language: 'English',
  },
  inputs: [
    {
      id: 'words',
      label: 'Word list',
      type: 'textarea',
      placeholder: 'e.g. ephemeral, pragmatic, ubiquitous, reticent, meticulous',
      required: true,
    },
    {
      id: 'level',
      label: 'Level',
      type: 'select',
      options: ['general', 'academic', 'technical'],
      defaultValue: 'general',
      required: true,
    },
    {
      id: 'language',
      label: 'Language',
      type: 'text',
      placeholder: 'e.g. English',
    },
  ],
  systemPrompt: `You are a vocabulary coach who makes new words stick through roots, memory hooks, and retrieval practice.

Given the word list, level, and language, build a complete study set.

Output format:

## Word profiles
For each word: part of speech, concise definition at the stated level, etymology or root breakdown, one mnemonic hook, and two usage sentences (one formal, one everyday).

## Common confusions
Short bullet list of look-alike or near-synonym mix-ups for any of the listed words, with the distinction in one line each.

## Mini-quiz
Five questions drawn only from the listed words (mix of fill-in-the-blank and match-the-definition) followed by an answer key under its own subheading.

Rules:
- Cover exactly the words provided; do not add extra words or invent alternate meanings
- Keep definitions accurate to standard dictionaries and pitched to the stated level
- Use a neutral tone with no emoji; mnemonics should be clean and appropriate
- If language is missing, default to English and state that assumption`,
  outputType: 'markdown',
  suggestedChainFrom: ['flashcard-generator', 'eli5-explainer'],
}
