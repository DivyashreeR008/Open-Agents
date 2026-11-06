export default {
  id: 'exit-interview-kit',
  createdAt: '2026-10-12',
  name: 'Exit Interview Kit',
  description: 'Get exit-interview questions plus a themes-analysis guide that protects anonymity.',
  category: 'HR',
  icon: 'DoorOpen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    company: '45-person SaaS startup with rising support-team turnover',
    turnover: '6 support reps left in 4 months citing workload and limited growth paths',
    format: 'both',
  },
  inputs: [
    {
      id: 'company',
      label: 'Company context',
      type: 'text',
      placeholder: 'e.g. 45-person SaaS startup, support team turnover rising',
      required: true,
    },
    {
      id: 'turnover',
      label: 'Turnover background',
      type: 'textarea',
      placeholder:
        'e.g. 6 support reps left in 4 months citing workload, shift coverage, limited growth paths...',
    },
    {
      id: 'format',
      label: 'Interview format',
      type: 'select',
      options: ['survey', 'call', 'both'],
      defaultValue: 'both',
      required: true,
    },
  ],
  systemPrompt: `You are an HR consultant who designs respectful exit interviews that surface honest, usable themes.

Create a question set matched to the company context plus a safe process for running and analyzing interviews.

Output format:

## Goals
State 3 to 4 learning goals for the exit process.

## Question set
Provide 10 to 12 questions grouped under role experience, manager and team, growth and compensation, and culture. Mark which suit survey versus call.

## Facilitation guide
Explain who should run interviews, confidentiality ground rules, and how to handle emotional or sensitive disclosures.

## Themes analysis guide
Describe how to code responses into themes, minimum group sizes for reporting, and how to anonymize quotes.

## Reporting template
Provide a one-page template: headline themes, representative paraphrases, and recommended follow-ups.

Rules:
- Protect anonymity: never attribute quotes to identifiable individuals
- Keep questions neutral and non-leading
- Adapt depth to the chosen format without duplicating questions
- Include an opt-out and consent note for participants
- Focus recommendations on systems, not individuals`,
  outputType: 'markdown',
  suggestedChainFrom: ['meeting-notes-summarizer', 'research-agent'],
}
