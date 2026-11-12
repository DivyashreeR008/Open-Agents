# Security

## Trust boundaries

Open-Agents runs in the browser. When you start an interactive agent run, the
browser sends the system prompt and user message directly to the AI provider you
selected. That provider receives the request, the prompt text, and the API key used
to authenticate it, and handles the request under its own data policy. The
Open-Agents backend is not in that request path and does not receive the provider
key.

Some optional features use additional services:

- When Supabase is configured for the deployment, workflow records and automation
  definitions can be written to that Supabase project. Provider keys are not
  included in those records.
- When email notifications are enabled and a Resend key is configured, the run
  output or error text is sent through Resend to the recipient configured on the
  automation.
- The client stores local analytics and usage history in the browser. This
  repository does not include a third-party analytics or advertising SDK.

Storing data in the browser is not the same as keeping it secret from code running
in the page. Any script that can execute in the app origin can read session
storage, call the same storage APIs, and act while the page is open. The controls
below reduce persistence and limit accidental copies; they do not make a browser
safe against XSS, a malicious extension, or another person using an unlocked
profile.

## Where credentials are stored

| Storage          | Key                                                       | Contents                                                                                     | Lifetime                                                                    |
| ---------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `sessionStorage` | `oa_apikey_<provider>`                                    | An interactive provider key, optionally saved for this tab, wrapped with an expiry timestamp | Removed after eight hours, when the tab closes, or when you clear it        |
| `sessionStorage` | `OpenAgents_<provider>_key`                               | A provider key saved from Settings, wrapped with an expiry timestamp                         | Removed after eight hours, when the tab closes, or when you clear it        |
| `sessionStorage` | `oa_scheduler_key_<jobId>`                                | The key held by a scheduler job                                                              | Removed when the job is deleted, the key is cleared, or the tab closes      |
| `localStorage`   | `oa_encrypted_vault_v2`                                   | AES-GCM ciphertext for scheduled automation keys                                             | Removed when the automation or key is deleted, or when site data is cleared |
| `localStorage`   | `OpenAgents_default_provider`                             | The selected provider name only; no secret material                                          | Removed when you change the preference or clear all keys                    |
| IndexedDB        | `open-agents-secure-keystore`, object store `crypto-keys` | A non-extractable AES-GCM device key used to wrap the automation vault                       | Removed when site data is cleared                                           |

Older builds may have written a plaintext provider key under an
`OpenAgents_<provider>_key` name in `localStorage`. The current read path moves such
a value into `sessionStorage` and deletes the `localStorage` copy. Clear actions
also remove any remaining legacy copy. A legacy value that is never read or
cleared can remain in storage until you clear site data.

The automation vault is encrypted before the ciphertext is written. Its wrapping
key is held in IndexedDB as a non-extractable WebCrypto key and is not uploaded.
This means copying `localStorage` alone does not expose the automation key, and
clearing site data or moving to another browser profile requires entering the key
again. It does not protect against XSS, a malicious extension, or a person who can
use the unlocked profile. If WebCrypto or IndexedDB is unavailable, the app refuses
to store an automation key instead of falling back to plaintext.

Interactive session keys are not protected by that vault. They are readable by
scripts in the page while the tab is open, and the expiry timestamp bounds the
window rather than preventing access.

## Where run and prompt data are stored

| Storage        | Key                           | Contents                                                                                                | Retention                                                                                    |
| -------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `localStorage` | `OpenAgents_history`          | The inputs and output of recent interactive runs                                                        | Ten most recent runs; individual entries can be deleted or all history cleared               |
| `localStorage` | `oa_scheduler_results`        | Scheduled job output and error text                                                                     | Fifty most recent results; deleted with the job or individually                              |
| `localStorage` | `oa_automation_runs_v2`       | Automation run records, including output and error text                                                 | Retained until the run or automation is deleted, or site data is cleared                     |
| `localStorage` | `oa_automations_v2`           | Automation definitions, including saved input values, system prompt, schedule, and notification address | Retained until the automation is deleted or site data is cleared                             |
| `localStorage` | `oa_automation_email_logs_v2` | Email delivery metadata: recipient, subject, status, and a short output preview                         | Fifty most recent entries                                                                    |
| `localStorage` | `oa_execution_traces`         | Workflow trace records with step inputs, step outputs, and final output                                 | Twenty most recent traces; each payload is truncated to 8,000 characters by the trace module |
| `localStorage` | `oa_prompt_history`           | Prompts you explicitly save, plus an optional agent name                                                | One hundred most recent prompts; individual entries or the whole list can be deleted         |
| `localStorage` | `oa_analytics`                | Run metadata: agent, provider, model, duration, and timestamp. No prompt or output text.                | Five hundred most recent events; can be cleared from Analytics                               |
| `localStorage` | `oa_session_spend`            | Token counts and estimated cost for recent runs                                                         | Two hundred most recent runs; can be cleared from the spend panel                            |

