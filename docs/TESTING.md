# Testing and offline provider development

Most of this repository can be exercised without credentials. The exception used to be provider calls: running an agent, opening a stream, or checking an error state all needed a real key and a real provider account. `src/lib/mockProvider.js` removes that barrier by replacing `fetch` with a deterministic adapter at the provider boundary.

## Fast local checks

```bash
npm test                              # full Vitest suite once
npx vitest run src/lib/llmAdapter.js  # one file while iterating
npm run check:security                # credential and third-party rules
npm run verify                        # tests, build, and bundle-size check
```

Tests must not call live providers. Use the mock adapter or a fixture instead of a real key. A test that needs a network connection belongs behind an explicit opt-in and outside the default suite.

## Run a provider flow offline

```js
import { runAgent, streamAgent } from './llmAdapter'
import { MOCK_API_KEY, MOCK_CHAT_MODEL, createMockFetch } from './mockProvider'

const mockFetch = createMockFetch()
globalThis.fetch = mockFetch

const result = await runAgent({
  provider: 'openai',
  model: MOCK_CHAT_MODEL,
  apiKey: MOCK_API_KEY,
  systemPrompt: 'Answer in one sentence.',
  userMessage: 'Explain a mock provider.',
})

// Streaming uses the same real parser and returns the joined response.
const streamed = await streamAgent({
  provider: 'anthropic',
  model: MOCK_CHAT_MODEL,
  apiKey: MOCK_API_KEY,
  systemPrompt: '',
  userMessage: 'Stream a deterministic reply.',
  onChunk: (chunk) => process.stdout.write(chunk),
})
```

The default reply is `Mock provider response to: <prompt>`. Pass `{ response: 'Fixed fixture output' }` when a test needs exact text. The adapter records requests in `mockFetch.calls`; `mockFetch.reset()` clears them. Recorded calls include the method, provider, streaming flag, prompt, and redacted URL. They do not include request headers or query strings.

### Use it in the running app

In a development build, install the mock from the browser console, then enter any non-empty value (for example `mock-key`) in the app's key bar:

```js
const { installMockFetch } = await import('/src/lib/mockProvider.js')
const mock = installMockFetch()
// Run any agent against any provider. The request stays in this tab.
mock.restore()
```

`mock.restore()` puts the browser's real `fetch` back. Reloading the page also clears the install. The mock is never imported by application code, so it adds nothing to the production bundle.

## Success shapes

| Feature                                | Covered by the mock                                   |
| -------------------------------------- | ----------------------------------------------------- |
| OpenAI-compatible one-shot responses   | `runAgent` for `openai` and `openrouter`              |
| OpenAI-compatible SSE streams          | `streamAgent`, including the end marker               |
| Anthropic message responses and events | `runAgent` and `streamAgent`                          |
| Gemini generate and stream responses   | `runAgent`, `streamAgent`, and `fetchGeminiModels`    |
| Token usage                            | Deterministic prompt and completion token counts      |
| Streaming chunks                       | Split into fixed chunks and joined by the real parser |

Use `installMockFetch` and call `restore` in `afterEach` when a test replaces global fetch:

```js
let mock

beforeEach(() => {
  mock = installMockFetch()
})

afterEach(() => {
  mock.restore()
})
```

## Failure scenarios

Pass a scenario to exercise the same error paths as a provider outage:

| Scenario        | What it returns or throws                    | What it exercises                                |
| --------------- | -------------------------------------------- | ------------------------------------------------ |
| `invalid-key`   | HTTP 401 with a provider error body          | Invalid-key handling                             |
| `rate-limit`    | HTTP 429 every attempt with `Retry-After: 0` | The real retry loop, then a `rate_limited` error |
| `quota`         | HTTP 429 with `insufficient_quota`           | Quota classification with no retry               |
| `network`       | `TypeError: Failed to fetch`                 | Connection-failure copy                          |
| `server`        | HTTP 503 with a provider error body          | Service-unavailable copy                         |
| `stream-cutoff` | A content chunk followed by a closed stream  | Incomplete-stream detection and `partialContent` |
| `success`       | Normal response or stream                    | The default path                                 |

```js
import { createMockFetch } from './mockProvider'

globalThis.fetch = createMockFetch({ scenario: 'stream-cutoff' })
```

Unknown scenarios throw at creation time instead of silently succeeding. `MOCK_SCENARIOS` is the complete list.

## Writing a provider-adjacent test

1. Replace only `fetch`; keep `runAgent`, `streamAgent`, retry policy, and parsers real.
2. Use `MOCK_API_KEY` rather than a real key or a realistic-looking fake secret.
3. Assert on visible behaviour (content, chunks, error type, call count), not on private modules.
4. Restore global fetch even when the test fails.
5. Prefer a factory per test over a shared global mock so calls and scenarios cannot leak between tests.

For coverage of the mock itself, run `npx vitest run src/lib/mockProvider.b9.test.js`.
