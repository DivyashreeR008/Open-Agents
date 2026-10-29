# Security

## How Open-Agents Keeps Your API Key Safe

Open-Agents works on a simple principle — your API key never leaves your browser for core runs.

Here is exactly what happens:

- You paste your API key into the app
- The app sends your request directly to OpenAI, Anthropic, or Google — no middleman
- Your key is never saved anywhere — not in a database, not in cookies, not in localStorage
- There is no backend server that sees your key for standard runs
- There is no analytics or tracking of any kind

To verify this yourself, check the files that handle your key:

- `src/lib/llmAdapter.js`
- `src/lib/useApiKey.js`

Both are short and easy to read.

> Note: scheduled automations require explicit opt-in. Their API key is encrypted
> locally with AES-GCM using a random, non-extractable key held in this browser
> profile's IndexedDB. The ciphertext is not uploaded to Supabase. This protects
> against someone copying localStorage alone; it does not protect against XSS or a
> person who controls the same unlocked browser profile. Clearing site data or using
> another device requires the key to be entered again. If WebCrypto or IndexedDB is
> unavailable, the app refuses to store the credential.

### Enforced credential-persistence policy

`src/lib/keyPersistencePolicy.test.jsx` exercises the durable-storage, recorded-run,
trace, and export boundaries with a sentinel credential. The test fails if plaintext
reaches `localStorage`, a recorded entry, or an exported file. The versioned encrypted
automation vault is the only reviewed persistence exception; even there, the plaintext
sentinel must never appear. New exceptions require an explicit policy-test and security
documentation change.

## Note for Contributors

If you are contributing code, please do not add anything that:

- Sends data to a third-party service
- Logs or stores the API key anywhere
- Adds analytics or tracking scripts

Any PR that does this will be closed, even if it was not intentional.

## Supported Versions

| Version | Supported |
|---------|-----------|
| main branch | ✅ |
| Older releases / forks | ❌ Best-effort only |

## Found a Problem?

If you find something that looks like a security issue, please **do not open a public GitHub issue**.

Instead, [report it privately](https://github.com/DivyashreeR008/Open-Agents/security/advisories/new) (GitHub > Security > Report a vulnerability).

If that page is unavailable, open a public issue that only asks for a private way to
reach the maintainer. Do not include any details of the vulnerability in it.

Tell us what you found and how to reproduce it. We aim to respond within 48 hours.

Thank you for keeping Open-Agents and its users safe. 🙏
