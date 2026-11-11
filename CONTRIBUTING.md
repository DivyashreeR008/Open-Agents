# Contributing to Open-Agents

Thank you for your interest in contributing to Open-Agents! This document guidelines the process for contributing.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## What to Work On

Before picking an issue or proposing a new feature, please review our [Roadmap & Priorities](ROADMAP.md). It outlines what is actively being built, what is prioritized for the current season, and specific areas where we are looking for contributor help.

## Development Process

1. **Fork the repository** - Click the "Fork" button on the top right of the GitHub page
2. **Create a branch** - `git checkout -b feature/your-feature-name`
3. **Make changes** - Implement your feature or fix
4. **Verify your changes** - Run `npm run verify` to run the full verification suite (tests, production build, and bundle-size budgets)
5. **Commit your changes** - Use clear, descriptive commit messages
6. **Push to your fork** - `git push origin feature/your-feature-name`
7. **Submit a Pull Request** - Describe what you changed, complete the PR template checklist, and target `main`. Automated CI status checks will run immediately; once green, a maintainer/codeowner will review your changes for merge (see [Merge Requirements](MERGE_REQUIREMENTS.md)).

### Pre-Commit Hooks (Husky & lint-staged)

Git hooks are managed with [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged). They install automatically when you run `npm install` (via the `prepare` script in `package.json`).

On every commit, Husky triggers lint-staged to run on staged files only:

- JavaScript and JSX files (`*.{js,jsx,mjs}`) are checked with ESLint (`eslint --fix`) and formatted with Prettier (`prettier --write`).
- Other configuration and documentation files (`*.{json,css,html,md,yml,yaml}`) are formatted with Prettier.

#### Skipping Hooks in Emergencies

If you need to bypass the pre-commit hook in an emergency (for example, saving a temporary WIP commit or an urgent fix), pass the `--no-verify` flag to `git commit`:

```bash
git commit -m "emergency commit" --no-verify
```

## Adding an Agent

Agent definitions are JavaScript modules in `src/agents/definitions/`. The registry
discovers every `.js` file in that folder, so you do not need to edit a central
import list. Start from the existing definition that is closest to your idea.

### 1. Create the definition

Use a unique kebab-case `id` and give the file the same name. For example,
`release-notes-writer.js` should export an object with
`id: 'release-notes-writer'`. This is a complete, valid definition:

```js
export default {
  id: 'release-notes-writer',
  createdAt: '2026-11-11',
  name: 'Release Notes Writer',
  description:
    'Turn merged pull request titles into short, user-facing release notes grouped by change type.',
  category: 'Engineering',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'openai',
  outputType: 'markdown',
  inputs: [
    {
      id: 'changes',
      label: 'Merged changes',
      type: 'textarea',
      placeholder: 'Paste one pull request title per line',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'select',
      options: ['End users', 'Developers', 'Internal team'],
      defaultValue: 'End users',
      required: true,
    },
  ],
  exampleInputs: {
    changes: '- Add CSV export\n- Fix duplicate reminder emails',
    audience: 'End users',
  },
  systemPrompt: `You are a release manager. Group the supplied changes by
feature, improvement, and fix. Write in the present tense, name the user
benefit, and do not invent changes that are not in the input.`,
}
```

The test suite enforces the following contract:

| Field             | Requirement                                      | Notes                                                                                                                                  |
| ----------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `id`              | Non-empty, unique string                         | Use kebab-case and match the filename. Duplicate IDs fail the contract test.                                                           |
| `name`            | Non-empty string                                 | Shown on the agent card and detail page.                                                                                               |
| `description`     | Non-empty string                                 | One sentence that explains the outcome, not the implementation.                                                                        |
| `systemPrompt`    | Non-empty string                                 | Give the model its role, output structure, constraints, and refusal rules.                                                             |
| `inputs`          | Array, possibly empty                            | Input `id` values must be unique within the definition. Every input needs a non-empty `id` and `label`, plus a supported `type`.       |
| `outputType`      | `markdown`, `text`, or `json`                    | Required on every definition. Use `markdown` unless plain text or structured JSON is materially better.                                |
| `category`        | One value from `CATEGORIES`                      | The list lives in `src/agents/categories.js`. Do not invent a category without updating that module.                                   |
| `icon`            | A `lucide-react` export name                     | Examples: `FileText`, `Code`, `Shield`, `ChartBar`. Unknown names fall back to `Bot`; the icon test reports names that do not resolve. |
| `provider`        | `any` or a supported provider                    | Use `any` unless the agent requires a specific model family.                                                                           |
| `defaultProvider` | `openai`, `anthropic`, `gemini`, or `openrouter` | Optional. Used when `provider` is `any`.                                                                                               |
| `model`           | A value listed in `MODELS`                       | Optional. `MODELS` lives in `src/lib/resolveAgentModel.js`. Omit it to use the provider default instead of copying a stale model name. |
| `createdAt`       | ISO date such as `2026-11-11`                    | Optional. Drives the "new" badge for seven days, so use the date the agent is added.                                                   |
| `exampleInputs`   | Object, keys must match input IDs                | Optional. Values should be valid choices for select and multiselect inputs.                                                            |

Supported input types:

