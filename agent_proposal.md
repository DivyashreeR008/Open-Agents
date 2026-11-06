# Agent Proposal

> **Want to add a new agent to Open-Agents?**
> Use this template to propose your idea. Open a [GitHub Issue](https://github.com/DivyashreeR008/Open-Agents/issues/new) with the title `[Agent Proposal] Your Agent Name` and fill in the sections below.

---

## How It Works

1. **You propose** — Copy this template into a new GitHub Issue and fill it out.
2. **We review** — Maintainers will evaluate your proposal for feasibility, uniqueness, and usefulness.
3. **You build** — Implement the agent by adding a config file to `src/agents/definitions/` (see [CONTRIBUTING.md](CONTRIBUTING.md)).
4. **You PR** — Open a pull request, and we'll review and merge!

---

## Proposal Template

Copy everything below this line into your GitHub Issue:

---

### Agent Name

_(Give your agent a clear, concise name — e.g. "Blog Post Generator", "SQL Query Builder")_

### Description

_(One or two sentences explaining what this agent does)_

### Category

_(Pick one: `Productivity` · `Research` · `Marketing` · `Engineering` · `HR` — or suggest a new one)_

### Problem It Solves

_(What pain point does this agent address? Who would use it and why?)_

### Example Usage

**Sample input:**

> _(What would a user type or paste into this agent?)_

**Expected output:**

> _(What kind of response should the agent produce? Give a brief example.)_

### Suggested Provider & Model

| Field    | Value                                                |
| -------- | ---------------------------------------------------- |
| Provider | _(openai / anthropic / gemini / any)_                |
| Model    | _(e.g. gpt-4o, claude-sonnet-4-0, gemini-2.0-flash)_ |

### Input Fields

_(List the inputs your agent would need. You don't need to write code — just describe them.)_

| Label            | Type                                              | Required?    | Notes                                          |
| ---------------- | ------------------------------------------------- | ------------ | ---------------------------------------------- |
| _(e.g. "Topic")_ | _(text / textarea / code / select / multiselect)_ | _(Yes / No)_ | _(Any options, placeholder text, or defaults)_ |
|                  |                                                   |              |                                                |
|                  |                                                   |              |                                                |

### Output Format

- [ ] Markdown (formatted text with headings, bullets, code blocks)
- [ ] Plain text (simple text output)
- [ ] JSON scorecard (structured scoring — describe the expected fields below)

### Anything Else?

_(Optional: edge cases, limitations, similar tools for inspiration, links, references, etc.)_

---

## Before You Submit

- [ ] I've checked the [existing agents](./AGENTS.md) and this doesn't duplicate any of them.
- [ ] My proposal clearly explains what the agent does and why it's useful.
- [ ] I have not included any API keys or secrets.

---

> 💡 **Tip:** The more detailed your proposal, the faster we can review and approve it!
>
> 📖 Once approved, follow the [CONTRIBUTING.md](CONTRIBUTING.md) guide to implement your agent.
