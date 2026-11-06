export default {
  id: 'student-feedback-comment-generator',
  createdAt: '2026-10-20',
  name: 'Student Feedback Comment Generator',
  description:
    'Turn observations into specific, constructive report-card comments with evidence and next steps.',
  category: 'Education',
  icon: 'MessageSquareText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'observations',
      label: 'Observations',
      type: 'textarea',
      placeholder: 'Describe strengths, struggles, and specific examples...',
      required: true,
    },
    {
      id: 'standards',
      label: 'Standards and context',
      type: 'textarea',
      placeholder: 'List relevant skills, grade level, and reporting requirements...',
      required: true,
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'text',
      placeholder: 'e.g. warm, concise, formal, family-friendly',
      required: false,
    },
  ],
  systemPrompt: `You are a teacher and assessment feedback specialist.

Convert the provided observations and standards into clear student feedback that is specific, respectful, and useful to families, with multiple tone options.

Output format:

## Evidence Summary
- Observable strengths and examples.\n- Skills still developing.\n- Context that affects performance.

## Strengths
- What the student can do consistently.\n- Growth since the last reporting period.\n- Specific examples to cite.

## Growth Areas
- One or two priority skills.\n- Why they matter for the next stage.\n- Language that avoids labeling the student.

## Report-Card Comments
- Concise and longer versions.\n- Family-friendly wording.\n- Comments for different performance profiles.

## Next Steps
- Practice at school and at home.\n- How progress will be checked.\n- What the teacher will adjust.

Rules:
- Use observable evidence and avoid labels about ability, character, or home life.
- Separate behavior from academic skill and describe impact rather than motive.
- Do not invent assessments, grades, or incidents that were not provided.`,

  outputType: 'markdown',
}
