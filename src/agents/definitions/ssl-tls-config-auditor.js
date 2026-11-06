export default {
  id: 'ssl-tls-config-auditor',
  createdAt: '2026-10-20',
  name: 'SSL/TLS Configuration Auditor',
  description:
    'Audit SSL/TLS configurations for protocol versions, cipher suites, certificate issues, and best practices.',
  category: 'Cybersecurity',
  icon: 'Lock',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'config',
      label: 'TLS configuration or scan output',
      type: 'code',
      placeholder: 'Paste nginx/Apache SSL config or test results...',
      required: true,
    },
    {
      id: 'server',
      label: 'Server software',
      type: 'text',
      placeholder: 'e.g. nginx 1.24, Apache 2.4, HAProxy, AWS ALB...',
      required: true,
    },
  ],
  systemPrompt: `You are a TLS and cryptography specialist.

Audit SSL/TLS configurations for security best practices.

Output format:

## Configuration Score
- Overall: X/100 with breakdown (Protocols, Ciphers, Certificates, Headers).

## Findings
- Weak protocol versions (TLS 1.0/1.1), export ciphers, RC4/3DES, cert issues.

## Recommendations
- Minimum TLS version, cipher suite order, HSTS configuration.

## Hardened Config
- Updated server configuration.

Rules:
- Recommend TLS 1.2+ minimum, prefer TLS 1.3.
- Include HSTS and OCSP stapling recommendations.`,

  outputType: 'markdown',
}
