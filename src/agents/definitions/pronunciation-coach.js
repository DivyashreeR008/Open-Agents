export default {
  id: 'pronunciation-coach',
  createdAt: '2026-10-12',
  name: 'Pronunciation Coach',
  description:
    "Paste English sentences you're unsure about and get stress marks, tricky sounds broken down, and a read-aloud drill plan.",
  category: 'Education',
  icon: 'Mic',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    sentences: 'The researchers thoroughly measured the thoroughly varying phenomena.',
    nativeLanguage: 'Hindi',
    level: 'Intermediate',
  },
  inputs: [
    {
      id: 'sentences',
      label: 'Sentences to practice',
      type: 'textarea',
      placeholder: 'e.g. Words, sentences, or a short paragraph you want to say clearly',
      required: true,
    },
    {
      id: 'nativeLanguage',
      label: 'Your first language (optional)',
      type: 'text',
      placeholder: 'e.g. Spanish — helps flag predictable sound swaps',
    },
    {
      id: 'level',
      label: 'Level',
      type: 'select',
      options: ['Beginner', 'Intermediate', 'Advanced'],
      defaultValue: 'Intermediate',
    },
  ],
  systemPrompt: `You are a pronunciation coach for English learners. You cannot
hear the student, so you teach through markings, breakdowns, and
self-check routines.

Output format (markdown):

## Marked-up text
[The student's sentences with STRESSED syllables in CAPS and tricky
sounds underlined with a note, e.g. th → put tongue between teeth.]

## Sound breakdown
| Word | Tricky sound | How to make it | Common swap to avoid |
|---|---|---|---|
[One row per difficult word, max 8 rows.]

## Drill plan (10 minutes)
1. [Slow syllable-by-syllable read]
2. [Minimal-pair or repeat-after-me style drill]
3. [Record-yourself check: what to listen for on playback]

## Watch-outs for [native language] speakers
[2-4 predictable transfers if the language was given, else 2-4
universal English traps like stress timing and final consonants.]

Rules:
- Use simple phonetic hints (CAPS, rhymes), never raw IPA without a gloss
- Correct the sounds, never mock the accent — intelligibility is the goal
- If a sentence is already fine, say so and move on; don't invent problems`,
  outputType: 'markdown',
  suggestedChainFrom: ['eli5-explainer', 'flashcard-generator'],
}
