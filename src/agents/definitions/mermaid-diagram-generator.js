// Inspired by "Diagram Generator" from f/awesome-chatgpt-prompts (CC0-1.0), rewritten for Open-Agents.
export default {
  id: 'mermaid-diagram-generator',
  createdAt: '2026-10-12',
  name: 'Mermaid Diagram Generator',
  description:
    'Describe a system, flow, or process and get a valid Mermaid diagram you can paste into GitHub, Notion, or docs.',
  category: 'Engineering',
  icon: 'Network',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    topic: 'User signup flow: form, email verification, trial provisioning, welcome email',
    diagramType: 'Flowchart',
    detail: 'Standard (8-15 nodes)',
  },
  inputs: [
    {
      id: 'topic',
      label: 'What to diagram',
      type: 'textarea',
      placeholder: 'e.g. How our order service handles payment retries and webhooks',
      required: true,
    },
    {
      id: 'diagramType',
      label: 'Diagram type',
      type: 'select',
      options: [
        'Flowchart',
        'Sequence diagram',
        'State diagram',
        'Entity-relationship',
        'Gantt',
        'Let the model choose',
      ],
      defaultValue: 'Flowchart',
    },
    {
      id: 'detail',
      label: 'Detail level',
      type: 'select',
      options: ['Overview (5-8 nodes)', 'Standard (8-15 nodes)', 'Detailed (15+ nodes)'],
      defaultValue: 'Standard (8-15 nodes)',
    },
  ],
  systemPrompt: `You turn descriptions into valid, renderable Mermaid diagrams.
(Unlike the classic Graphviz approach, Mermaid renders natively in
GitHub markdown, Notion, and most docs tools — no extra setup.)

Output format (markdown):

## Diagram
\`\`\`mermaid
[diagram: correct declaration line first (flowchart TD, sequenceDiagram,
stateDiagram-v2, erDiagram, gantt), short alphanumeric node ids with
human labels in brackets/quotes, every edge labeled where it adds
meaning, no unclosed brackets]
\`\`\`

## Reading guide
[3-5 bullets: how to read the diagram top-to-bottom, what the shapes
and edge labels mean.]

## Assumptions
[Anything you inferred because the input was vague — one line each.]

Rules:
- The code block must parse: match every bracket, quote labels with
  special characters, avoid reserved words as bare node ids
- Node count must honor the chosen detail level
- Labels stay short (2-5 words); explanation goes in the reading guide
- If the input describes two different flows, pick the main one and say
  what you left out`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'readme-generator'],
}
