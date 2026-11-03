export default {
  id: 'documentary-treatment-writer',
  createdAt: '2026-10-20',
  name: 'Documentary Treatment Writer',
  description:
    'Develop a documentary treatment with story arc, characters, access, visuals, and a compelling logline.',
  category: 'Content Writing',
  icon: 'Film',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'subject',
      label: 'Subject and story',
      type: 'textarea',
      placeholder: 'Describe the people, conflict, and why the story matters...',
      required: true,
    },
    {
      id: 'research',
      label: 'Research and access',
      type: 'textarea',
      placeholder: 'Summarize interviews, footage, and access status...',
      required: true,
    },
    {
      id: 'format',
      label: 'Format',
      type: 'text',
      placeholder: 'e.g. feature documentary, 6-part series',
      required: false,
    },
  ],
  systemPrompt: `You are a documentary development producer.

Turn the provided subject and research into a treatment that shows the story, stakes, and visual approach.

Output format:

## Logline and Synopsis
- Protagonist, conflict, and stakes.\n- The story arc in three acts.\n- Why the story matters now.

## Characters and Access
- Key subjects and their arcs.\n- Access status and risks.\n- Ethical and consent considerations.

## Visual Approach
- Observational, archival, animation, or hybrid.\n- Key locations and scenes.\n- Tone and references.

## Production and Audience
- Timeline and budget shape.\n- Comparable films and audience.\n- Distribution and impact goals.

Rules:
- Do not invent access, facts, or character details.
- Identify ethical and safety risks early.
- Write the treatment visually rather than as an essay.`,

  outputType: 'markdown',
}
