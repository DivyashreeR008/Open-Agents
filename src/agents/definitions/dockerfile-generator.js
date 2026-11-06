export default {
  id: 'dockerfile-generator',
  createdAt: '2026-10-11',
  name: 'Dockerfile Generator',
  description:
    "Describe your app's stack and get a production-ready multi-stage Dockerfile with a non-root user, layer caching, and a .dockerignore.",
  category: 'Engineering',
  icon: 'Container',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    stack: 'Node.js 20 Express API with Prisma',
    packageManager: 'npm',
    port: '3000',
    extras: 'Needs Sharp (native deps) and a healthcheck endpoint at /health',
  },
  inputs: [
    {
      id: 'stack',
      label: 'App stack',
      type: 'text',
      placeholder: 'e.g. Python 3.12 FastAPI app, Go 1.22 service, Node.js 20 Express API',
      required: true,
    },
    {
      id: 'packageManager',
      label: 'Package manager',
      type: 'select',
      options: [
        'npm',
        'yarn',
        'pnpm',
        'pip',
        'poetry',
        'go modules',
        'bundler',
        'maven',
        'Not applicable',
      ],
      defaultValue: 'npm',
    },
    {
      id: 'port',
      label: 'Port the app listens on',
      type: 'text',
      placeholder: 'e.g. 3000',
    },
    {
      id: 'extras',
      label: 'Extra requirements (optional)',
      type: 'textarea',
      placeholder:
        'e.g. Native dependencies, GPU access, healthcheck endpoint, static files to serve',
    },
  ],
  systemPrompt: `You are a DevOps engineer who writes minimal, secure, production-ready Dockerfiles.

Given the app stack, generate:
1. A multi-stage Dockerfile (build stage + slim runtime stage)
2. A matching .dockerignore
3. Brief notes on: why each stage exists, layer-cache ordering
   (dependencies before source), the non-root user, and EXPOSE vs -p

Rules:
- Pin base image versions (never :latest)
- Copy lockfiles first, install dependencies, then copy source
- Run as a non-root user in the final stage
- Use .dockerignore to exclude node_modules, .git, local env files, caches
- Keep the final image as small as reasonable for the stack
- If the port is provided, EXPOSE it; note that -p is still needed at runtime

Output format (markdown):

## Dockerfile
\`\`\`dockerfile
[Dockerfile]
\`\`\`

## .dockerignore
\`\`\`
[.dockerignore]
\`\`\`

## Notes
- [short bullets: caching, user, size, healthcheck if applicable]

If a requirement is ambiguous, pick the conventional default for the
stack and note the assumption in one line.`,
  outputType: 'markdown',
  suggestedChainFrom: ['env-doc-generator', 'cicd-pipeline-generator'],
}
