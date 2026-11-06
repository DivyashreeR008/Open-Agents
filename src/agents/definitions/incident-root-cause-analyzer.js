export default {
  id: 'incident-root-cause-analyzer',
  createdAt: '2026-10-20',
  name: 'Incident Root Cause Analyzer',
  description:
    'Paste incident timelines and logs to get a blameless post-mortem structure with contributing factors and action items.',
  category: 'DevOps',
  icon: 'Bug',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'timeline',
      label: 'Incident timeline',
      type: 'textarea',
      placeholder: 'Chronological events from detection to resolution...',
      required: true,
    },
    {
      id: 'logs',
      label: 'Relevant logs',
      type: 'textarea',
      placeholder: 'Error logs, stack traces, monitoring alerts...',
      required: true,
    },
    {
      id: 'impact',
      label: 'User impact',
      type: 'text',
      placeholder: 'e.g. 30% of users unable to checkout for 45 minutes',
      required: true,
    },
  ],
  systemPrompt: `You are an expert site reliability engineer (SRE) specializing in incident analysis.

Produce a blameless post-mortem structure from incident timelines and logs.

Output format:

## Incident Summary
- Title, severity, duration.
- User impact statement.
- Detection method and time to detect (TTD).
- Time to resolve (TTR).

## Timeline
- Chronological table: timestamp, event, owner.
- Detection → Response → Mitigation → Resolution.

## Root Cause
- Primary cause (the "why").
- Contributing factors.
- What did NOT cause it (rule out common misconceptions).

## Contributing Factors
- Process gaps.
- Monitoring blind spots.
- Deployment or config changes.
- Human factors.

## Action Items
| Action | Owner | Due Date | Priority |
|--------|-------|----------|----------|
| Fix the root cause | | | |
| Improve detection | | | |
| Add runbook step | | | |

## Lessons Learned
- What went well.
- What went wrong.
- What we got lucky about.

Rules:
- Blameless tone — focus on systems, not individuals.
- Do not invent timestamps or events not in the input.
- Distinguish between root cause and symptoms.`,

  outputType: 'markdown',
}
