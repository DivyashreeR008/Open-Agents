# Label guide

Labels are how this repository turns its contribution process into something visible. This page defines what each label means, who applies it, and how an item moves through the queue.

## Source of truth

`.github/labels.yml` is the source of truth for label names, colours, and descriptions. The `Sync Labels` workflow applies that file to the repository. Do not rename a label in the GitHub UI: update the YAML file so the next sync does not undo the change.

Automation applies most labels:

- `.github/workflows/issue-auto-label.yml` labels new issues from the issue form and title prefix.
- `.github/workflows/pr-auto-label.yml` labels new and reopened pull requests, including the level derived from the linked issue.
- `.github/workflows/stale.yml` marks quiet work as stale and closes it after the grace period.

Maintainers may correct a label by hand. The conventions below still apply.

## Issue lifecycle

1. **Opened.** The issue form supplies a type and difficulty. Automation adds `nsoc-2026` and `nsoc26`, the matching type label, `difficulty: <level>`, `level1`-`level3`, and `good first issue` when the difficulty is easy.
2. **Needs triage.** If the title prefix and the Difficulty answer are both unrecognised, automation adds `triage` instead of guessing. A maintainer reads the issue, asks for missing details, and replaces `triage` with the correct type and difficulty labels.
3. **Ready to claim.** A contributor comments on the issue to request it. A maintainer assigns the issue when the claim is accepted. Assigned issues are exempt from the stale workflow.
4. **Quiet.** An unassigned issue with no activity for 45 days gets `stale`. Any comment or update removes `stale`. If 14 more days pass without activity, the stale workflow closes it as not planned.
5. **Closed.** A linked pull request closes the issue when it merges. Reopen a closed issue when the problem returns; do not open a duplicate that repeats the same report.

Exemptions from the issue stale workflow are `pinned`, `security`, `good first issue`, `help wanted`, and `triage`. All assigned issues are exempt.

## Pull request lifecycle

1. **Opened or reopened.** Automation adds `nsoc26` and a type label (`enhancement` for `feat:`, `bug` for `fix:`, `documentation` for `docs:`).
2. **Level.** The workflow reads the issue named by a closing keyword such as `Closes #123`, then maps its difficulty label to one level label. If several issues are linked, the hardest one wins. If no linked issue has a recognised difficulty, the pull request gets `level3` as the documented fallback. An existing `level1`-`level3` label is never replaced.
3. **Review.** A maintainer reviews the diff, checks the linked issue, and requests changes when needed. The author should keep the branch current and respond to review comments.
4. **Quiet.** A pull request with no activity for 21 days gets `stale`. Drafts, assigned pull requests, dependency updates, and security work are exempt. Another 10 quiet days closes the pull request.
5. **Merged or closed.** Merging closes the linked issue through its closing keyword. A closed pull request can be reopened when the author can continue the work.

## Difficulty and level mapping

| Issue difficulty         | Pull request level | Leaderboard value |
| ------------------------ | ------------------ | ----------------- |
| `difficulty: easy`       | `level1`           | +3                |
| `difficulty: medium`     | `level2`           | +5                |
| `difficulty: hard`       | `level3`           | +10               |
| no recognised difficulty | `level3`           | +10               |

`difficulty:` labels describe the work. `level` labels describe how the contribution programme scores it. Keep both on the issue; on a pull request, keep exactly one level label.

## Contribution rules

- Apply one type label to an issue or pull request: `bug`, `enhancement`, `documentation`, `new-agent`, `feedback`, or `agent-request`.
- `good first issue` means `difficulty: easy`, and an easy issue should carry it. Remove it if the scope grows.
- Do not use `level3` to mean "urgent". Level follows difficulty, not priority.
- Do not remove `nsoc26` from participant work. It is the season marker used by the leaderboard.
- Remove `triage` once the type and difficulty are known.
- Comment on an issue before starting work. An accepted claim should be assigned so the stale workflow leaves it alone.
- When you update a stale item, remove `stale` or let the next activity remove it automatically. Closing a stale item is a queue-cleanup action, not a judgement about the report.
- Reserved labels `duplicate`, `invalid`, `question`, and `wontfix` explain a closed item and should stay on it.

## Label reference

### Type and topic

| Label           | Meaning                                                            |
| --------------- | ------------------------------------------------------------------ |
| `bug`           | Something in the app or repository is not working as documented.   |
| `enhancement`   | A new feature or an improvement to existing behaviour.             |
| `documentation` | A change limited to docs, comments, or explanatory copy.           |
| `new-agent`     | A proposal or implementation for a new agent definition.           |
| `feedback`      | User feedback about the product or the contribution process.       |
| `agent-request` | An agent requested from the in-app request flow.                   |
| `accessibility` | A barrier that affects people with disabilities.                   |
| `question`      | The issue is a question rather than a bug or a scoped task.        |
| `duplicate`     | Another open issue or pull request already covers the same work.   |
| `invalid`       | The report cannot be reproduced or does not describe this project. |
| `wontfix`       | The team has decided not to make this change.                      |

### Programme and difficulty

| Label                | Meaning                                                               |
| -------------------- | --------------------------------------------------------------------- |
| `nsoc-2026`          | The issue belongs to the NSoC 2026 programme history.                 |
| `nsoc26`             | The season marker scored by the NSoC leaderboard.                     |
| `difficulty: easy`   | Small, well-scoped work suitable for a first contribution.            |
| `difficulty: medium` | Moderate work that needs some codebase familiarity.                   |
| `difficulty: hard`   | Large or cross-cutting work that needs design and review time.        |
| `level1`             | Pull request scored at level 1 (+3). Derived from easy difficulty.    |
| `level2`             | Pull request scored at level 2 (+5). Derived from medium difficulty.  |
| `level3`             | Pull request scored at level 3 (+10). Derived from hard difficulty.   |
| `good first issue`   | The work is approachable for a newcomer; paired with easy difficulty. |
| `help wanted`        | The team is actively looking for someone to take the work.            |

### Workflow and automation

| Label          | Meaning                                                                |
| -------------- | ---------------------------------------------------------------------- |
| `triage`       | The issue needs a maintainer to set its type and difficulty.           |
| `stale`        | No recent activity; closes after the grace period unless updated.      |
| `pinned`       | Exempt from stale handling while the team needs it visible.            |
| `security`     | Sensitive security work; exempt from stale handling and public detail. |
| `dependencies` | A dependency update, usually opened by Dependabot.                     |
| `automated`    | A pull request created by automation rather than a participant.        |
