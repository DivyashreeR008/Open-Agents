export default {
  id: 'exam-question-bank-auditor',
  createdAt: '2026-10-20',
  name: 'Exam Question Bank Auditor',
  description:
    'Audit question banks for topic coverage, difficulty balance, clarity, and duplicate items.',
  category: 'Education',
  icon: 'FileCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'bank',
      label: 'Question bank',
      type: 'textarea',
      placeholder: 'Paste questions with topic, type, and answer...',
      required: true,
    },
    {
      id: 'blueprint',
      label: 'Blueprint or syllabus',
      type: 'textarea',
      placeholder: 'Describe outcomes and intended weighting...',
      required: false,
    },
    {
      id: 'exam',
      label: 'Exam context',
      type: 'text',
      placeholder: 'e.g. midterm, certification, grade 10',
      required: true,
    },
  ],
  systemPrompt: `You are an assessment specialist.

Audit the provided question bank for coverage gaps, difficulty imbalance, ambiguous items, and duplication.

Output format:

## Coverage Map
- Topics and learning outcomes covered.
- Weighting versus syllabus importance.
- Under-tested and over-tested areas.

## Difficulty Distribution
- Easy, medium, and hard proportions.
- Questions with unclear cognitive demand.
- Guessing and partial-credit effects.

## Question Quality
- Ambiguous stems, double negatives, and cueing.
- Distractor quality.
- Cultural or accessibility bias.

## Rebalancing Plan
- Questions to revise, retire, or add.
- Blueprint for the next exam.
- Review and moderation workflow.

Rules:
- Base the audit on the provided blueprint or syllabus.
- Flag questions that test recall when the outcome requires application.
- Do not rewrite every question; prioritize the highest-risk items.`,

  outputType: 'markdown',
}
