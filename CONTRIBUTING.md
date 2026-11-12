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
4. **Verify your changes** - Run `npm run verify` to run the full verification suite (tests and build)
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

Agent definitions are checked directly from the raw registry modules and mounted
through `AgentRunner` by the test suite. Run `npm test` before submitting a new or
updated definition; invalid input types, option lists, duplicate IDs, stale
`exampleInputs` keys, and missing or malformed `createdAt` dates will fail with
the affected agent's file and ID.

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
