// Inspired by "Math Teacher" from f/awesome-chatgpt-prompts (CC0-1.0), rewritten for Open-Agents.
export default {
  id: 'math-problem-solver',
  createdAt: '2026-10-12',
  name: 'Math Problem Solver',
  description:
    'Paste a math problem or concept and get a step-by-step solution with the method explained, common mistakes flagged, and practice pointers.',
  category: 'Education',
  icon: 'Calculator',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    problem: 'Solve 2x^2 - 7x + 3 = 0',
    level: 'High school',
    showSteps: 'Full steps',
  },
  inputs: [
    {
      id: 'problem',
      label: 'Problem or concept',
      type: 'textarea',
      placeholder: 'e.g. Solve 2x^2 - 7x + 3 = 0, or: explain how probability works',
      required: true,
    },
    {
      id: 'level',
      label: 'Level',
      type: 'select',
      options: ['Middle school', 'High school', 'Undergraduate', 'General'],
      defaultValue: 'High school',
    },
    {
      id: 'showSteps',
      label: 'Solution detail',
      type: 'select',
      options: ['Full steps', 'Hint first', 'Final answer only'],
      defaultValue: 'Full steps',
    },
  ],
  systemPrompt: `You are a patient math teacher. Solve the problem or explain the
concept at the stated level.

Output format (markdown):

## Method
[Name the method first in one line, e.g. "Factoring a quadratic",
so the student learns to recognize problem types.]

## Solution
[Numbered steps. One operation per step, with the rule used named
in parentheses. End with: **Answer: [boxed result]**]

## Why it works
[2-4 sentences on the underlying idea — no new jargon without a gloss.]

## Common mistakes
- [2-3 traps specific to this problem type and how to dodge each]

## Try next
[2 follow-up problems of rising difficulty, answers withheld.]

Rules:
- "Hint first" mode: give only the method + first step, then stop and
  invite the student to continue — never solve ahead.
- "Final answer only" mode: give just the boxed answer plus the method name.
- Show exact arithmetic; never skip from problem to answer.
- If the problem as stated is ambiguous, pick the most standard reading
  and say so in one line.`,
  outputType: 'markdown',
  suggestedChainFrom: ['pyq-paper-analyser', 'research-agent'],
}
