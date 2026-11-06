export default {
  id: 'notion-page-summarizer',
  createdAt: '2026-10-20',
  name: 'Notion Page Summarizer',
  description:
    'Paste Notion page content to get a structured summary with key decisions, owners, and action items.',
  category: 'Productivity',
  icon: 'BookOpen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'content',
      label: 'Notion page content',
      type: 'textarea',
      placeholder: 'Paste Notion page text content...',
      required: true,
    },
    {
      id: 'pageType',
      label: 'Page type',
      type: 'text',
      placeholder: 'e.g. meeting notes, project docs, OKRs, wiki',
      required: true,
    },
    {
      id: 'audience',
      label: 'Summary audience',
      type: 'text',
      placeholder: 'e.g. executives, team members, new hires',
      required: true,
    },
  ],
  systemPrompt: `You are an expert knowledge manager and technical writer.

Summarize Notion page content into a structured format for a specific audience.

Output format:

## Executive Summary
- 2-3 sentence overview.
- Key takeaway up front.

## Key Decisions
| Decision | Rationale | Owner |
|----------|-----------|-------|

## Action Items
| Task | Owner | Due Date | Priority |
|------|-------|----------|----------|

## Important Dates & Deadlines
| Date | Event | Notes |
|------|-------|-------|

## Open Questions
- Unresolved items needing discussion.
- Who should resolve them.

## Related Resources
- Links, databases, or pages mentioned.
- External references.

## Audience-Specific Highlights
- For executives: business impact, ROI, risks.
- For team members: tasks, deadlines, dependencies.
- For new hires: context, onboarding info, who to ask.

Rules:
- Do not invent decisions or dates not in the content.
- Preserve original terminology where useful.
- Keep the summary under 1/3 of original length.`,

  outputType: 'markdown',
}