| Type          | Rendered as             | Additional rules                                                                 |
| ------------- | ----------------------- | -------------------------------------------------------------------------------- |
| `text`        | Single-line input       | Use for short values such as a name, URL, or ticket number.                      |
| `textarea`    | Multi-line input        | Use for prompts, notes, drafts, and pasted content.                              |
| `code`        | Code editor             | Use for source code, queries, configuration, diffs, and logs.                    |
| `select`      | Single-choice dropdown  | Requires a non-empty `options` array. Set `defaultValue` to one of the options.  |
| `multiselect` | Multiple-choice control | Requires a non-empty `options` array. Set `defaultValue` to an array of choices. |

Options may be strings or `{ value, label }` objects. Use objects when the stored
value differs from the text shown to users. `required`, `placeholder`, and
`defaultValue` are optional per input.

### 2. Add it to the agent index

Add one row to the visible table in `AGENTS.md` above the
`Add new agents above this line` marker. Use the next number and copy the name,
description, and category from the definition. Keep the existing column order.

### 3. Validate the change

Run the focused tests first:

```bash
npx vitest run src/agents/registry.contract.test.jsx src/agents/icons.test.js
```

The contract test checks required strings, duplicate agent and input IDs,
supported input types, option shapes, and `exampleInputs` keys. It also mounts
every definition through `AgentRunner`. The icon test checks that every named
icon resolves.

Then run the repository checks:

```bash
npm run lint
npm run format:check
npm run verify
```

`npm run verify` runs the full test suite, a production build, and the bundle-size
budget check. It can take several minutes. A new agent should pass without
changing test thresholds or bundle budgets.

### 4. Submit the pull request

Open the pull request against `main`, link the issue it resolves, and complete
the PR template. Include a screenshot or recording when the new agent changes
the visible UI, and add an entry under `[Unreleased]` in `CHANGELOG.md` for
user-facing additions. Keep the branch up to date with `upstream/main` until it
is merged.

## Merge Requirements & Quality Gates

What every pull request must pass before it can merge into `main` is formally documented in [MERGE_REQUIREMENTS.md](MERGE_REQUIREMENTS.md).

In summary, every change must satisfy:

- **Automated CI Status Checks**:
  - `CI` workflow (`.github/workflows/ci.yml`): Unit & integration test suite pass, coverage thresholds met, and clean production build.
  - `Build Check` workflow (`.github/workflows/build-check.yml`): Broken registry import validation, contributor security rules scan (`scripts/check-security-rules.mjs`), and clean production build.
  - `Smoke Test` workflow (`.github/workflows/smoke-test.yml`): Built output preview test (`scripts/smoke-test.mjs`) verifying server startup and zero missing (404) or empty assets.
- **Codeowner Review & Approval**:
  - At least one review approval from the designated maintainer / code owner per `.github/CODEOWNERS` ([@DivyashreeR008](https://github.com/DivyashreeR008)).
- **Branch Currency**:
  - Branches should be up to date with `upstream/main` prior to merging to prevent stale-check errors and merge conflicts.
- **PR Hygiene & Deliverables**:
  - Completed PR template, linked issue (e.g. `Fixes #<number>`), UI screenshots/recordings for visual changes, and a `CHANGELOG.md` entry under `[Unreleased]` for user-facing changes.

Consult [MERGE_REQUIREMENTS.md](MERGE_REQUIREMENTS.md) for detailed descriptions, local reproduction commands, failure surfaces, and the synchronization policy for configuration changes.

## Test Coverage

`npm run test:coverage` runs the suite with V8 coverage over `src/` (test files
and `src/test/` excluded). It prints a per-file table and writes an HTML report
to `coverage/index.html` (git-ignored); open it to see which lines and branches
are untested. CI runs the same command and shows the totals in the job summary.

`vitest.config.js` sets a minimum threshold for statements, branches, functions
and lines, a few points below the measured baseline. If a change drops coverage
under it, the run fails; add tests rather than lowering it, and raise the
numbers when coverage improves. Coverage shows what is untested, not how good
the tests are.

## Pull Request Guidelines

- Fill out the PR template completely
- Link to any related issues
- Ensure code follows the project's style guidelines
- Add or update documentation as needed
- Ensure `npm run verify` passes locally before submitting
- Review and satisfy all merge requirements in [MERGE_REQUIREMENTS.md](MERGE_REQUIREMENTS.md)
- Add an axe check for new interactive components or page-level flows. The shared
  `src/test/a11y.js` helper fails on jsdom-supported violations; color contrast
  still requires a real-browser or manual check.
- Adhere to the contributor security rules in [SECURITY.md](SECURITY.md) (no third-party data transmission, no credential logging or storage, no analytics/tracking). Run `npm run check:security` to scan your changes locally.

## Versions and Releases

Versioning, tagging and release notes are described in [RELEASING.md](RELEASING.md). Add an entry under `[Unreleased]` in [CHANGELOG.md](CHANGELOG.md) for any user-facing change.

## Report Bugs / Feature Requests

- Search for existing issues before creating new ones
- Use clear, descriptive titles
- Include steps to reproduce for bugs
- Describe the expected behavior for feature requests

## Thank You!

Your contributions help make Open-Agents better for everyone.
