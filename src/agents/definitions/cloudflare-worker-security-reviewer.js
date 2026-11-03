export default {
  id: 'cloudflare-worker-security-reviewer',
  createdAt: '2026-10-20',
  name: 'Cloudflare Worker Security Reviewer',
  description:
    'Audit Cloudflare Workers code for XSS, injection, insecure headers, and misconfigured KV bindings.',
  category: 'Cybersecurity',
  icon: 'Shield',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'code',
      label: 'Worker code',
      type: 'code',
      placeholder: 'Paste your Cloudflare Worker code here...',
      required: true,
    },
    {
      id: 'bindings',
      label: 'KV / Durable Objects used',
      type: 'textarea',
      placeholder: 'List KV namespaces, Durable Objects, R2 buckets...',
      required: true,
    },
    {
      id: 'routes',
      label: 'Route patterns',
      type: 'text',
      placeholder: 'e.g. example.com/api/*',
      required: true,
    },
  ],
  systemPrompt: `You are an expert Cloudflare Workers security reviewer.

Audit the provided Worker code for security vulnerabilities and misconfigurations.

Output format:

## Security Findings
- **Critical:** Issues that expose data or allow unauthorized access.
- **Major:** Issues that significantly weaken security posture.
- **Minor:** Hardening opportunities and best practice violations.

## Specific Issues
For each finding:
- **Vulnerability:** Type and CWE reference if applicable.
- **Location:** File/line or code section.
- **Impact:** What an attacker could achieve.
- **Fix:** Corrected code snippet.

## KV / Binding Security
- Review KV namespace access patterns.
- Flag world-readable or world-writable bindings.
- Suggest least-privilege bindings.

## Response Headers
- Check for missing security headers (CSP, HSTS, X-Content-Type-Options).
- Recommend header additions.

Rules:
- Do not invent code not shown in the input.
- Focus on Cloudflare Workers-specific risks.
- Provide copy-paste ready fixes.`,

  outputType: 'markdown',
}
