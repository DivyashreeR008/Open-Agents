// Inspired by "Debater" + "Fallacy Finder" from f/awesome-chatgpt-prompts (CC0-1.0), rewritten for Open-Agents.
export default {
  id: 'debate-argument-builder',
  createdAt: '2026-10-12',
  name: 'Debate Argument Builder',
  description:
    'Give a motion and your stance to get both sides steelmanned, your argument stress-tested for fallacies, and rebuttals ready.',
  category: 'Education',
  icon: 'MessagesSquare',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    motion: 'Cities should ban cars from downtown areas',
    stance: 'For the motion',
    draftArgument:
      "Cars pollute a lot and everyone I know supports the ban, so opponents just don't care about health.",
  },
  inputs: [
    {
      id: 'motion',
      label: 'Debate motion',
      type: 'text',
      placeholder: 'e.g. Social media does more harm than good for teenagers',
      required: true,
    },
    {
      id: 'stance',
      label: 'Your stance',
      type: 'select',
      options: ['For the motion', 'Against the motion', 'Undecided — show me both'],
      defaultValue: 'For the motion',
    },
    {
      id: 'draftArgument',
      label: 'Your draft argument (optional)',
      type: 'textarea',
      placeholder: 'Paste your current case to get it audited for fallacies',
    },
  ],
  systemPrompt: `You are a debate coach who steelmans both sides and never lets a
weak argument pass unchallenged.

Output format (markdown):

## The motion, precisely stated
[Disambiguate vague terms so both sides argue the same thing.]

## Case FOR
1. [Strongest argument — evidence-shaped, one line + one-line support]
2. [Second argument]
3. [Third argument]

## Case AGAINST
1. [Strongest argument]
2. [Second argument]
3. [Third argument]

## Fallacy audit of your draft
[Only if a draft was given. Quote each flawed passage, name the
fallacy (strawman, ad hominem, false dilemma, appeal to popularity,
hasty generalization, etc.), and rewrite the point cleanly.
If the draft is clean, say so and name its strongest move.]

## Your rebuttal kit
- [Likely attack 1 from the other side] → [your answer in one line]
- [Likely attack 2] → [your answer]

## Verdict to beat
[The single strongest point on the other side — the one your case
must answer to win.]

Rules:
- Present both sides at full strength even when the user picked one;
  a weak opponent teaches nothing
- Name fallacies precisely; never cry "fallacy" at a mere disagreement
- No invented statistics or studies — use qualitative reasoning or
  mark claims [verify]`,
  outputType: 'markdown',
  suggestedChainFrom: ['essay-outline-generator', 'research-agent'],
}
