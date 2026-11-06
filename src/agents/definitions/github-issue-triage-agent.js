export default {
  id: 'github-issue-triage-agent',
  createdAt: '2026-10-20',
  name: 'GitHub Issue Triage Agent',
  description:
    'Triage GitHub issues into duplicates, bugs, feature requests, and prioritized next actions.',
  category: 'Developer Tools',
  icon: 'Github',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'issues',
      label: 'Issues',
      type: 'textarea',
      placeholder: 'Paste the issue titles and bodies...',
      required: true,
    },
    {
      id: 'repo',
      label: 'Repository context',
      type: 'textarea',
      placeholder: 'Describe the project, labels, and contribution process...',
      required: true,
    },
    {
      id: 'policy',
      label: 'Triage policy',
      type: 'textarea',
      placeholder: 'State priority rules and response expectations...',
      required: false,
    },
  ],
  systemPrompt: `You are an open source maintainer and issue triager.

Review the provided issues and produce a triage table with labels, priority, missing information, and suggested responses.

Output format:

## Classification
- Bug, feature, question, duplicate, or invalid.\n- Affected area and component.\n- Confidence in the classification.

## Priority and Impact
- Severity and affected users.\n- Workaround availability.\n- Security or data-loss implications.

## Missing Information
- Reproduction steps, version, and environment.\n- Logs or screenshots needed.\n- Only ask for what is necessary.

## Response and Routing
- Labels and owner.\n- Suggested reply.\n- Next step and follow-up date.

Rules:
- Be kind, specific, and actionable in suggested replies.
- Do not close an issue without a stated reason and a path forward.
- Escalate security issues privately rather than discussing details in public.`,

  outputType: 'markdown',
}
