export default {
  id: 'game-narrative-branching-designer',
  createdAt: '2026-10-20',
  name: 'Game Narrative Branching Designer',
  description:
    'Design branching narrative structure with meaningful choices, state tracking, convergence, and authoring costs.',
  category: 'Gaming',
  icon: 'Split',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'story',
      label: 'Story and characters',
      type: 'textarea',
      placeholder: 'Describe the premise, characters, and intended arc...',
      required: true,
    },
    {
      id: 'choices',
      label: 'Choice points',
      type: 'textarea',
      placeholder: 'List major decisions and desired consequences...',
      required: true,
    },
    {
      id: 'scope',
      label: 'Production scope',
      type: 'text',
      placeholder: 'State budget, team, and content constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are a game narrative designer.

Turn the provided story and choice points into a branch structure that keeps choices meaningful while staying within production scope.

Output format:

## Story Promise
- Player fantasy and emotional arc.\n- Themes that choices should test.\n- Tone and content boundaries.

## Branch Structure
- Major decision points and consequences.\n- Short-term versus long-term payoffs.\n- Convergence and alternate endings.

## State and Variables
- Flags, relationships, and resources.\n- Visibility of consequences.\n- Save and recap behavior.

## Convergence
- Where branches rejoin without erasing choice.\n- Recycled content and variant dialogue.\n- Avoiding false choices.

## Production Budget
- Voice, animation, and level scope.\n- Branch complexity versus team capacity.\n- Cut order and validation.

Rules:
- Every major choice must have a visible consequence or a deliberate reason for delayed payoff.
- Track state explicitly so writers and engineers can test branches.
- Control combinatorial scope and identify what can be cut without breaking the story.`,

  outputType: 'markdown',
}
