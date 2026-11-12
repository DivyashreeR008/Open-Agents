# Open-Agents

Open-Agents is a local-first web app for discovering, running, and composing AI agents. It ships with more than 870 agent definitions and works with OpenAI, Anthropic, Google Gemini, and OpenRouter through API keys you enter in the app.

## Features

- **Agent catalog:** Search and filter more than 870 agents across engineering, marketing, design, finance, healthcare, research, and other categories.
- **Bring your own model:** Run agents with OpenAI, Anthropic, Google Gemini, or OpenRouter. Provider keys are entered in the app rather than committed to environment files.
- **Workflows:** Build multi-step agent chains, add conditional branches, and run them from the workflow library. Saving and loading workflows requires the optional Supabase configuration described below and an authenticated Supabase session.
- **Battle mode:** Run the same task through two model configurations and compare the results side by side.
- **Collections and suites:** Group agents, use curated suites, or generate a custom suite from a goal.
- **Automations:** Schedule recurring agent runs, inspect run history, and surface missed or failed runs. Email notifications are optional.
- **Analytics:** Review run volume, provider mix, activity streaks, token usage, and session cost.
- **Batch mode:** Run an agent across rows from a CSV file and export the results as CSV or Markdown.
- **Local marketplace:** Publish, import, and rate agent configurations. Credential-like fields are sanitized before a listing is stored.
- **Browser storage:** Favorites, collections, history, automations, analytics, and marketplace data stay in the browser unless a feature explicitly uses a configured backend.

## Tech stack

The app is built with React, Vite, Tailwind CSS, Vitest, and Testing Library. Agent definitions are plain JavaScript modules, and the production build is a static site.

## Requirements

- Node.js 22 LTS (22.22.2 or newer). CI runs Node 22.
- npm, which is included with Node.js.
- A modern browser.
- An API key from at least one supported provider to run agents.

## Local setup

1. Clone the repository:

   ```bash
   git clone https://github.com/DivyashreeR008/Open-Agents.git
   cd Open-Agents
   ```

   If you plan to contribute, fork the repository on GitHub, clone your fork instead, and add this repository as `upstream`:

   ```bash
   git remote add upstream https://github.com/DivyashreeR008/Open-Agents.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Optionally create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

   Fill in only the optional values you need. See [Optional configuration](#optional-configuration).

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173).

Provider API keys are not read from `.env.local`. Add a key from the key bar in the app before running an agent.

### Optional configuration

`.env.local` is ignored by Git. All values below are optional and can stay blank for the default zero-backend setup.

| Variable                 | Purpose                                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | Supabase project URL. Together with the anon key, enables Supabase-backed workflow storage and automation sync.                               |
| `VITE_SUPABASE_ANON_KEY` | Public anon key for the same Supabase project. Never use a service-role key in a Vite environment variable.                                   |
| `VITE_RESEND_API_KEY`    | Resend API key for automation completion emails. Vite exposes `VITE_*` values to the browser, so use a restricted key for local testing only. |

Supabase-backed workflow persistence requires tables and authentication compatible with `src/hooks/useWorkflows.js`. Without Supabase, the workflow screens load, but workflows cannot be saved or retrieved.

## Development commands

| Command                     | What it does                                                        |
| --------------------------- | ------------------------------------------------------------------- |
| `npm run dev`               | Start the Vite development server with hot reload.                  |
| `npm test`                  | Run the Vitest suite once.                                          |
| `npm run test:watch`        | Run Vitest in watch mode.                                           |
| `npm run test:coverage`     | Run tests with V8 coverage and write an HTML report to `coverage/`. |
| `npm run lint`              | Run ESLint.                                                         |
| `npm run format:check`      | Check formatting with Prettier.                                     |
| `npm run build`             | Create a production build in `dist/`.                               |
| `npm run preview`           | Serve the production build locally.                                 |
| `npm run check:bundle-size` | Check route chunks against the bundle-size budgets.                 |
| `npm run verify`            | Run the tests, production build, and bundle-size check.             |

The full `npm run verify` command can take several minutes. Run it before opening a pull request.

## Project layout

- `src/agents/definitions/`: One module per agent. Add new agents here.
- `src/pages/`: Route-level screens such as the catalog, workflows, automations, analytics, and marketplace.
- `src/components/`: Shared UI, including the agent runner and output renderer.
- `src/lib/`: Provider adapters, storage helpers, hooks, and local data services.
- `scripts/`: Repository checks for security rules, bundle budgets, and smoke tests.
- `AGENTS.md`: Human-readable index of the agent catalog.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the agent definition contract and the steps to add an agent.

## Roadmap and priorities

Looking to see where Open-Agents is heading or where your contributions will have the biggest impact? Check out the [Project Roadmap](ROADMAP.md) for current seasonal priorities, subsystem plans, and help-wanted focus areas.

## Contributing

We welcome contributions.

1. Fork the repository.
2. Create a branch for your change.
3. Make your changes.
4. Run `npm run verify` to run the tests, production build, and bundle-size checks.
5. Submit a pull request. See [Merge Requirements](MERGE_REQUIREMENTS.md) for the required checks and merge gates.

For setup details, test commands, and the agent authoring guide, read [CONTRIBUTING.md](./CONTRIBUTING.md).

### Dependency update policy

Dependabot checks npm dependencies weekly. Patch and minor updates are proposed normally; major updates are grouped into one `major-dependencies` pull request so maintainers can review breaking changes together. No package is globally excluded from major-version updates: grouped pull requests keep the upgrade backlog visible while allowing compatibility work to be planned.
