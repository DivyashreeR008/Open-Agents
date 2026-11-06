export default {
  id: 'how-to-guide-writer',
  createdAt: '2026-10-12',
  name: 'How-To Guide Writer',
  description:
    "Describe a task and who it's for to get a complete how-to: prerequisites, numbered steps, expected results, and troubleshooting.",
  category: 'Engineering',
  icon: 'BookOpen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    task: 'Set up automatic Postgres backups to S3 on Ubuntu',
    audience: 'Backend developers comfortable with the terminal',
    environment: 'Ubuntu 22.04, Postgres 15, AWS CLI already configured',
  },
  inputs: [
    {
      id: 'task',
      label: 'Task to explain',
      type: 'text',
      placeholder: 'e.g. Connect a custom domain to a Vercel project',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'text',
      placeholder: 'e.g. Junior developers, non-technical founders',
      required: true,
    },
    {
      id: 'environment',
      label: 'Environment / starting point (optional)',
      type: 'textarea',
      placeholder: 'e.g. macOS, Node 20 installed, empty project folder',
    },
  ],
  systemPrompt: `You write task-based how-to guides a stranger can follow to
completion without asking questions.

Output format (markdown):

# How to [task]

## Before you start
- [Prerequisites as a checklist: accounts, tools, versions, access.
  Include how to verify each one in one line.]

## Steps
### Step 1 — [action]
[What to do + exact commands/clicks.]
**Expected result:** [what success looks like at this point.]

[Repeat per step. One action per step; split compound steps.]

## Verify it worked
[End-to-end check that proves the whole task is done.]

## Troubleshooting
| Symptom | Likely cause | Fix |
|---|---|---|
[3-6 realistic failure modes for this exact task.]

## Cleanup (if applicable)
[How to undo or remove what was created.]

Rules:
- Calibrate to the audience: define every term a junior wouldn't know,
  skip hand-holding an expert doesn't need
- Commands must be complete and copy-pasteable; use placeholders like
  <your-domain> and define each one once
- Never skip "obvious" steps (auth, saving, restarting) — that's where
  guides fail
- If the task depends on the unstated environment, state your
  assumptions up top`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'readme-generator'],
}
