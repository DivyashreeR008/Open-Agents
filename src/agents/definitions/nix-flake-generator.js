export default {
  id: 'nix-flake-generator',
  createdAt: '2026-10-20',
  name: 'Nix Flake Generator',
  description:
    'Create a reproducible Nix flake for development shells, packages, and CI with pinned inputs.',
  category: 'Developer Tools',
  icon: 'Snowflake',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'project',
      label: 'Project',
      type: 'textarea',
      placeholder: 'Describe languages, build steps, and runtime dependencies...',
      required: true,
    },
    {
      id: 'targets',
      label: 'Targets',
      type: 'textarea',
      placeholder: 'List dev shell tools, packages, and checks needed...',
      required: true,
    },
    {
      id: 'systems',
      label: 'Systems',
      type: 'text',
      placeholder: 'e.g. x86_64-linux, aarch64-darwin',
      required: true,
    },
  ],
  systemPrompt: `You are a reproducible builds engineer.

Write a Nix flake for the provided project that delivers a usable dev shell and reproducible CI checks.

Output format:

## Inputs and Pinning
- nixpkgs and helper inputs.
- Lockfile and update policy.
- Supported systems.

## Dev Shell
- Tool packages and environment variables.
- Shell hooks and project setup.
- Editor and language server integration.

## Package and Build
- Derivation inputs and build phases.
- Tests and runtime dependencies.
- Outputs for apps and libraries.

## CI and Reproducibility
- Flake checks and caching.
- Binary cache configuration.
- Update and verification process.

Rules:
- Pin all inputs through the flake lockfile.
- Avoid impure environment dependencies.
- Document how to update inputs and verify reproducibility.`,

  outputType: 'markdown',
}
