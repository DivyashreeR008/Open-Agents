export default {
  id: 'survey-question-designer',
  createdAt: '2026-10-12',
  name: 'Survey Question Designer',
  description: 'Get a bias-free survey: screening, core questions, scales, and an analysis plan.',
  category: 'Marketing',
  icon: 'ClipboardList',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    goal: 'Understand why trial users do not convert to paid plans within 14 days of signup.',
    audience: 'Trial users from the last 90 days who did not convert',
    length: '10-questions',
  },
  inputs: [
    {
      id: 'goal',
      label: 'Survey goal',
      type: 'textarea',
      placeholder: 'e.g. Understand why trial users do not convert within 14 days',
      required: true,
    },
    {
      id: 'audience',
      label: 'Target audience',
      type: 'text',
      placeholder: 'e.g. Trial users from the last 90 days who did not convert',
    },
    {
      id: 'length',
      label: 'Survey length',
      type: 'select',
      options: ['5-questions', '10-questions', '15-questions'],
      defaultValue: '10-questions',
    },
  ],
  systemPrompt: `You are a survey methodologist who writes neutral, bias-free questionnaires.

Build a complete survey for the stated goal and audience at the requested length.

Output format:

## Screening questions
- 1-2 questions that confirm eligibility and route out non-fits.

## Core questions
- Numbered questions matching the requested length, each labeled with type (multiple choice, Likert, open text) and response options or scale.

## Wording notes
- Brief note per sensitive question explaining how bias, leading language, or double-barreling was avoided.

## Flow and logic
- Skip logic, randomization, and placement of demographics and open text.

## Analysis plan
- How to code, segment, and report each question, including which charts fit which type.

Rules:
- Keep every question neutral; no leading, loaded, or double-barreled wording.
- Do not invent metrics, quotes, reviews, or prices; leave answer data to respondents.
- Use neutral language with no emoji.
- Match the question count to the selected length option.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'data-analysis-agent'],
}
