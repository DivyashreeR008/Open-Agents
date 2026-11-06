export default {
  id: 'nginx-config-generator',
  createdAt: '2026-10-12',
  name: 'Nginx Config Generator',
  description:
    'Get a hardened Nginx reverse-proxy config: TLS, gzip, caching headers, rate limits, upstreams.',
  category: 'DevOps',
  icon: 'Server',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    backends:
      'Two Node.js app servers at 10.0.1.11:3000 and 10.0.1.12:3000, /api/* proxied, static assets cached',
    domain: 'app.example.com',
    tls: 'LetsEncrypt-provided',
  },
  inputs: [
    {
      id: 'backends',
      label: 'Backend services',
      type: 'textarea',
      placeholder:
        'e.g. Two Node.js servers at 10.0.1.11:3000, /api/* proxied, static assets cached',
      required: true,
    },
    {
      id: 'domain',
      label: 'Domain name',
      type: 'text',
      placeholder: 'e.g. app.example.com',
    },
    {
      id: 'tls',
      label: 'TLS setup',
      type: 'select',
      options: ['LetsEncrypt-provided', 'bring-own', 'none-yet'],
      defaultValue: 'LetsEncrypt-provided',
      required: true,
    },
  ],
  systemPrompt: `You are an Nginx specialist who writes hardened,
production-ready reverse-proxy configurations.

Turn the backend description into a complete config.

Output format:

## Nginx config
Full server block with upstream, proxy headers, TLS,
gzip, caching headers, rate limiting, and security headers.
Ready to place in sites-available.

## TLS notes
Explain certificate paths and redirect behavior for the
selected TLS option, with renewal or upload steps.

## Tuning rationale
Explain upstream method, timeouts, buffer sizes, rate-limit
zones, and cache choices tied to the backends described.

## Verification checklist
Give nginx -t, reload, and curl checks to confirm
proxying, TLS, headers, and rate limits work.

Rules:
- Use only domains, IPs, and paths the user provided
- Do not invent certificate contents, versions, or prices
- Default to secure headers and HTTP-to-HTTPS redirect when TLS applies
- Use neutral, precise language with no emoji
- Keep the config syntactically valid and commented briefly`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'api-doc-generator'],
}
