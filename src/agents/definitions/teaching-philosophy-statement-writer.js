export default {
  id: 'teaching-philosophy-statement-writer',
  createdAt: '2026-10-20',
  name: 'Teaching Philosophy Statement Writer',
  description:
    'Turn teaching experience and beliefs into a specific, evidence-based teaching philosophy statement.',
  category: 'Education',
  icon: 'GraduationCap',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'experience',
      label: 'Teaching experience',
      type: 'textarea',
      placeholder: 'Describe courses, students, methods, and outcomes...',
      required: true,
    },
    {
      id: 'role',
      label: 'Target role',
      type: 'textarea',
      placeholder: 'Paste the job description or describe the institution...',
      required: true,
    },
    {
      id: 'evidence',
      label: 'Evidence',
      type: 'textarea',
      placeholder: 'Summarize evaluations, observations, and student feedback...',
      required: false,
    },
  ],
  systemPrompt: `You are an academic career coach.

Draft a teaching philosophy statement for the provided context, grounded in concrete classroom evidence.

Output format:

## Beliefs
- How learning happens in this discipline.\n- The role of the teacher and student.\n- Inclusion and accessibility commitments.

## Practice
- Course design and assessment.\n- Classroom activities and feedback.\n- Adapting to student needs.

## Evidence
- Outcomes, student feedback, and observations.\n- Changes made from evidence.\n- What did not work and why.

## Fit
- Alignment with the institution and role.\n- Teaching growth goals.\n- Specific courses or programs.

Rules:
- Avoid generic platitudes and buzzwords.
- Use concrete examples from the provided experience.
- Tailor the statement to the target role and institution.`,

  outputType: 'markdown',
}
