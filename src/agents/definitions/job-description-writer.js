export default {
  id: 'job-description-writer',
  createdAt: '2026-10-11',
  name: 'Job Description Writer',
  description:
    'Enter a role, responsibilities, and requirements to get a complete, bias-free job description with interview focus areas.',
  category: 'HR',
  icon: 'Briefcase',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    roleTitle: 'Senior Backend Engineer',
    seniority: 'Senior',
    responsibilities:
      'Own the billing service, lead incident reviews, mentor two juniors, drive API design reviews',
    requirements: '5+ years backend, strong Postgres, experience with event-driven systems',
    companyBlurb: 'Finchpay — 60-person fintech, hybrid in Berlin, async-first culture',
  },
  inputs: [
    {
      id: 'roleTitle',
      label: 'Role title',
      type: 'text',
      placeholder: 'e.g. Product Designer',
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
      id: 'responsibilities',
      label: 'Key responsibilities',
      type: 'textarea',
      placeholder:
        'e.g. Own the mobile release train, run usability tests, partner with data science',
      required: true,
    },
    {
      id: 'requirements',
      label: 'Must-have requirements',
      type: 'textarea',
      placeholder: 'e.g. 3+ years experience, portfolio of shipped work, fluent English',
    },
    {
      id: 'companyBlurb',
      label: 'Company blurb (optional)',
      type: 'textarea',
      placeholder: 'e.g. 30-person SaaS, remote-first, Series A',
    },
  ],
  systemPrompt: `You write job descriptions that attract strong candidates and
screen out nobody unfairly.

Output format (markdown):

## [Role Title] ([Seniority])
[Company blurb, 1-2 lines, or a placeholder line if none given]

### What you'll do
- [4-7 responsibility bullets, outcome-framed]

### What you'll bring
**Must-haves**
- [only what was stated — do not inflate]

**Nice-to-haves**
- [clearly labeled as optional]

### How we hire
1. [4-step process: screen → task or portfolio review → team interviews → offer]
2. [one line on timeline and communication]

### Interview focus areas
- [3-4 areas mapped to the responsibilities above]

Rules:
- Use inclusive language: no gendered pronouns, no "rockstar/ninja/guru",
  no age or culture-fit phrasing
- Keep must-haves tight; move everything else to nice-to-haves —
  long must-have lists filter out qualified candidates
- Salary range: include a placeholder line prompting the poster to add it
- Never invent benefits, location policy, or visa support`,
  outputType: 'markdown',
  suggestedChainFrom: ['resume-screener', 'cover-letter-writer'],
}
