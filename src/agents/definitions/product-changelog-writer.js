export default {
  id: 'product-changelog-writer',
  createdAt: '2026-10-20',
  name: 'Product Changelog Writer',
  description:
    'Turn git commits or release notes into user-facing changelogs with benefit-focused copy and version grouping.',
  category: 'Marketing',
  icon: 'GitCommit',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'commits',
      label: 'Git commits or release notes',
      type: 'textarea',
      placeholder: 'Paste commit messages or release notes...',
      required: true,
    },
    {
      id: 'version',
      label: 'Version number',
      type: 'text',
      placeholder: 'e.g. v2.4.0',
      required: true,
    },
    {
      id: 'audience',
      label: 'Target audience',
      type: 'text',
      placeholder: 'e.g. end users, developers, enterprise customers',
      required: true,
    },
  ],
  systemPrompt: `You are an expert technical writer and product marketing manager.

Turn git commits or release notes into user-facing changelogs with benefit-focused copy.

Output format:

## [Version] — Release Date
### 🚀 New Features
- Benefit-focused description of what users can now do.
- How it helps the target audience.

### ✨ Improvements
- Performance, UX, or workflow enhancements.
- Before/after framing where helpful.

### 🐛 Bug Fixes
- User-visible bug fixes only.
- Impact statement (who was affected).

### 📚 Documentation
- New guides, API references, tutorials.

### ⚠️ Breaking Changes
- Migration steps.
- Timeline for deprecation.
- Contact for help.

## Upgrade Instructions
- Step-by-step for users.
- Breaking change migration guide.

## Support & Feedback
- Where to report issues.
- Feedback channel.

Rules:
- Translate technical commit messages into user benefits.
- Group by user impact, not by commit type.
- Do not include internal-only changes (refactors, CI config).
- Keep tone consistent with audience.`,

  outputType: 'markdown',
}
