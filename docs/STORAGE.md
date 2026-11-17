# Browser storage

Open Agents is local-first. Unless optional Supabase configuration is present, the data described here stays in the browser on this device. Nothing in this document is sent to the project maintainers.

There are four storage surfaces:

- `localStorage` for durable preferences and feature data.
- `sessionStorage` for secrets that should disappear when the tab closes.
- IndexedDB for one non-exportable encryption key used by the automation vault.
- Supabase's own auth storage when the optional backend is configured.

## `localStorage` keys

| Key                                  | Written by                         | What it contains                                                                         | How to clear it                                                        |
| ------------------------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `OpenAgents_history`                 | Run history and recent-agent hooks | Completed agent runs, newest first.                                                      | Clear History in the app, or clear site data.                          |
| `recentAgents`                       | Home and agent pages               | A short list of recently opened agent ids.                                               | Clear site data.                                                       |
| `OpenAgents_banner_dismissed`        | Home page                          | Whether the welcome banner was dismissed.                                                | Clear site data.                                                       |
| `OpenAgents_default_provider`        | Key settings                       | Provider id used when no key is chosen explicitly. Removed when its key is cleared.      | Settings > Clear all keys, or clear site data.                         |
| `oa_favorites`                       | Favorites hook                     | Favourite agent ids.                                                                     | Clear site data.                                                       |
| `oa_agent_collections`               | Collections hook                   | Collections, names, and ordered agent ids, including the default collection.             | Delete collections in the app, or clear site data.                     |
| `oa_prompt_history`                  | Prompt history hook                | Up to 100 recent prompts.                                                                | Clear prompt history, or clear site data.                              |
| `oa_ratings`                         | Agent ratings                      | Aggregated star ratings for agents.                                                      | Clear site data.                                                       |
| `oa_rating_votes`                    | Agent ratings                      | Which agents this browser has rated.                                                     | Clear site data.                                                       |
| `oa_analytics`                       | Analytics hook                     | Up to 500 local run events used by the analytics page.                                   | Clear analytics in the app, or clear site data.                        |
| `oa_analytics_seeded`                | Analytics hook                     | One-time marker that history was already copied into analytics.                          | Clear site data.                                                       |
| `oa_session_spend`                   | Session spend hook                 | Token counts and estimated spend for the current browser session.                        | Reset session spend, close the tab after clearing, or clear site data. |
| `oa_marketplace_listings`            | Marketplace service                | Published agent listings, descriptions, prompts, and import counts.                      | Delete listings, or clear site data.                                   |
| `oa_marketplace_drafts`              | Marketplace service                | Draft listings that have not been published.                                             | Delete drafts, or clear site data.                                     |
| `oa_marketplace_votes`               | Marketplace service                | Ratings the browser has given to listings.                                               | Clear site data.                                                       |
| `oa_automations_v2`                  | Automations service                | Automation definitions, schedules, and settings. API keys are not stored in this record. | Delete automations, or clear site data.                                |
| `oa_automation_runs_v2`              | Automations service                | Automation run history, including skipped and missed runs.                               | Clear automation history, or clear site data.                          |
| `oa_automation_email_logs_v2`        | Automations service                | The most recent 50 email delivery attempts.                                              | Clear site data.                                                       |
| `oa_encrypted_vault_v2`              | Automations service                | Ciphertext for automation provider keys. The matching key lives in IndexedDB.            | Remove the automation key, or clear site data.                         |
| `oa_missed_runs_banner_dismissed_at` | Automations page                   | Timestamp for the last dismissed missed-run notice.                                      | Clear site data.                                                       |
| `oa_scheduled_jobs`                  | Scheduler hook                     | Scheduled job definitions without their API keys.                                        | Delete scheduled jobs, or clear site data.                             |
| `oa_scheduler_results`               | Scheduler hook                     | Recent scheduled-job results.                                                            | Clear site data.                                                       |
| `oa_execution_traces`                | Execution trace helper             | Up to 20 workflow traces with bounded step input and output.                             | Clear traces in the app, or clear site data.                           |
| `oa_theme`                           | Theme helper                       | `light` or `dark`. The key is absent when the system theme is followed.                  | Choose the system theme, or clear site data.                           |
| `sidebar-category-collapsed-state`   | Sidebar                            | Which catalogue categories are collapsed.                                                | Clear site data.                                                       |

`oa_analytics_update` is a browser event name, not a stored key.

## `sessionStorage` keys

Session storage disappears when the tab closes. API keys are also wrapped with an eight-hour expiry, so a long-lived tab does not keep a key indefinitely.

| Key pattern                                                                                               | What it contains                                                         | Expiry and clearing                                                                  |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `OpenAgents_openai_key`, `OpenAgents_anthropic_key`, `OpenAgents_gemini_key`, `OpenAgents_openrouter_key` | JSON `{ key, expiresAt }` for the key settings page.                     | Eight hours; cleared by the matching key action, Clear all keys, or closing the tab. |
| `oa_apikey_<provider>`                                                                                    | JSON `{ key, expiresAt }` used by the agent key bar and workflow runner. | Eight hours; cleared when the key is removed or the tab closes.                      |
| `oa_scheduler_key_<jobId>`                                                                                | Provider key for one scheduled job.                                      | Cleared when the job or key is removed, or the tab closes.                           |

Older builds wrote plaintext provider keys to `localStorage`. The key helpers migrate a legacy value into session storage with a fresh expiry and delete the local copy. A short-lived legacy plaintext value may still be migrated the first time it is read.

## IndexedDB

The automation vault uses database `open-agents-secure-keystore`, version `1`, object store `crypto-keys`, record id `automation-vault-v2`. The record is a non-extractable AES-GCM `CryptoKey`; the encrypted values are the `oa_encrypted_vault_v2` entry in `localStorage`.

Deleting the IndexedDB record makes existing vault ciphertext unreadable. Clearing only `localStorage` leaves the device key behind but removes the ciphertext.

## Supabase and service worker storage

When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured, the Supabase client stores its own auth session under a `sb-<project-ref>-auth-token` key in `localStorage`. That key is managed by Supabase, not by the Open Agents storage helpers. Clearing site data signs the browser out.

The production build registers a service worker. Cache Storage entries belong to the worker and are replaced when a new version activates; they do not contain feature data beyond the cached app shell and assets.

## Clearing browser data

- **Clear a provider key** in Settings removes that session key, its scheduled-job copies, and the default-provider preference if it pointed at that provider.
- **Clear all keys** in Settings removes every provider key and the default-provider preference. It does not delete history, collections, prompts, automations, or listings.
- **Clear History**, **Clear analytics**, and the prompt-history clear action remove only the feature named in the control.
- **Clear saved data** on the app error screen clears `localStorage` and `sessionStorage`, then reloads. It does not delete the IndexedDB device key. Use the browser's site-data controls when you also want to remove the vault key.
- **Clear site data** in the browser removes local storage, session storage, IndexedDB, and Cache Storage for the origin. It cannot be undone.

Before sharing a diagnostic export or a marketplace listing, remove pasted secrets. Marketplace storage sanitizes credential-shaped fields, but that is a safety net, not a licence to publish keys.
