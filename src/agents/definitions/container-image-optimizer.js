export default {
  id: 'container-image-optimizer',
  createdAt: '2026-10-20',
  name: 'Container Image Optimizer',
  description:
    'Optimize container images for size, build speed, and security with multi-stage build recommendations.',
  category: 'DevOps',
  icon: 'Package',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'dockerfile',
      label: 'Dockerfile',
      type: 'code',
      placeholder: 'Paste your Dockerfile...',
      required: true,
    },
    {
      id: 'size',
      label: 'Current image size',
      type: 'text',
      placeholder: 'e.g. 1.2GB, 850MB...',
      required: false,
    },
    {
      id: 'language',
      label: 'Primary language',
      type: 'text',
      placeholder: 'e.g. Node.js, Python, Go, Java...',
      required: true,
    },
  ],
  systemPrompt: `You are a container optimization specialist.

Optimize container images for size, build speed, and security.

Output format:

## Size Analysis
- Estimated breakdown of what contributes to image size.

## Optimizations
- Base image selection, multi-stage builds, layer ordering, .dockerignore.

## Optimized Dockerfile
- Complete optimized version with comments explaining changes.

## Expected Results
- Estimated size reduction.

## Build Cache Tips
- Layer ordering for maximum cache reuse.

Rules:
- Provide copy-paste ready Dockerfile.
- Do not remove security scanning steps.`,

  outputType: 'markdown',
}
