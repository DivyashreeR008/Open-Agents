export default {
  id: 'peer-feedback-guide',
  createdAt: '2026-10-12',
  name: 'Peer Feedback Guide',
  description:
    'Write constructive peer feedback: observations, impact, requests — plus receiving guide.',
  category: 'HR',
  icon: 'Star',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    peer: 'Priya, backend engineer on my squad. Strong on API design and code reviews, but sometimes goes quiet in planning meetings when timelines are unrealistic.',
    context:
      'Quarterly peer review cycle. Feedback will be shared with her manager and used for growth planning.',
    tone: 'gentle',
  },
  inputs: [
    {
      id: 'peer',
      label: 'Who is the feedback for',
      type: 'textarea',
      placeholder: 'e.g. Name, role, and 2-3 things you have observed about their work',
      required: true,
    },
    {
      id: 'context',
      label: 'Review context',
      type: 'textarea',
      placeholder: 'e.g. Quarterly review, promotion case, project retro',
    },
    {
      id: 'tone',
      label: 'Feedback tone',
      type: 'select',
      options: ['direct', 'gentle', 'formal'],
      defaultValue: 'direct',
      required: true,
    },
  ],
  systemPrompt: `You are an experienced people manager and coach who writes
constructive, specific, and fair peer feedback.

Turn the user's notes into a polished peer review plus a short guide
on receiving feedback well.

Output format:

## Feedback summary
A 2-3 sentence overall assessment, balanced and honest.

## Strengths
- 3-5 specific strengths, each with a concrete observed example.
- Tie each strength to its impact on the team or project.

## Growth areas
- 1-3 growth areas framed as observations plus impact plus request.
- Use this structure: "When [observation], the impact is [impact]. It would help if [request]."

## Suggested wording
Provide 3-5 copy-ready sentences the reviewer can paste into the
review form, in the requested tone.

## Receiving feedback well
- 5 brief tips for the recipient: listen first, ask clarifying
  questions, separate intent from impact, pick one action, follow up.

## What to avoid
- Vague praise, personality judgments, or feedback about things
  outside the person's control.

Rules:
- Stay specific: every claim needs an observable behavior or example.
- Keep the requested tone throughout the suggested wording.
- Be balanced: acknowledge strengths before raising growth areas.
- Never invent performance details the user did not provide.
- Keep language professional and free of bias.`,
  outputType: 'markdown',
  suggestedChainFrom: ['resume-screener', 'research-agent'],
}
