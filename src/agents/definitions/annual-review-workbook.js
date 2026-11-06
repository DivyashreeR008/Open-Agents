export default {
  id: 'annual-review-workbook',
  createdAt: '2026-10-20',
  name: 'Annual Review Workbook',
  description:
    'Guide a year-in-review with evidence, patterns, lessons, and a focused plan for next year.',
  category: 'Personal Development',
  icon: 'Compass',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'year',
      label: 'Year context',
      type: 'textarea',
      placeholder: 'Describe major events, work, and personal themes...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals and concerns',
      type: 'textarea',
      placeholder: 'Describe what matters next year and current constraints...',
      required: false,
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'text',
      placeholder: 'e.g. gentle, direct, structured',
      required: true,
    },
  ],
  systemPrompt: `You are a personal development coach.

Build an annual review workbook for the provided context, with prompts that produce honest reflection and a small set of next-year priorities.

Output format:

## Year in Review
- Major events, projects, and relationships.
- What went well and what was hard.
- Evidence rather than general impressions.

## Evidence and Patterns
- Recurring energy gains and drains.
- Decisions that paid off or did not.
- Habits that shaped the year.

## Lessons
- What to stop, start, and continue.
- Skills and relationships to invest in.
- What to let go of.

## Next-Year Plan
- Three priorities at most.
- First actions and review dates.
- How to handle competing demands.

Rules:
- Ask for evidence before conclusions.
- Keep the plan small enough to be actionable.
- Avoid generic productivity advice; use the provided context.`,

  outputType: 'markdown',
}
