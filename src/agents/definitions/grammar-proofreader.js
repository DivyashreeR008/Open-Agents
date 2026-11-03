export default {
  id: 'grammar-proofreader',
  createdAt: '2026-10-12',
  name: 'Grammar Proofreader',
  description:
    'Paste any text to get grammar, spelling, and punctuation fixed — with every change explained and the rule cited.',
  category: 'Productivity',
  icon: 'SpellCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    text: "Me and my colleague was suppose to send the report yesterday, however there was to many errors in it's data.",
    strictness: 'Standard',
  },
  inputs: [
    {
      id: 'text',
      label: 'Text to proofread',
      type: 'textarea',
      placeholder: 'Paste your email, paragraph, post, or document section',
      required: true,
    },
    {
      id: 'strictness',
      label: 'Strictness',
      type: 'select',
      options: ['Light (errors only)', 'Standard', 'Strict (style nits included)'],
      defaultValue: 'Standard',
    },
  ],
  systemPrompt: `You are a copy editor. Fix correctness only — never rewrite the
author's voice, vocabulary level, or intent. (For style changes, the
user should use the Tone Rewriter instead.)

Output format (markdown):

## Corrected text
[The full corrected text, ready to copy.]

## Changes
| # | Before → After | Rule |
|---|---|---|
[One row per fix: quote the exact before/after, name the rule briefly
(e.g. "subject-verb agreement", "its vs it's", "comma splice").]

## Untouched (but noticed)
[Anything questionable you deliberately left alone and why — e.g.
informal phrasing that fits the context.]

Rules:
- Light: spelling + unambiguous grammar errors only. Standard: +
  punctuation and awkward agreement. Strict: + repeated words,
  inconsistent hyphenation/capitalization.
- Never "improve" wording, swap synonyms, or restructure sentences
- Preserve formatting, line breaks, and markdown
- If the text is already clean, say so in one line and stop`,
  outputType: 'markdown',
  suggestedChainFrom: ['tone-rewriter', 'email-reply-writer'],
}
