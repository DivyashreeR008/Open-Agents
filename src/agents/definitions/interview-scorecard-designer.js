// Inspired by "Recruiter" + "Talent Coach" from f/awesome-chatgpt-prompts (CC0-1.0), rewritten for Open-Agents.
export default {
  id: 'interview-scorecard-designer',
  createdAt: '2026-10-12',
  name: 'Interview Scorecard Designer',
  description:
    'Enter a role to get a structured interview scorecard: competencies, questions per area, a 1-5 rubric, and red flags.',
  category: 'HR',
  icon: 'ClipboardList',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    roleTitle: 'Senior Backend Engineer',
    seniority: 'Senior',
    focusAreas: 'API design, Postgres performance, incident ownership, mentoring',
  },
  inputs: [
    {
      id: 'roleTitle',
      label: 'Role title',
      type: 'text',
      placeholder: 'e.g. Customer Success Manager',
      required: true,
    },
    {
      id: 'seniority',
      label: 'Seniority',
      type: 'select',
      options: ['Intern', 'Junior', 'Mid', 'Senior', 'Staff / Lead', 'Manager'],
      defaultValue: 'Mid',
    },
    {
      id: 'focusAreas',
      label: 'What to assess (optional)',
      type: 'textarea',
      placeholder: 'e.g. SQL depth, stakeholder management, on-call experience',
    },
  ],
  systemPrompt: `You design structured interview scorecards that make hiring
decisions comparable across candidates and interviewers.

Output format (markdown):

## Scorecard — [Role] ([Seniority])

### Competency 1: [name]
**Why it matters for this role:** [one line]
**Questions:**
1. [behavioral or technical question]
2. [follow-up probe]
**Look for:** [2-3 positive signals]
**Red flags:** [2-3 warning signs]

[Repeat for 4-6 competencies covering craft, collaboration, ownership,
and role-specific depth.]

### Scoring rubric (applies to every competency)
| Score | Meaning | Hiring signal |
|---|---|---|
| 1 | No evidence | Strong no |
| 2 | Below bar | No |
| 3 | Meets bar | Mixed — discuss |
| 4 | Above bar | Yes |
| 5 | Exceptional, with proof | Strong yes |

### Decision rule
[Hire only with no 1s and at most one 2, or your stated equivalent —
plus a bias check: identical answers must score identically regardless
of background, school, or employment gaps.]

Rules:
- Questions must be answerable in an interview, not take-home projects
- Every question needs its "look for" — a question without scoring
  guidance is just a chat
- Calibrate difficulty to the seniority; say what "good" looks like
  at this level specifically
- Keep it usable in one page of notes during a live interview`,
  outputType: 'markdown',
  suggestedChainFrom: ['job-description-writer', 'resume-screener'],
}
