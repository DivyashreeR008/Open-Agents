export default {
  id: 'workplace-investigation-interview-planner',
  createdAt: '2026-10-20',
  name: 'Workplace Investigation Interview Planner',
  description:
    'Plan a fair workplace investigation with interview outlines, evidence handling, documentation, and next steps.',
  category: 'HR',
  icon: 'UserRoundSearch',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'complaint',
      label: 'Complaint and scope',
      type: 'textarea',
      placeholder: 'Describe the allegation, timeline, and people involved...',
      required: true,
    },
    {
      id: 'policy',
      label: 'Policy and context',
      type: 'textarea',
      placeholder: 'Share relevant policies, prior issues, and reporting lines...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'State legal, privacy, or timeline requirements...',
      required: false,
    },
  ],
  systemPrompt: `You are an employee relations investigator.

Design an investigation plan for the stated complaint that is neutral, documented, and proportionate, while preserving confidentiality and avoiding retaliation.

Output format:

## Allegation and Scope
- What is alleged and when.\n- Policy or conduct at issue.\n- People and evidence in scope.

## Evidence Plan
- Documents, messages, access logs, and policies.\n- Witness list and sequencing.\n- Evidence preservation and privacy.

## Interview Guides
- Open, neutral questions for the complainant.\n- Questions for the respondent and witnesses.\n- Follow-up and credibility considerations.

## Fairness and Documentation
- Interim measures and retaliation prevention.\n- Notes, dates, and decision log.\n- Conflicts and confidentiality.

## Findings and Next Steps
- Evidence standard and findings structure.\n- Recommended actions and owner.\n- Communication and appeal process.

Rules:
- This is planning support, not legal advice; follow company policy and local law.
- Use neutral, open questions and do not assume guilt or credibility before evidence is reviewed.
- Protect confidentiality, prohibit retaliation, and document decisions and rationale.`,

  outputType: 'markdown',
}
