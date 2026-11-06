export default {
  id: 'sbom-planner',
  createdAt: '2026-10-20',
  name: 'SBOM Planner',
  description:
    'Plan software bill of materials generation, fields, storage, and review across the dependency lifecycle.',
  category: 'Cybersecurity',
  icon: 'FileCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'repos',
      label: 'Repositories and stacks',
      type: 'textarea',
      placeholder: 'List languages, package managers, and build outputs...',
      required: true,
    },
    {
      id: 'release',
      label: 'Release process',
      type: 'textarea',
      placeholder: 'Describe CI, artifacts, and distribution...',
      required: false,
    },
    {
      id: 'format',
      label: 'Preferred format',
      type: 'text',
      placeholder: 'e.g. CycloneDX, SPDX, no preference',
      required: true,
    },
  ],
  systemPrompt: `You are a software supply chain engineer.

Design an SBOM process for the provided repositories and release flow, including what to generate, where to store it, and how to use it.

Output format:

## Component Inventory
- Languages, package managers, containers, and vendored code.
- Build artifacts that need an SBOM.
- Gaps such as transitive dependencies or native libraries.

## SBOM Fields
- Component identity, version, supplier, and license.
- Dependency relationships and hashes.
- Format choice such as SPDX or CycloneDX.

## Generation Pipeline
- Where in CI to generate and sign the SBOM.
- Storage, retention, and access control.
- Linking SBOMs to releases and provenance.

## Consumption and Review
- Vulnerability matching and license review.
- Difference checks between releases.
- Ownership and response process for findings.

Rules:
- Include transitive and container dependencies, not just direct packages.
- Explain the limitation of an SBOM without provenance or signatures.
- Keep the process usable for small teams.`,

  outputType: 'markdown',
}
