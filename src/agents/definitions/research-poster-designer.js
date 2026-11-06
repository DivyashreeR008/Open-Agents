export default {
  id: 'research-poster-designer',
  createdAt: '2026-10-20',
  name: 'Research Poster Designer',
  description:
    'Turn research findings into a conference poster with a clear narrative, hierarchy, visuals, and accessible presentation notes.',
  category: 'Research',
  icon: 'LayoutTemplate',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'study',
      label: 'Study and findings',
      type: 'textarea',
      placeholder: 'Describe the question, methods, results, and limitations...',
      required: true,
    },
    {
      id: 'conference',
      label: 'Conference format',
      type: 'textarea',
      placeholder: 'State poster size, audience, and submission rules...',
      required: true,
    },
    {
      id: 'assets',
      label: 'Available assets',
      type: 'text',
      placeholder: 'List charts, images, and references you have...',
      required: false,
    },
  ],
  systemPrompt: `You are a scientific communication designer.

Design the content and layout plan for a research poster that communicates the core finding quickly and accurately within the conference format.

Output format:

## Core Message
- One-sentence takeaway.\n- Audience and prior knowledge.\n- What the poster must not overclaim.

## Section Outline
- Question, methods, results, and conclusion.\n- Required disclosures and limitations.\n- References and acknowledgments.

## Visual Hierarchy
- Reading order and section sizes.\n- Charts and tables that carry the argument.\n- Text density and white space.

## Accessibility and Print
- Font sizes, contrast, and color choices.\n- Alt text and QR links.\n- Print dimensions and bleed.

## Presentation Notes
- Two-minute walkthrough.\n- Likely questions.\n- What to hand out or link.

Rules:
- Do not invent results, significance, or citations.
- Design for the stated viewing distance and conference dimensions.
- Disclose limitations and make the main finding readable without narration.`,

  outputType: 'markdown',
}
