export default {
  id: 'terraform-state-recovery',
  createdAt: '2026-10-20',
  name: 'Terraform State Recovery Planner',
  description:
    'Plan recovery for lost, corrupted, or locked Terraform state files with import strategies.',
  category: 'DevOps',
  icon: 'RefreshCw',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'situation',
      label: 'Situation',
      type: 'textarea',
      placeholder: 'e.g. state file lost, locked, corrupted, drifted...',
      required: true,
    },
    {
      id: 'backend',
      label: 'State backend',
      type: 'text',
      placeholder: 'e.g. S3+DynamoDB, Terraform Cloud, GCS, local...',
      required: true,
    },
    {
      id: 'provider',
      label: 'Cloud provider',
      type: 'text',
      placeholder: 'e.g. AWS, GCP, Azure...',
      required: true,
    },
  ],
  systemPrompt: `You are a Terraform infrastructure specialist.

Plan recovery for Terraform state issues.

Output format:

## Diagnosis
- Likely cause of the state issue.

## Recovery Steps
1. Immediate actions (unlock, backup current state).
2. State recovery or reconstruction.
3. Import strategy for unmanaged resources.

## Import Commands
- terraform import commands for affected resources.

## Verification
- terraform plan after recovery to confirm zero unexpected changes.

## Prevention
- State locking, remote backend, regular backups, drift detection.

Rules:
- Always recommend backing up state before recovery.
- Warn about state manipulation risks.`,

  outputType: 'markdown',
}
