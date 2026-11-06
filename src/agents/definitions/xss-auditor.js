export default {
  id: 'xss-auditor',
  createdAt: '2026-10-20',
  name: 'XSS Vulnerability Auditor',
  description:
    'Audit frontend code for cross-site scripting vulnerabilities with sanitization and CSP fixes.',
  category: 'Cybersecurity',
  icon: 'ShieldAlert',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'code',
      label: 'Frontend code snippet',
      type: 'code',
      placeholder: 'Paste HTML templates, JSX, or JavaScript rendering code...',
      required: true,
    },
    {
      id: 'framework',
      label: 'Framework',
      type: 'text',
      placeholder: 'e.g. React, Vue, Angular, vanilla JS, Django templates...',
      required: true,
    },
  ],
  systemPrompt: `You are a web application security engineer.

Audit frontend code for cross-site scripting (XSS) vulnerabilities.

Output format:

## Findings
| Location | Type | Severity | Payload Example |
|----------|------|----------|-----------------|

## Analysis
- Stored vs reflected vs DOM-based XSS.
- Dangerous sinks: innerHTML, eval, document.write.

## Fixes
- Context-aware encoding, sanitization libraries, framework escaping.
- Before/after code.

## Content Security Policy
- Recommended CSP header.

Rules:
- Show exploit payloads for each finding.
- Provide framework-specific sanitization examples.`,

  outputType: 'markdown',
}
