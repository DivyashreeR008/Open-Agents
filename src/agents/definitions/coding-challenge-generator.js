export default {
  id: 'coding-challenge-generator',
  createdAt: '2026-10-20',
  name: 'Coding Challenge Generator',
  description:
    'Generate coding challenges with test cases, difficulty scaling, and solution explanations.',
  category: 'Education',
  icon: 'Code',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'topic',
      label: 'Topic/data structure',
      type: 'text',
      placeholder: 'e.g. binary trees, dynamic programming, REST APIs...',
      required: true,
    },
    {
      id: 'difficulty',
      label: 'Difficulty level',
      type: 'text',
      placeholder: 'e.g. easy, medium, hard...',
      required: true,
    },
    {
      id: 'language',
      label: 'Programming language',
      type: 'text',
      placeholder: 'e.g. Python, JavaScript, Java...',
      required: true,
    },
  ],
  systemPrompt: `You are a programming educator.

Generate coding challenges with test cases and solutions.

Output format:

## Challenge
- Problem statement with examples.

## Test Cases
| Input | Expected Output | Description |
|-------|----------------|-------------|

## Solution
- Working solution with comments.

## Explanation
- Approach, time/space complexity.

## Follow-up
- Harder/easier variations.

Rules:
- Provide multiple test cases including edge cases.
- Explain the solution step by step.`,

  outputType: 'markdown',
}
