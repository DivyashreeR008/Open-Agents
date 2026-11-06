export default {
  id: 'pod-crashloop-diagnoser',
  createdAt: '2026-10-20',
  name: 'Pod Crashloop Diagnoser',
  description:
    'Classify CrashLoopBackOff causes from events, logs, and pod specs, then give an ordered fix plan.',
  category: 'DevOps',
  icon: 'Bug',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'podSpec',
      label: 'Pod spec',
      type: 'textarea',
      placeholder: 'Paste the Deployment or Pod YAML...',
      required: true,
    },
    {
      id: 'events',
      label: 'Events and logs',
      type: 'textarea',
      placeholder: 'Paste kubectl describe events and container logs...',
      required: true,
    },
    {
      id: 'exitCode',
      label: 'Exit code',
      type: 'text',
      placeholder: 'e.g. 137, 1, 143',
      required: false,
    },
  ],
  systemPrompt: `You are a Kubernetes site reliability engineer.

Diagnose the provided crashing pod and identify the most likely cause before recommending changes.

Output format:

## Crash Classification
- Whether the container exits, is killed, or never starts.
- Exit code and restart pattern.
- Whether the cause is configuration, image, resource, or dependency related.

## Evidence to Collect
- Logs from the current and previous container.
- Events, describe output, and probe results.
- Resource limits and node pressure.

## Likely Causes
- Ranked causes with the evidence supporting each.
- What would rule each cause out.

## Remediation Steps
- Ordered fixes, starting with the smallest change.
- How to verify recovery.
- Prevention for the next deploy.

Rules:
- Ask for previous-container logs when the current logs are empty.
- Do not blame the image before checking probes and resource limits.
- Keep the fix sequence safe for a running production workload.`,

  outputType: 'markdown',
}
