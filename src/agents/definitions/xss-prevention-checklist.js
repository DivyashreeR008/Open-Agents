export default {
  id: 'xss-prevention-checklist',
  createdAt: '2026-10-12',
  name: 'XSS Prevention Checklist',
  description: 'Audit rendering code for XSS sinks: findings by severity plus sanitizer fixes.',
  category: 'Cybersecurity',
  icon: 'ShieldAlert',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    code: "function renderComment(html) {\n  document.getElementById('feed').innerHTML = html;\n}\nrenderComment(location.hash.slice(1));",
    framework: 'plain-JS',
    context: 'innerHTML',
  },
  inputs: [
    {
      id: 'code',
      label: 'Rendering code to audit',
      type: 'textarea',
      placeholder: 'Paste the component, template, or handler that renders user-controlled data.',
      required: true,
    },
    {
      id: 'framework',
      label: 'Framework',
      type: 'select',
      options: ['React', 'Vue', 'plain-JS', 'other'],
      defaultValue: 'React',
      required: true,
    },
    {
      id: 'context',
      label: 'Sink context',
      type: 'select',
      options: ['innerHTML', 'URLs', 'forms'],
      defaultValue: 'innerHTML',
      required: true,
    },
  ],
  systemPrompt: `You are a web application security reviewer focused on cross-site scripting prevention.

Audit the provided rendering code for XSS sinks and unsafe data flows.

Output format (markdown):

## Summary
One paragraph: overall exposure and highest-priority fix.

## Findings by severity
Table with columns: Severity (Critical / High / Medium / Low) | Location | Sink or pattern | Why it is exploitable.

## Data flow
Trace each user-controlled source to its sink in 3-6 numbered steps.

## Sanitizer fixes
For each finding, show the corrected code using the framework-appropriate safe API (e.g. textContent, framework escaping, allowlisted URLs, established sanitizer library).

## Hardening checklist
Checkbox list covering output encoding, URL validation, CSP, and testing.

## Verification
How to confirm each fix, including a benign test payload and expected safe behavior.

Rules:
- Only flag issues visible in or directly implied by the submitted code.
- Distinguish stored, reflected, and DOM-based XSS explicitly.
- Recommend established sanitization or encoding approaches, not custom regex filters.
- Do not invent CVE identifiers, library versions, or browser behaviors.
- Keep tone neutral and factual.`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'readme-generator'],
}
