# Releasing Open-Agents

This document describes how Open-Agents versions, tags and releases are named so that docs, deployments and contributors can point at a stable identifier.

## Versioning

Open-Agents follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html), as already stated in [CHANGELOG.md](CHANGELOG.md).

- Tags are the version prefixed with `v`, for example `v1.0.0`.
- Pre-releases use a suffix, for example `v1.1.0-rc.1`.
- **MAJOR**: a breaking change to stored user data, agent definition format or documented behavior.
- **MINOR**: new agents, features or pages that are backwards compatible.
- **PATCH**: bug fixes, accessibility fixes, documentation and dependency updates.

The version in `package.json` must match the tag (without the `v`).

## What is tagged

The changelog already contains `1.0.0` and `0.1.0` sections, but no git tag or GitHub release exists for either. This policy does not back-date tags. Which commit, if any, represents those milestones is a maintainer decision, so the first tag is created only after a maintainer confirms the milestone (see below).

## Cutting a release (maintainers)

1. Make sure `main` is green (CI, `npm test`, `npm run build`).
2. In `CHANGELOG.md`, rename `[Unreleased]` to `[X.Y.Z] - YYYY-MM-DD`, add a fresh empty `[Unreleased]` section above it, and keep the Keep a Changelog headings (Added, Changed, Deprecated, Removed, Fixed, Security).
3. Set `version` in `package.json` (and `package-lock.json`, for example with `npm version X.Y.Z --no-git-tag-version`) to `X.Y.Z`.
4. Merge that change to `main` through a normal pull request.
5. Create an annotated tag on the merge commit and push it:

   ```bash
   git checkout main && git pull
   git tag -a vX.Y.Z -m "vX.Y.Z"
   git push origin vX.Y.Z
   ```

6. Create the GitHub release from that tag (Releases, Draft a new release). Use "Generate release notes" and then add highlights using the template below. Grouping of the generated notes is configured in [.github/release.yml](.github/release.yml). Alternatively:

   ```bash
   gh release create vX.Y.Z --verify-tag --title "vX.Y.Z" --notes-file release-notes.md
   ```

7. Mark pre-releases as such, and mention the release in the roadmap's Milestone Archive when it completes a roadmap goal.

## Release notes template

```markdown
## Highlights
- One to three user-facing changes, each linking its PR or issue.

## Upgrade notes
- Anything users or deployers must do. Write "None" if nothing.

## Changelog
Full details: https://github.com/DivyashreeR008/Open-Agents/blob/vX.Y.Z/CHANGELOG.md

**Full diff**: https://github.com/DivyashreeR008/Open-Agents/compare/vPREVIOUS...vX.Y.Z
```

The "What's Changed" list produced by GitHub's generated notes can be pasted below the highlights.
