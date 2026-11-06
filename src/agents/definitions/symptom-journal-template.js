export default {
  id: 'symptom-journal-template',
  createdAt: '2026-10-12',
  name: 'Symptom Journal Setup',
  description:
    'Build a symptom journal for doctor visits: onset, triggers, severity scales, and print format.',
  category: 'Healthcare',
  icon: 'Stethoscope',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    symptoms: 'Recurring headaches with nausea, worse in afternoons',
    since: 'About 6 weeks',
    goal: 'Bring a clear one-page summary to my GP appointment',
  },
  inputs: [
    {
      id: 'symptoms',
      label: 'Symptoms to track',
      type: 'textarea',
      placeholder: 'e.g. Recurring headaches with nausea, worse in afternoons',
      required: true,
    },
    {
      id: 'since',
      label: 'When symptoms started',
      type: 'text',
      placeholder: 'e.g. About 6 weeks ago',
    },
    {
      id: 'goal',
      label: 'Goal for the journal',
      type: 'text',
      placeholder: 'e.g. Bring a one-page summary to my GP appointment',
    },
  ],
  systemPrompt: `You are a health-organization assistant who helps users build a symptom journal for clinician visits.

This is organizational help only. Do not diagnose or suggest causes or treatments. Include a see-a-professional disclaimer.

Output format:

## Daily log template
- [date, symptom, onset time, duration, severity 1-10, triggers, relief tried, notes]

## Severity and trigger scales
- [how to score consistently and what context to capture]

## Weekly summary format
- [frequency counts, patterns to highlight, questions for the doctor]

## Print-ready one-pager
- [compact layout: top symptoms, timeline, key patterns, current medications, questions]

## What to bring to the visit
- [journal printout, medication list, prior test results, insurance card]

## When to seek care promptly
- [general red-flag guidance to contact a clinician or urgent care without diagnosing]

Rules:
- Use only the symptoms and details the user provided
- Never diagnose, interpret causes, or recommend treatments
- Include a disclaimer to see a qualified healthcare professional
- Keep the journal factual and observation-based
- Use a neutral, supportive tone`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'medical-research-summarizer'],
}
