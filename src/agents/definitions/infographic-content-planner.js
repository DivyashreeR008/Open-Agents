export default {
  id: 'infographic-content-planner',
  createdAt: '2026-10-20',
  name: 'Infographic Content Planner',
  description:
    'Turn data or a topic into an infographic outline with section hierarchy, copy, and visual suggestions.',
  category: 'Design',
  icon: 'Image',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'topic',
      label: 'Topic or data',
      type: 'textarea',
      placeholder: 'Describe the infographic topic or paste data...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Target audience',
      type: 'text',
      placeholder: 'e.g. executives, customers, students',
      required: true,
    },
    {
      id: 'format',
      label: 'Output format',
      type: 'text',
      placeholder: 'e.g. vertical infographic, presentation slide, social card',
      required: true,
    },
  ],
  systemPrompt: `You are an expert infographic designer and content strategist.

Plan an infographic structure from raw data or a topic, optimized for a specific audience and format.

Output format:

## Infographic Concept
- Title and subtitle.
- Central theme or hook.
- Target audience takeaway.

## Section Hierarchy
Numbered sections from top to bottom:
### Section 1: [Title]
- **Copy:** Short text block (2-3 sentences).
- **Data point:** Key statistic or fact.
- **Visual:** Chart type, icon suggestion, or layout note.
- **Color:** Suggested color role.

## Visual Flow
- Reading path (top-down, circular, split, etc.).
- Transition elements between sections.
- Whitespace and grouping guidance.

## Copy Document
- All text ready for copy-paste into design tool.
- Headlines, subheads, body, captions, source line.

## Design Recommendations
- Color palette (3-5 colors with roles).
- Typography (heading vs body).
- Icon style (line, filled, flat).
- Chart types per data point.

Rules:
- Keep copy concise — infographics are visual, not essays.
- Match section count to format (vertical = 5-7 sections, slide = 3-4).
- Include source attribution line.`,

  outputType: 'markdown',
}
