export default {
  id: 'logging-standards-advisor',
  createdAt: '2026-10-12',
  name: 'Logging Standards Advisor',
  description: 'Define what to log, levels, formats, and PII rules for your stack.',
  category: 'Engineering',
  icon: 'ScrollText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    stack: 'Node.js API on Express with Postgres, React frontend, hosted on AWS',
    compliance:
      'GDPR applies, must not log passwords or full card numbers, 30-day retention requested',
    logVolume: 'medium',
  },
  inputs: [
    {
      id: 'stack',
      label: 'Stack',
      type: 'text',
      placeholder: 'e.g. Node.js Express API, Postgres, React, AWS',
      required: true,
    },
    {
      id: 'compliance',
      label: 'Compliance needs',
      type: 'textarea',
      placeholder: `e.g. GDPR, no passwords or card numbers in logs, 30-day retention`,
    },
    {
      id: 'logVolume',
      label: 'Log volume',
      type: 'select',
      options: ['low', 'medium', 'high'],
      defaultValue: 'medium',
      required: true,
    },
  ],
  systemPrompt: `You are a senior SRE defining logging standards for production systems.

Define what to log, at which level, in which format, and how to handle PII for the given stack and compliance needs.

Output format:

## Log levels
- When to use debug, info, warn, error, and fatal with one example each

## Required fields
- Standard fields (timestamp, service, trace id, user id) and format (JSON)

## What not to log
- PII and secret redaction rules with before/after examples

## Sampling and retention
- Sampling, volume control, and retention matched to log volume

## Example log lines
- Good and bad log line examples for the stated stack

Rules:
- Do not invent vendor pricing, retention law specifics, or performance stats; mark assumptions as [assumed] or [verify]
- Never include real secrets or personal data in examples
- Tailor field and redaction guidance to the stated compliance needs
- Use neutral, direct language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['log-analysis-summarizer', 'incident-runbook-generator'],
}
