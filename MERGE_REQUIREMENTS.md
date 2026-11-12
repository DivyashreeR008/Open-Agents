# Merge Requirements & Quality Gates

This document defines what a change must pass before it can merge into `main`.

Predictable gates make voluntary contribution sustainable: contributors know upfront what is expected, how checks run, who reviews their work, and how to reproduce and fix failures locally.

> **Synchronization Guarantee**: This document is the authoritative record of merge requirements. Whenever repository settings, branch protection rules, code owners, or CI workflow files change, this file **must** be updated in the same pull request.

---

## Table of Contents

1. [Pull Request Lifecycle](#pull-request-lifecycle)
2. [Automated CI Status Checks](#automated-ci-status-checks)
3. [Local Pre-Flight Verification](#local-pre-flight-verification)
4. [Review & Code Ownership](#review--code-ownership)
5. [Branch Freshness & Merge Strategy](#branch-freshness--merge-strategy)
6. [Contributor Deliverables & PR Hygiene](#contributor-deliverables--pr-hygiene)
7. [Failure Surfaces & Remediation](#failure-surfaces--remediation)
8. [Keeping Configuration Synchronized](#keeping-configuration-synchronized)

---

## Pull Request Lifecycle

Every proposal submitted to Open-Agents moves through the following stages:

```
[ Fork & Branch ]
       │
       ▼
[ Local Verification ]  ──► (npm run verify, test:smoke, check:security)
       │
       ▼
[ Open Pull Request ]  ──► Target 'main', complete PR template, link issue
       │
       ▼
[ Automated Checks ]   ──► GitHub Actions run CI and Smoke Test
       │
       ├─► Failed? Automated bot comment left on PR; fix locally and push
       │
       ▼
[ Codeowner Review ]   ──► Routed via .github/CODEOWNERS to maintainers
       │
       ├─► Changes requested? Discuss, update branch, and re-verify
       │
       ▼
[ Approval & Merge ]   ──► Maintainer approves and merges into 'main'
```

---

## Automated CI Status Checks

Every pull request targeting `main` (and every push to `main`) triggers two GitHub Actions workflows. A change cannot merge if any of these checks fail.

### 1. CI (`.github/workflows/ci.yml`)

Runs on `ubuntu-latest` with the Node.js release pinned in `.nvmrc` and `npm ci`.

- **Runtime Contract**:
  - `actions/setup-node` reads `.nvmrc`, currently Node 22.23.5, so every job uses the same runtime.
  - `package.json` declares the supported range `^22.22.2 || ^24.15.0 || >=26.0.0`, matching the locked test tooling.
  - `.npmrc` sets `engine-strict=true`, so `npm install` and `npm ci` fail with `EBADENGINE` on an unsupported runtime instead of allowing tests to run there.
- **Test Job (`test`)**:
  - Executes `npm run check:security` to enforce the policies in [SECURITY.md](SECURITY.md): no unauthorized network transmissions or telemetry, no insecurely stored credentials, no tracking scripts in the client bundle, and explicit records for reviewed exceptions in `security-exceptions.json`.
  - Runs the registry default-import guard and rejects `import agents from`.
  - Executes `npm run lint` and `npm run format:check`.
  - Executes `npm run test:coverage` (Vitest with V8 coverage).
  - Validates that all unit and integration tests pass across components, hooks, utilities, and agent definitions.
  - Enforces minimum code coverage thresholds configured in `vitest.config.js`:
    - **Statements**: ≥ 48%
    - **Branches**: ≥ 31%
    - **Functions**: ≥ 55%
    - **Lines**: ≥ 42%
  - _Non-regression rule_: If a change drops coverage below these floors, add corresponding tests rather than lowering the threshold numbers.
  - Automatically formats and publishes a coverage summary to the GitHub Actions Step Summary via `scripts/coverage-summary.mjs`.
- **Build Job (`build`)**:
  - Depends on `test` completing successfully.
  - Executes `npm run build` (`vite build`) and `npm run check:bundle-size`.
  - Asserts that the production bundle compiles with zero syntax, import, or build errors and stays within the route budgets.

### 2. Smoke Test (Built Output) (`.github/workflows/smoke-test.yml`)

Runs on `ubuntu-latest` with the Node.js release pinned in `.nvmrc` and `npm ci`.

- **Job (`smoke-test`)**:
  - Executes `npm run test:smoke` (`scripts/smoke-test.mjs`).
  - Builds the production distribution and spins up Vite preview on `http://localhost:4177`.
  - Parses `dist/index.html` and fetches every linked `<script>` and `<link>` asset to verify:
    - HTTP 200 response (no broken or missing 404 assets).
    - Non-empty payload size (> 0 bytes).
  - Exercises core routing and app paths without requiring external LLM provider API keys.
- **Failure Notification**:
  - If this check fails on a pull request, an automated bot comment is posted with instructions on running `npm run test:smoke` to reproduce and resolve the issue.

---

## Local Pre-Flight Verification

Contributors should run the full verification suite locally before opening or updating a pull request:

| Command                  | Purpose                                        | When to Run                                     |
| ------------------------ | ---------------------------------------------- | ----------------------------------------------- |
| `npm run verify`         | Runs tests, build, and bundle-size checks      | Before every commit/PR                          |
| `npm run test:coverage`  | Runs test suite and checks coverage thresholds | When adding or changing code logic              |
| `npm run check:security` | Runs contributor security scanner              | When touching network, storage, or dependencies |
| `npm run test:smoke`     | Tests preview server and asset resolution      | When modifying build configs, assets, or routes |
| `npm test`               | Runs all Vitest test suites                    | During iterative development                    |

### Accessibility (a11y) Checks

New interactive UI components, modals, forms, and page-level routes must include automated accessibility checks using the shared `src/test/a11y.js` helper (powered by `jest-axe`). All form controls must have accessible programmatic names (`aria-label` or `<label>`), and modals must manage focus and announce their dialog role.

---

## Review & Code Ownership

Review routing is strictly defined by [.github/CODEOWNERS](.github/CODEOWNERS):

| File Pattern            | Assigned Owner                                       | Review Focus                                                                             |
| ----------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `*` (Default)           | [@DivyashreeR008](https://github.com/DivyashreeR008) | Overall architecture, consistency, and adherence to project standards                    |
| `src/agents/`           | [@DivyashreeR008](https://github.com/DivyashreeR008) | Agent definition schemas, input types, option lists, runner mountability, and unique IDs |
| `src/lib/llmAdapter.js` | [@DivyashreeR008](https://github.com/DivyashreeR008) | Secure provider communication, streaming safety, and error handling                      |
| `src/lib/useApiKey.js`  | [@DivyashreeR008](https://github.com/DivyashreeR008) | API key storage hygiene, credential persistence policies, and privacy                    |

### Approval Requirements

- At least **one approving review** from a designated code owner/maintainer listed in [MAINTAINERS.md](MAINTAINERS.md) is required before merging.
- All review comments and requested revisions must be resolved.
- Maintainers verify both technical correctness and alignment with the [Roadmap & Priorities](ROADMAP.md).

---

## Branch Freshness & Merge Strategy

### Target Branch

All feature contributions, bug fixes, and documentation updates must target the default branch: `main`.

### Branch Freshness

- Pull request branches should be kept up to date with `upstream/main`.
- If `main` has progressed with conflicting or overlapping changes, rebase or merge `upstream/main` into your feature branch and re-run local verification:
  ```bash
  git fetch upstream
  git merge upstream/main
  npm run verify
  git push origin feature/your-branch-name
  ```
- An up-to-date branch guarantees that CI tests your changes against the current baseline and prevents post-merge breaks.

### Merge Method

- Pull requests are merged by repository maintainers using **Squash and Merge** or standard merge commits referencing the pull request number (e.g., `Merge pull request #401 from ...`).
- Commit messages on `main` follow conventional naming (`feat:`, `fix:`, `docs:`, `perf:`, `chore:`).

---

## Contributor Deliverables & PR Hygiene

To be eligible for merge, a pull request must satisfy these criteria:

1. **Pull Request Template**:
   - Fill out `.github/PULL_REQUEST_TEMPLATE.md` completely.
   - Accurately select the _Type of change_.
   - Check off each applicable item in the pre-flight checklist.
2. **Issue Linkage**:
   - Reference the issue being resolved in the PR description (e.g., `Fixes #401` or `Closes #123`).
3. **UI Proof / Screenshots**:
   - Any pull request modifying visual UI, themes, or layouts must attach screenshots or a screen recording demonstrating the change in both light and dark modes.
4. **Changelog Entry**:
   - User-facing additions, improvements, bug fixes, breaking changes, or security updates must include an entry in [CHANGELOG.md](CHANGELOG.md) under the `[Unreleased]` section, categorized per [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standards.
5. **Active Engagement**:
   - Contributors must be responsive to review feedback. Under NSoC / community policy, PRs or assigned issues with no activity for over 2 weeks are subject to unassignment so other contributors can proceed.

---

## Failure Surfaces & Remediation

When a gate fails, consult the table below to locate the failure surface and apply the fix:

| Failure Surface                        | Root Cause                                                                        | Remediation                                                                                                                                                      |
| -------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CI: Test / Coverage Failure**        | A test failed, or statement/branch/line coverage fell below threshold.            | Run `npm run test:coverage` locally. Check `coverage/index.html` to find untested paths and add unit tests.                                                      |
| **CI: Broken Registry Import**         | Direct import `import agents from '.../registry'` was introduced.                 | Replace with `const { agents } = useAgents()`.                                                                                                                   |
| **CI: Security Scan Failure**          | Code touches external URLs, stores credentials insecurely, or includes telemetry. | Run `npm run check:security` locally. Review findings against [SECURITY.md](SECURITY.md); record verified exceptions in `security-exceptions.json` if justified. |
| **Smoke Test: Missing or Empty Asset** | A built bundle file or stylesheet failed to load (HTTP 404 or 0 bytes).           | Run `npm run build && npm run test:smoke` locally to inspect asset manifests and preview outputs.                                                                |
| **Lint / Build Compile Error**         | Syntax error, missing dependency, or invalid JSX/CSS.                             | Run `npm run build` locally to see the Vite compilation trace.                                                                                                   |
| **Merge Conflict**                     | Upstream `main` was updated with overlapping edits.                               | Fetch `upstream/main`, merge or rebase onto your branch, resolve conflicts, and re-run `npm run verify`.                                                         |

---

## Keeping Configuration Synchronized

Merge requirements are only as valuable as their accuracy. To ensure documentation never falls behind repository reality:

1. **Atomic Updates**: Any PR that modifies, adds, or deletes workflows in `.github/workflows/`, alters thresholds in `vitest.config.js`, updates `.github/CODEOWNERS`, or changes repository branch policies **must update `MERGE_REQUIREMENTS.md` in the same commit**.
2. **Review Checklist**: Maintainers reviewing PRs that adjust CI configuration must verify that this document reflects the new behavior before granting merge approval.
3. **No Hidden Rules**: No merge requirement should exist purely in GitHub repository settings without being documented here.
