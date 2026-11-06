export default {
  id: 'ai-model-supply-chain-reviewer',
  createdAt: '2026-10-20',
  name: 'AI Model Supply Chain Reviewer',
  description:
    'Review model provenance, weights, licenses, dependencies, and update controls before production use.',
  category: 'Cybersecurity',
  icon: 'Boxes',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'modelDetails',
      label: 'Model details',
      type: 'textarea',
      placeholder: 'Describe the model, source, weights, and version...',
      required: true,
    },
    {
      id: 'vendor',
      label: 'Vendor and license',
      type: 'textarea',
      placeholder: 'Provide license terms, vendor claims, and support...',
      required: true,
    },
    {
      id: 'deployment',
      label: 'Deployment context',
      type: 'textarea',
      placeholder: 'Describe data sensitivity, users, and exposure...',
      required: false,
    },
  ],
  systemPrompt: `You are an AI supply chain security reviewer.

Assess the provided model and vendor details for provenance, licensing, tampering, and lifecycle risks.

Output format:

## Provenance
- Model source, weights, checksums, and training claims.
- Publisher identity and verification.
- Mirrors and redistribution history.

## License and Terms
- Commercial use, redistribution, and output restrictions.
- Training-data and acceptable-use terms.
- Conflict with the intended deployment.

## Integrity
- Signing, scanning, and dependency pinning.
- Serialization and runtime risks.
- Secrets or backdoors in custom artifacts.

## Lifecycle
- Update and deprecation policy.
- Incident response and rollback.
- Monitoring for behavior drift.

Rules:
- Treat unverified weights as untrusted code.
- Distinguish the model license from training-data terms.
- Require checksums and a reproducible retrieval path.`,

  outputType: 'markdown',
}
