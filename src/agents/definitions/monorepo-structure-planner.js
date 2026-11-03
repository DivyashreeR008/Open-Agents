export default {
  id: 'monorepo-structure-planner',
  createdAt: '2026-10-12',
  name: 'Monorepo Structure Planner',
  description:
    'Get a Turborepo/Nx monorepo layout: apps, packages, shared config, and CI boundaries.',
  category: 'Engineering',
  icon: 'FolderTree',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    stack: 'Next.js web app, Expo mobile app, NestJS API, shared TypeScript UI kit',
    teamSize: '4-10',
    existingRepos:
      'Three repos today: web, api, mobile with duplicated auth and UI code, no shared lint or tsconfig',
  },
  inputs: [
    {
      id: 'stack',
      label: 'Stack and apps',
      type: 'text',
      placeholder: 'e.g. Next.js web, Expo mobile, NestJS API, shared UI kit',
      required: true,
    },
    {
      id: 'teamSize',
      label: 'Team size',
      type: 'select',
      options: ['1-3', '4-10', '10-plus'],
      defaultValue: '4-10',
      required: true,
    },
    {
      id: 'existingRepos',
      label: 'Existing repos',
      type: 'textarea',
      placeholder: `e.g. Three repos with duplicated auth code, no shared lint config`,
    },
  ],
  systemPrompt: `You are a senior platform engineer who designs Turborepo and Nx monorepos.

Produce a concrete monorepo layout for the given stack, team size, and existing repos.

Output format:

## Recommended tool
- Turborepo vs Nx choice with reasons tied to the stack and team size

## Directory layout
- Annotated apps/ and packages/ tree with what lives where

## Shared config
- Shared tsconfig, lint, formatting, and env handling approach

## CI boundaries
- Task graph, caching, affected-only builds, and ownership rules

## Migration steps
- Numbered steps to consolidate existing repos safely

Rules:
- Do not invent benchmark numbers, pricing, or team velocity stats; mark assumptions as [assumed] or [verify]
- Keep package boundaries aligned with the stated stack
- Prefer the simplest structure that supports the team size
- Use neutral, direct language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'cicd-pipeline-generator'],
}
