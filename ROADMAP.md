# Open-Agents Project Roadmap & Priorities

Welcome to the Open-Agents roadmap! This document publicly communicates the project's direction, active priorities, and specific areas where community contributions make the greatest impact.

> **Current Season:** NSoC 2026 (Updated October 2026)  
> **Review Cadence:** Reviewed monthly by maintainers; refreshed seasonally / quarterly.  
> **Maintained by:** [@DivyashreeR008](https://github.com/DivyashreeR008) and the Open-Agents community.

---

## Table of Contents

1. [Vision & Guiding Principles](#vision--guiding-principles)
2. [Roadmap Status Legend](#roadmap-status-legend)
3. [Current Priorities & Subsystem Roadmaps](#current-priorities--subsystem-roadmaps)
   - [1. Agent Registry & Ecosystem](#1-agent-registry--ecosystem)
   - [2. Multi-Agent Workflows & Automation](#2-multi-agent-workflows--automation)
   - [3. Battle Mode & Model Evaluation](#3-battle-mode--model-evaluation)
   - [4. Provider Integrations & Offline Development](#4-provider-integrations--offline-development)
   - [5. Accessibility, UX & Frontend Polish](#5-accessibility-ux--frontend-polish)
   - [6. Testing, CI/CD & Developer Experience (DX)](#6-testing-cicd--developer-experience-dx)
4. [ðŸ¤ Areas Seeking Help (Where Contributors Count Most)](#-areas-seeking-help-where-contributors-count-most)
5. [Roadmap Lifecycle & Refresh Process](#roadmap-lifecycle--refresh-process)
6. [Milestone Archive (Completed Goals)](#milestone-archive-completed-goals)

---

## Vision & Guiding Principles

Open-Agents is an open-source, client-first platform for discovering, running, and orchestrating specialized AI agents directly in the browser.

Our technical direction is anchored in three core principles:

1. **Privacy First (Client-Side Isolation):** For core executions, API keys never leave the user's browser. There is no middleman storing keys or logging requests.
2. **Modularity & Open Standards:** Every agent, workflow, and model adapter adheres to clean, extensible interfaces that anyone can inspect, test, and improve.
3. **Accessibility & Inclusivity:** The platform should be accessible to all usersâ€”including assistive technology usersâ€”and welcoming to contributors of all experience levels.

---

## Roadmap Status Legend

| Status               | Meaning                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| ðŸŸ¢ **Now**         | Active focus for the current season (NSoC 2026). Highest review priority. |
| ðŸŸ¡ **Next**        | Planned for upcoming cycles once current milestones land.                 |
| ðŸ”µ **Later**       | Exploratory or community-requested features under investigation.          |
| ðŸŸ£ **Help Wanted** | High-priority area explicitly seeking community contributors.             |

---

## Current Priorities & Subsystem Roadmaps

### 1. Agent Registry & Ecosystem

Open-Agents hosts over 200 specialized agents across engineering, design, marketing, data science, and productivity.

- ðŸŸ¢ **Strict Registry Validation (Now):** Maintain automated tests ensuring every definition in `src/agents/definitions/` matches `AGENTS.md` in schema, categories, and documentation.
- ðŸŸ¢ **Standardized Agent Benchmarks (Now - ðŸŸ£ Help Wanted):** Implement repeatable scoring and evaluation prompts to assess agent output quality and consistency.
- ðŸŸ¡ **Dynamic Agent Categorization (Next):** Introduce multi-tag filtering, capability flags (code generation, reasoning, creative writing), and user bookmarking.
- ðŸ”µ **Domain Extension Packs (Later):** Curated packs for specialized verticals (e.g., healthcare compliance, localized legal frameworks).

### 2. Multi-Agent Workflows & Automation

Enabling users to chain multiple agents together into repeatable pipelines via `WorkflowBuilder` and `WorkflowRunner`.

- ðŸŸ¢ **Workflow Execution State & Visualization (Now):** Enhance step-by-step progress tracking, live token streaming per node, and error recovery when an individual step fails.
- ðŸŸ¢ **Automations & Scheduled Runs (Now):** Solidify the scheduler and local automation engine with clear user triggers and status logging.
- ðŸŸ¡ **Branching & Conditional Logic (Next):** Allow workflows to route outputs based on conditions or agent classification results.
- ðŸ”µ **Workflow Import/Export (Later):** Shareable workflow templates via JSON/YAML export and deep links.

### 3. Battle Mode & Model Evaluation

Allowing users to pit multiple models or agents against each other simultaneously with `BattleModeArena`.

- ðŸŸ¢ **OpenRouter & Multi-Provider Arena (Now):** Enable simultaneous generation across OpenAI, Anthropic, Gemini, and OpenRouter models with side-by-side diffing.
- ðŸŸ¢ **Blind Evaluation & Scoring (Now - ðŸŸ£ Help Wanted):** Add blind A/B testing modes with rubric scoring and user preference export.
- ðŸŸ¡ **Automated Metric Evaluation (Next):** Integrate algorithmic evaluation metrics (latency, token cost, output length, similarity).
- ðŸ”µ **Community Battle Leaderboards (Later):** Opt-in crowdsourced leaderboard for agent performance across task categories.

### 4. Provider Integrations & Offline Development

Executing inference while respecting user privacy and facilitating open-source development.

- ðŸŸ¢ **Mock Provider for Local Development (Now - ðŸŸ£ Help Wanted):** Add a built-in mock LLM provider so new contributors can test agents and UI flows without needing private API keys.
- ðŸŸ¢ **Local Model Execution (Now):** Investigate browser-based WebLLM and local Ollama endpoint support for 100% offline agent execution.
- ðŸŸ¡ **Provider Error Handling & Rate Limit Smoothing (Next):** Graceful UI handling for quota exhaustion, token limits, and network retries across all adapters.
- ðŸ”µ **Custom Endpoint Configuration (Later):** Allow users to specify custom OpenAI-compatible API base URLs.

### 5. Accessibility, UX & Frontend Polish

Ensuring Open-Agents delivers a top-tier user experience for everyone.

- ðŸŸ¢ **WCAG 2.1 AA Compliance (Now - ðŸŸ£ Help Wanted):** Comprehensive audit and fixes for contrast ratios, keyboard navigation order, ARIA attributes, and screen-reader announcements on dynamic streams.
- ðŸŸ¢ **Voice Input Reliability (Now - ðŸŸ£ Help Wanted):** Add test coverage for voice components, accessible status announcements for listening/stopped states, and graceful degradation for unsupported browsers.
- ðŸŸ¡ **Theme Persistence & Customization (Next):** Robust system/dark/light theme persistence and responsive layouts across all viewports.
- ðŸŸ¡ **Keyboard Shortcut Command Palette (Next):** Global quick-search palette (`Cmd/Ctrl + K`) to launch agents and switch workflows instantly.

### 6. Testing, CI/CD & Developer Experience (DX)

Building a reliable foundation where contributors can ship code with high confidence.

- ðŸŸ¢ **Comprehensive Vitest Test Suite (Now - ðŸŸ£ Help Wanted):** Expand unit and integration test coverage across untested components, hooks, and pages.
- ðŸŸ¢ **CI Workflow Hardening (Now):** Pin GitHub Actions to immutable SHAs, enforce least-privilege token permissions, and add automated link checking for markdown documentation.
- ðŸŸ¡ **End-to-End Smoke Tests (Next):** Implement lightweight Playwright/Cypress smoke tests for critical user journeys (agent running, workflow chaining, battle arena).
- ðŸŸ¡ **Automated Release & Changelog Tooling (Next):** Establish semantic release tagging, changelog generation, and version tracking.

---

## ðŸ¤ Areas Seeking Help (Where Contributors Count Most)

If you are looking for an issue to pick upâ€”especially during **NSoC 2026**â€”these areas are actively looking for contributions:

1. **Test Coverage (`labels: documentation, test, good first issue`):**
   - Writing Vitest tests for components that lack coverage (voice components, collections, settings, marketplace).
2. **Accessibility Fixes (`labels: accessibility, good first issue`):**
   - Adding missing `aria-label`s, improving focus management in modals, and fixing screen reader cues on links that open in new tabs.
3. **Mock Provider / Dev DX (`labels: enhancement, good first issue`):**
   - Implementing mock response generators so developers can test without live LLM credentials.
4. **New Agents & Prompts (`labels: new agent`):**
   - Adding high-impact agents to `src/agents/definitions/` and documenting them in `AGENTS.md` (see [agent_proposal.md](./agent_proposal.md)).
5. **Documentation & CI (`labels: documentation, ci`):**
   - Improving contributing guides, broken link detection, and workflow optimizations.

Check our [Good First Issues](https://github.com/DivyashreeR008/Open-Agents/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) to get started!

---

## Roadmap Lifecycle & Refresh Process

To ensure this roadmap remains a living, durable document rather than stale text:

1. **Seasonal Refresh:** At the start of each community season or major milestone (e.g. quarterly), the maintainers update priorities based on shipped work and community needs.
2. **Issue Cross-Referencing:** Major roadmap items link to relevant tracking issues and milestones.
3. **Archival Policy:** When goals are completed, they are moved to the [Milestone Archive](#milestone-archive-completed-goals) below with the date or release version noted.
4. **Community Feedback:** If you would like to propose a roadmap item, open a [Feature Request](https://github.com/DivyashreeR008/Open-Agents/issues/new/choose) or start a thread in [GitHub Discussions](https://github.com/DivyashreeR008/Open-Agents/discussions).

---

## Milestone Archive (Completed Goals)

Historical record of previously delivered roadmap milestones:

- **Q3/Q4 2025 â€“ Core Foundations:**
  - Initial directory of 200+ specialized agents with standard system prompts.
  - Zero-storage client-side API key architecture (`SECURITY.md`).
  - Community infrastructure: issue templates, PR checklist, Code of Conduct, and CI build verification.
- **Q1 2026 â€“ Advanced Modes & Tooling:**
  - Introduced Battle Mode arena for side-by-side agent comparison.
  - Created WorkflowBuilder and WorkflowRunner for multi-agent chains.
  - Established Vitest test harness for unit and component testing.
