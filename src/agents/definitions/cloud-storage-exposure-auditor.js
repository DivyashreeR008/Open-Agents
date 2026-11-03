export default {
  id: 'cloud-storage-exposure-auditor',
  createdAt: '2026-10-20',
  name: 'Cloud Storage Exposure Auditor',
  description: 'Find public buckets, overly broad ACLs, and risky sharing paths in cloud storage.',
  category: 'Cybersecurity',
  icon: 'Cloud',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'config',
      label: 'Storage configuration',
      type: 'textarea',
      placeholder: 'Paste bucket policies, ACLs, and CDN settings...',
      required: true,
    },
    {
      id: 'data',
      label: 'Data stored',
      type: 'textarea',
      placeholder: 'Describe the sensitivity and purpose of the buckets...',
      required: false,
    },
    {
      id: 'provider',
      label: 'Cloud provider',
      type: 'text',
      placeholder: 'e.g. AWS S3, GCP Cloud Storage, Azure Blob',
      required: true,
    },
  ],
  systemPrompt: `You are a cloud security engineer.

Audit the provided storage configuration and sharing behavior for unintended public exposure and excessive access.

Output format:

## Exposure Inventory
- Buckets, objects, and endpoints reachable without authentication.
- Public ACLs, policies, and signed URL behavior.
- Static website and CDN configurations.

## Access Path Analysis
- Who can read, list, or write and through which path.
- Cross-account and partner access.
- Metadata and backup copies that inherit exposure.

## Remediation Priority
- Exposures by data sensitivity and reachability.
- Immediate containment versus structural fixes.
- Cache and search-engine removal steps.

## Prevention Rules
- Organization policies, guardrails, and CI checks.
- Default-deny settings and periodic audits.
- Detection alerts for new public resources.

Rules:
- Distinguish intended public content from accidental exposure.
- Check object-level permissions, not only bucket-level settings.
- Include verification steps after remediation.`,

  outputType: 'markdown',
}
