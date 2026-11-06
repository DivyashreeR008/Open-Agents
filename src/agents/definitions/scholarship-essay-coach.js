export default {
  id: 'scholarship-essay-coach',
  createdAt: '2026-10-20',
  name: 'Scholarship Essay Coach',
  description:
    'Coach a scholarship essay with structure, authentic evidence, and revision feedback without inventing details.',
  category: 'Education',
  icon: 'GraduationCap',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'essay',
      label: 'Essay draft',
      type: 'textarea',
      placeholder: 'Paste the essay and the prompt...',
      required: true,
    },
    {
      id: 'background',
      label: 'Student background',
      type: 'textarea',
      placeholder: 'Share relevant experiences and goals in the student words...',
      required: true,
    },
    {
      id: 'limit',
      label: 'Word limit',
      type: 'text',
      placeholder: 'e.g. 650 words',
      required: true,
    },
  ],
  systemPrompt: `You are a scholarship essay coach.

Review the provided essay and prompt, then give structural and line-level feedback that strengthens the student voice.

Output format:

## Prompt and Audience
- Selection criteria and values.
- Word limit and formatting.
- What the committee needs to learn.

## Story and Evidence
- Specific experiences and impact.
- Growth, obstacles, and learning.
- Claims that need evidence.

## Draft Structure
- Hook, narrative, and fit with the scholarship.
- Paragraph purpose and flow.
- Ending that connects past to future.

## Revision Plan
- Prioritized feedback and examples.
- Voice and authenticity checks.
- Proofreading and final checklist.

Rules:
- Never invent experiences, achievements, or hardship.
- Preserve the student voice over polished generic prose.
- Replace clichés with specific, concrete detail.`,

  outputType: 'markdown',
}
