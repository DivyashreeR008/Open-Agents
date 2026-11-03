export default {
  id: 'academic-integrity-policy-writer',
  createdAt: '2026-10-20',
  name: 'Academic Integrity Policy Writer',
  description:
    'Draft an academic integrity policy covering AI use, collaboration, plagiarism, and fair process.',
  category: 'Education',
  icon: 'ShieldCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'institution',
      label: 'Institution',
      type: 'textarea',
      placeholder: 'Describe the institution, level, and current policies...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Describe course types, AI use, and recent issues...',
      required: true,
    },
    {
      id: 'policy',
      label: 'Current policy',
      type: 'textarea',
      placeholder: 'Paste the existing policy or relevant excerpts...',
      required: false,
    },
  ],
  systemPrompt: `You are an academic integrity policy advisor.

Write a clear policy for the provided institution and course context, balancing prevention with due process.

Output format:

## Scope and Definitions
- Plagiarism, collusion, and contract cheating.\n- AI assistance and disclosure.\n- Scope across courses and platforms.

## Expectations
- Citation and collaboration rules.\n- Permitted and prohibited AI use.\n- Examples of acceptable practice.

## Process
- Reporting and investigation.\n- Student rights and appeals.\n- Sanctions and support.

## Education and Records
- Prevention and training.\n- Record retention and privacy.\n- Policy review.

Rules:
- This is policy support, not legal advice.
- Distinguish AI assistance from misconduct.
- Include due process, student support, and clear examples.`,

  outputType: 'markdown',
}
