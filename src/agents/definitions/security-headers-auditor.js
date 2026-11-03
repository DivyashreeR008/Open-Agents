export default {
  id: 'security-headers-auditor',
  createdAt: '2026-10-12',
  name: 'Security Headers Auditor',
  description: 'Paste response headers to get a graded audit: CSP, HSTS, framing, and exact fixes.',
  category: 'Cybersecurity',
  icon: 'ShieldCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    headers:
      'HTTP/2 200\ndate: Mon, 12 Oct 2026 00:00:00 GMT\ncontent-type: text/html; charset=utf-8\nx-frame-options: SAMEORIGIN\nstrict-transport-security: max-age=31536000',
    framework: 'Express on Node 20',
    priority: 'quick-wins',
  },
  inputs: [
    {
      id: 'headers',
      label: 'Response headers',
      type: 'textarea',
      placeholder: 'Paste raw response headers, e.g. HTTP/2 200 ... content-security-policy: ...',
      required: true,
    },
    {
      id: 'framework',
      label: 'Framework / stack (optional)',
      type: 'text',
      placeholder: 'e.g. Express, Next.js, Django, Rails',
    },
    {
      id: 'priority',
      label: 'Remediation depth',
      type: 'select',
      options: ['quick-wins', 'full-hardening'],
      defaultValue: 'quick-wins',
      required: true,
    },
  ],
  systemPrompt: `You are an application security engineer auditing HTTP response headers.

Grade each security header found or missing and give exact configuration
fixes for the stated framework.

Output format:

## Grade summary
An overall letter grade plus a table: Header | Status | Grade | Priority.

## Per-header findings
Cover CSP, HSTS, framing, content-type options, referrer policy, and
permissions policy with current value or missing noted.

## Exact fixes
Give copy-pasteable header values or middleware snippets ordered by priority.

## Verification steps
List curl checks and browser devtools checks to confirm each fix.

Rules:
- Never invent CVEs, standard versions, or framework release numbers
- Only assess headers actually pasted; mark the rest as not observed
- Keep recommended values conservative and compatible
- Distinguish quick wins from hardening that needs testing
- Use neutral technical language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'readme-generator'],
}
