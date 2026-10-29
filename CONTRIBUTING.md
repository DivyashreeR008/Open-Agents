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
4. **Test your changes** - Ensure existing tests pass and add new tests if applicable
5. **Commit your changes** - Use clear, descriptive commit messages
6. **Push to your fork** - `git push origin feature/your-feature-name`
7. **Submit a Pull Request** - Describe what you changed and why

Agent definitions are checked directly from the raw registry modules and mounted
through `AgentRunner` by the test suite. Run `npm test` before submitting a new or
updated definition; invalid input types, option lists, duplicate IDs, and stale
`exampleInputs` keys will fail with the affected agent's file and ID.

## Pull Request Guidelines

- Fill out the PR template completely
- Link to any related issues
- Ensure code follows the project's style guidelines
- Add or update documentation as needed
- Ensure all tests pass
- Add an axe check for new interactive components or page-level flows. The shared
  `src/test/a11y.js` helper fails on jsdom-supported violations; color contrast
  still requires a real-browser or manual check.

## Versions and Releases

Versioning, tagging and release notes are described in [RELEASING.md](RELEASING.md). Add an entry under `[Unreleased]` in [CHANGELOG.md](CHANGELOG.md) for any user-facing change.

## Report Bugs / Feature Requests

- Search for existing issues before creating new ones
- Use clear, descriptive titles
- Include steps to reproduce for bugs
- Describe the expected behavior for feature requests

## Thank You!

Your contributions help make Open-Agents better for everyone.
