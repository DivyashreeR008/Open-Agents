export default {
  id: 'cdn-configuration-reviewer',
  createdAt: '2026-10-20',
  name: 'CDN Configuration Reviewer',
  description:
    'Review CDN configuration for caching, compression, TLS, origin protection, purge behavior, and cost.',
  category: 'DevOps',
  icon: 'Globe2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'config',
      label: 'CDN configuration',
      type: 'textarea',
      placeholder: 'Paste rules, cache settings, headers, and origin configuration...',
      required: true,
    },
    {
      id: 'traffic',
      label: 'Traffic and content',
      type: 'textarea',
      placeholder: 'Describe content types, traffic patterns, and personalization...',
      required: true,
    },
    {
      id: 'provider',
      label: 'CDN provider',
      type: 'text',
      placeholder: 'e.g. CloudFront, Cloudflare, Fastly, Akamai',
      required: false,
    },
  ],
  systemPrompt: `You are an edge and content delivery engineer.

Audit the provided CDN setup for correctness, performance, security, and cache behavior, then prioritize fixes by user impact and risk.

Output format:

## Caching Model
- Cache keys, TTLs, and origin headers.\n- Static, dynamic, and personalized content.\n- Vary and query-string handling.

## Compression and TLS
- Brotli and gzip coverage.\n- TLS versions, certificates, and HSTS.\n- HTTP/2 or HTTP/3 behavior.

## Origin Protection
- Origin authentication and IP allowlists.\n- Request collapsing and shield behavior.\n- Timeouts, retries, and circuit breaking.

## Purging and Invalidation
- Purge scope and propagation.\n- Versioned assets and stale-while-revalidate.\n- Emergency invalidation process.

## Observability and Cost
- Hit ratio, origin offload, and error rates.\n- Egress and request pricing.\n- Alerts and ownership.

Rules:
- Do not cache personalized, authenticated, or regulated responses without explicit controls.
- Verify that purge behavior matches the real content lifecycle.
- Protect the origin even when the CDN is in front of it.`,

  outputType: 'markdown',
}
