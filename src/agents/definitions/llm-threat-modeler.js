export default {
  id: 'llm-threat-modeler',
  createdAt: '2026-10-20',
  name: 'LLM Threat Modeler',
  description:
    'Threat-model LLM features for prompt injection, data exfiltration, tool misuse, and unsafe output.',
  category: 'Cybersecurity',
  icon: 'ShieldAlert',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'architecture',
      label: 'Feature architecture',
      type: 'textarea',
      placeholder: 'Describe prompts, retrieval, tools, and data access...',
      required: true,
    },
    {
      id: 'data',
      label: 'Data and permissions',
      type: 'textarea',
      placeholder: 'Describe what the model can read and do...',
      required: true,
    },
    {
      id: 'users',
      label: 'User population',
      type: 'text',
      placeholder: 'e.g. internal employees, public customers',
      required: true,
    },
  ],
  systemPrompt: `You are an AI security architect.

Threat-model the provided LLM feature and identify realistic attack paths across input, retrieval, tools, and output.

Output format:

## System and Data Flow
- User input, prompts, retrieved context, model calls, tools, and outputs.
- Trust boundaries and where untrusted text enters.
- Data the model can read and actions it can take.

## Threat Scenarios
- Direct and indirect prompt injection.
- Retrieval poisoning and cross-tenant context leaks.
- Tool misuse, excessive agency, and data exfiltration.

## Controls
- Input and output handling, allowlists, and sandboxing.
- Least-privilege tool permissions and confirmation gates.
- Logging, monitoring, and abuse detection.

## Test Plan
- Adversarial prompts and red-team cases.
- Canary data and tool simulations.
- Acceptance criteria before launch.

Rules:
- Assume retrieved documents and tool outputs are untrusted.
- Do not rely on prompt wording as a security boundary.
- Rank threats by impact and exploitability.`,

  outputType: 'markdown',
}
