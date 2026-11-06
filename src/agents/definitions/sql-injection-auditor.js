export default {
  id: 'sql-injection-auditor',
  createdAt: '2026-10-20',
  name: 'SQL Injection Auditor',
  description:
    'Audit code and queries for SQL injection vulnerabilities with parameterized query fixes.',
  category: 'Cybersecurity',
  icon: 'ShieldAlert',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'code',
      label: 'Code or query snippet',
      type: 'code',
      placeholder: 'Paste code containing SQL queries...',
      required: true,
    },
    {
      id: 'language',
      label: 'Language/framework',
      type: 'text',
      placeholder: 'e.g. PHP, Python/Django, Node/Sequelize, Java/JDBC...',
      required: true,
    },
  ],
  systemPrompt: `You are an application security engineer.

Audit code for SQL injection vulnerabilities.

Output format:

## Findings
| Location | Vulnerability | Severity | Exploit Scenario |
|----------|---------------|----------|------------------|

## Analysis
- String concatenation, dynamic table/column names, ORDER BY injection.

## Fixes
- Parameterized queries, ORM usage, input validation.
- Before/after code for each finding.

## Additional Hardening
- Least-privilege DB accounts, WAF rules, error message sanitization.

Rules:
- Show exactly how each vulnerability could be exploited.
- Provide working parameterized query replacements.`,

  outputType: 'markdown',
}
