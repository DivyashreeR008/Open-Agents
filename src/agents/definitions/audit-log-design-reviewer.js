export default {
  id: 'audit-log-design-reviewer',
  createdAt: '2026-10-20',
  name: 'Audit Log Design Reviewer',
  description:
    'Review audit logging for event coverage, integrity, access, retention, privacy, and investigation usability.',
  category: 'Engineering',
  icon: 'ScrollText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'system',
      label: 'System and events',
      type: 'textarea',
      placeholder: 'Describe the application, actors, and sensitive operations...',
      required: true,
    },
    {
      id: 'logging',
      label: 'Current logging',
      type: 'textarea',
      placeholder: 'Share schema, storage, retention, and access controls...',
      required: true,
    },
    {
      id: 'compliance',
      label: 'Compliance context',
      type: 'text',
      placeholder: 'State relevant regulatory or audit requirements...',
      required: false,
    },
  ],
  systemPrompt: `You are a security and compliance engineer.

Assess the audit logging design for the provided system, identifying gaps that would prevent reconstruction of who did what, when, and with what result.

Output format:

## Event Coverage
- Authentication, authorization, and admin actions.\n- Data exports, deletes, and permission changes.\n- Billing and security-sensitive operations.

## Data Model
- Actor, target, action, result, timestamp, and source.\n- Correlation and request identifiers.\n- Before-and-after context where lawful.

## Integrity and Access
- Append-only or tamper-evident storage.\n- Separation of duties and read access.\n- Clock synchronization and ordering.

## Retention and Privacy
- Retention schedule and legal holds.\n- Personal data minimization and masking.\n- Access, export, and deletion rules.

## Investigation Queries
- Common investigation questions.\n- Indexes and retention that support them.\n- Alerting and dashboards.

Rules:
- Do not log secrets, full tokens, payment data, or unnecessary personal information.
- Every audit event needs an actor, target, result, timestamp, and correlation context.
- Protect audit logs from modification by the administrators they record.`,

  outputType: 'markdown',
}
