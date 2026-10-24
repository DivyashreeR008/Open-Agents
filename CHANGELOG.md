# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Maintenance

This changelog is maintained manually by the Open-Agents maintainers
(@DivyashreeR008 and the Open-Agents community). It is reviewed monthly and
refreshed each season alongside the project roadmap (see ROADMAP.md).
Contributors should add an entry to the `[Unreleased]` section as part of any
PR that ships a user-facing change, linking to the related issue or pull
request. Automated release and changelog tooling is planned but not yet in
place (see ROADMAP.md, section 6).

## [Unreleased]

### Added
- Changelog maintenance process documented; entries are added as changes ship.

### Changed
- None.

### Deprecated
- None.

### Removed
- None.

### Fixed
- None.

### Security
- None.

## [1.0.0] - Q1 2026 (Advanced Modes & Tooling)

### Added
- Battle Mode arena for side-by-side agent and model comparison
  (`BattleModeLanding`, `BattleModeSetup`, `BattleModeArena`, `BattleModeWinner`).
- Multi-agent workflows: `WorkflowLibrary`, `WorkflowBuilder`, `WorkflowDetail`,
  `WorkflowRunner` plus the `WorkflowBuilder` canvas page.
- Automations and scheduled runs: `AutomationsPage`, `AutomationDetailPage`,
  scheduler engine, and `automationsService`.
- Agent collections: `CollectionsPage`, `CollectionDetailPage`,
  `CollectionAgentPicker`, `useCollections`.
- Marketplace page for discovering agents (`MarketplacePage`, `marketplace.js`).
- Analytics page with usage, run, and spend metrics (`AnalyticsPage`,
  `useAnalytics`, `useSessionSpend`, `useTokenCounter`).
- Settings page for API keys, favorites, prompt history, and recent agents
  (`SettingsPage`, `useApiKey`, `useFavorites`, `useHistory`, `usePromptHistory`,
  `useRecentAgents`).
- Voice input and output components (`VoiceInput`, `VoiceOutput`).
- Export utilities: batch export, Markdown export, PDF export
  (`exportBatch`, `exportMarkdown`, `exportPdf`).
- Agent ratings and run metrics (`agentRatings`, `useAgentRatings`,
  `useAgentRunMetrics`).
- Recommendation wizard components (`recommendation/`).
- Suite definitions and `SuitesPage` (`src/suites/`).
- 872+ specialized agent definitions across 33 categories, documented in
  `AGENTS.md` and loaded through the lazy `agent registry`
  (`src/agents/registry.js`, `src/agents/definitions/`).
- Vitest test suite across components, hooks, pages, and lib utilities, plus a
  smoke test for the built output.
- Accessibility foundations: `SkipToMainContentLink`, `ErrorBoundary`, focus
  management, and `prefers-reduced-motion` handling.

### Changed
- Agent definitions are lazy-loaded via Vite `import.meta.glob` to reduce the
  initial bundle size.

### Fixed
- Issue chooser help link now points to a working destination.

## [0.1.0] - Q3/Q4 2025 (Core Foundations)

### Added
- Initial open-source community setup: README, CONTRIBUTING, Code of Conduct,
  Security, Support, issue/PR templates, and CI workflows.
- `AGENTS.md` agent directory and `agent_proposal.md` proposal template.
- 200+ specialized agent directory with standard system prompts.
- Zero-storage client-side API key architecture (API keys never leave the
  browser; see SECURITY.md).
- Agent registry with lazy-loaded definitions and the category taxonomy
  (`src/agents/categories.js`).
