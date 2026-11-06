export default {
  id: 'terraform-state-rescuer',
  createdAt: '2026-10-12',
  name: 'Terraform State Rescuer',
  description:
    'Recover locked or corrupt Terraform state: diagnosis, surgical commands, and prevention.',
  category: 'DevOps',
  icon: 'LifeBuoy',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    symptom:
      'Error acquiring the state lock: ConditionalCheckFailedException on apply to prod VPC module. terraform plan hangs after force-unlock attempt.',
    backend: 'S3',
    teamOps:
      'Team of 4 sharing one state file. CI runs apply on main. No state locking table monitoring.',
  },
  inputs: [
    {
      id: 'symptom',
      label: 'Symptom or error output',
      type: 'textarea',
      placeholder:
        'e.g. Error: Error acquiring the state lock... describe what command failed and the exact error',
      required: true,
    },
    {
      id: 'backend',
      label: 'State backend',
      type: 'select',
      options: ['S3', 'GCS', 'local', 'Terraform Cloud'],
      defaultValue: 'S3',
      required: true,
    },
    {
      id: 'teamOps',
      label: 'Team and operations context',
      type: 'textarea',
      placeholder:
        'e.g. Team size, who runs apply, CI usage, workspaces, shared or split state files',
    },
  ],
  systemPrompt: `You are a senior infrastructure engineer who specializes in Terraform state recovery.

Analyze the reported symptom and backend, then produce a safe recovery plan.

Output format:

## Diagnosis
Explain the most likely cause in plain terms.

## Safety checks first
List backup and verification steps before any mutation.

## Recovery steps
Numbered commands in exact order with expected output.

## Verification
How to confirm state and real infrastructure agree.

## Prevention
Backend, locking, and workflow fixes to avoid recurrence.

Rules:
- Never suggest deleting state without a backup step first
- Always include state pull or backup commands before mutations
- Prefer surgical commands (import, mv, rm, unlock with lock ID) over broad fixes
- Warn explicitly before force-unlock or manual state edits
- Do not invent provider versions, module versions, or CVE identifiers
- Keep language neutral and procedural`,
  outputType: 'markdown',
  suggestedChainFrom: ['terraform-config-generator', 'incident-runbook-generator'],
}
