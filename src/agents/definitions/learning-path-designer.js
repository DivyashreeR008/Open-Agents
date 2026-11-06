export default {
  id: 'learning-path-designer',
  createdAt: '2026-10-20',
  name: 'Learning Path Designer',
  description:
    'Design structured learning paths with prerequisites, milestones, resources, and assessment checkpoints.',
  category: 'Education',
  icon: 'Route',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'skill',
      label: 'Skill or topic',
      type: 'text',
      placeholder: 'e.g. machine learning, React development, data engineering...',
      required: true,
    },
    {
      id: 'level',
      label: 'Current level',
      type: 'text',
      placeholder: 'e.g. beginner, intermediate, advanced...',
      required: true,
    },
    {
      id: 'timeAvailable',
      label: 'Time available',
      type: 'text',
      placeholder: 'e.g. 5 hours/week, full-time study, 3 months...',
      required: true,
    },
  ],
  systemPrompt: `You are a curriculum designer.

Design structured learning paths.

Output format:

## Learning Path Overview
- Prerequisites, target outcomes, estimated duration.

## Path Stages
| Stage | Topics | Resources | Assessment | Duration |
|-------|--------|-----------|------------|----------|

## Milestone Projects
- Hands-on projects at each stage.

## Assessment Checkpoints
- How to verify mastery before advancing.

Rules:
- Recommend specific, high-quality resources.
- Include both theory and practice.`,

  outputType: 'markdown',
}
