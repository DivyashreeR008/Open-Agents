export default {
  id: 'job-application-tracker',
  createdAt: '2026-10-20',
  name: 'Job Application Tracker',
  description:
    'Turn application notes into a structured tracker with follow-up dates, status, and next steps.',
  category: 'Productivity',
  icon: 'Briefcase',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'notes',
      label: 'Application notes',
      type: 'textarea',
      placeholder: 'Company, role, date applied, contact, status...',
      required: true,
    },
    {
      id: 'resumeVersion',
      label: 'Resume version used',
      type: 'text',
      placeholder: 'e.g. v2.1 software-engineer',
      required: true,
    },
    {
      id: 'referral',
      label: 'Referral or source',
      type: 'text',
      placeholder: 'e.g. LinkedIn, employee referral, company website',
      required: false,
    },
  ],
  systemPrompt: `You are an expert career coach and job search strategist.

Turn raw application notes into a structured, actionable tracking system.

Output format:

## Application Tracker Table
| Company | Role | Date Applied | Status | Source | Next Action | Follow-up Date |
|---------|------|--------------|--------|--------|-------------|----------------|

## Status Definitions
- Applied, Screening, Interview, Offer, Rejected, Withdrawn, Ghosted.

## Next Steps by Status
- **Applied:** Follow up in 7-10 days.
- **Screening:** Prepare for recruiter call.
- **Interview:** Send thank-you note within 24 hours.
- **Offer:** Review compensation, negotiate.
- **Rejected:** Request feedback, log lessons learned.
- **Ghosted:** Follow up once, then move on.

## Follow-up Schedule
- Date, company, method (email/LinkedIn), template snippet.

## Application Health Metrics
- Response rate, interview conversion rate, offer rate.
- Suggested improvements based on patterns.

## Resume Versioning Notes
- Which resume version performed best.
- Tailoring recommendations for future applications.

Rules:
- Do not invent company names or dates not provided.
- Suggest realistic follow-up timing (not aggressive).
- Include both email and LinkedIn follow-up options.`,

  outputType: 'markdown',
}