The app also stores non-secret preferences and workflow content, such as theme,
favorites, collections, sidebar state, marketplace data, and dismissed banners.
Those are not credentials or run transcripts and are outside the table above.

Workflow execution and batch mode currently keep their active state in page
memory. Leaving the page discards that state. The trace module can persist
workflow traces if a caller records them, but the app does not route every
workflow or batch run into that store automatically.

## Optional cloud and email paths

With `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` configured, the client can
write workflow records and automation definitions to Supabase. Automation records
include saved inputs and the notification address, but not the encrypted vault or
the provider key. The repository also contains an optional `logAgentRun` writer
that, when called, sends model, token counts, estimated cost, status, duration, and
a timestamp to the `agent_runs` table. It does not include prompts, outputs, or
provider keys.

With email notifications enabled and `VITE_RESEND_API_KEY` configured at build
time, the client sends the recipient address, automation name, subject, status,
duration, and output or error text to `https://api.resend.com`. A local delivery log
keeps a shorter preview as described above. The Resend integration is recorded as
an accepted exception in `security-exceptions.json`.

## Deleting local data

- Settings removes the provider keys it manages, the default provider preference,
  and the matching encrypted automation keys. Removing an automation key also
  removes its local vault entry.
- The scheduler removes its session key when a job is deleted. Session keys also
  disappear when the tab closes.
- Recent runs can be deleted from the recent runs panel. Analytics has a clear
  control, and prompt history supports deleting one entry or clearing the list.
- Clearing site data for the origin removes `localStorage`, `sessionStorage`, and
  the IndexedDB device key. Encrypted automation keys cannot be recovered after
  that, and stored runs and prompts are removed with the rest of the site data.

Local data is scoped to the browser profile. It is not synchronized between
devices. The optional Supabase records described above are the only app-managed
server copies covered by this document.

## Enforced credential-persistence policy

`src/lib/keyPersistencePolicy.test.jsx` exercises the session-storage,
recorded-run, trace, scheduler, vault, and export boundaries with a sentinel
credential. The test fails if plaintext reaches `localStorage`, a recorded history
entry, or an exported file. The versioned encrypted automation vault is the only
reviewed persistence exception; even there, the plaintext sentinel must never
appear. New exceptions require an explicit policy-test and security-documentation
change.

`npm run check:security` scans the source for known credential and third-party
data patterns. Accepted exceptions are recorded in
[`security-exceptions.json`](./security-exceptions.json) with the rule, file,
pattern, and rationale.

## Note for contributors

Do not add code that:

- Sends prompt, output, or usage data to a third-party service without a recorded
  exception and user-facing disclosure.
- Writes a provider key outside the approved session-storage and encrypted-vault
  paths, or writes a key in plaintext.
- Adds third-party analytics, advertising, or tracking scripts.

Any pull request that violates these rules will be closed, even if the omission was
unintentional.

### Enforcement and accepted exceptions

- **Review checklist**: Contributors and reviewers verify compliance on every pull
  request using `.github/PULL_REQUEST_TEMPLATE.md`.
- **Automated scanning**: CI and the test suite run
  `node scripts/check-security-rules.mjs` through `npm run check:security`.
- **Accepted exceptions**: Any deliberate exception, such as an approved
  third-party integration or an opt-in encrypted vault, must be recorded in
  [`security-exceptions.json`](./security-exceptions.json).

## Supported versions

| Version                  | Supported        |
| ------------------------ | ---------------- |
| `main` branch            | Supported        |
| Older releases and forks | Best effort only |

## Reporting a problem

If you find a suspected security issue, do not open a public GitHub issue with the
details. Use the private
[security advisory form](https://github.com/DivyashreeR008/Open-Agents/security/advisories/new)
instead.

If that page is unavailable, open a public issue that only asks for a private way
to contact the maintainer. Do not include vulnerability details in it.

Tell us what you found and how to reproduce it. We aim to respond within 48 hours.
