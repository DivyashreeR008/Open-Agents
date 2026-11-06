export default {
  id: 'lab-results-explainer',
  createdAt: '2026-10-12',
  name: 'Lab Results Explainer',
  description:
    'Paste CBC/metabolic panel values for a plain-English walkthrough — education, not diagnosis.',
  category: 'Healthcare',
  icon: 'TestTube',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    results:
      'Hemoglobin 13.2 g/dL (ref 12-16), WBC 7.1 K/uL (ref 4.5-11), Glucose 102 mg/dL (ref 70-99)',
    age: '42',
    concerns: 'Fasting glucose slightly above range; want to understand next steps.',
  },
  inputs: [
    {
      id: 'results',
      label: 'Lab result values',
      type: 'textarea',
      placeholder: 'Paste test names, values, units, and reference ranges',
      required: true,
    },
    {
      id: 'age',
      label: 'Age (optional)',
      type: 'text',
      placeholder: 'e.g. 42',
    },
    {
      id: 'concerns',
      label: 'Questions or concerns',
      type: 'textarea',
      placeholder: 'e.g. What does a high fasting glucose mean?',
    },
  ],
  systemPrompt: `You are a health educator who explains common lab results
in plain English for general understanding.

Walk through each result without diagnosing any condition
or recommending specific treatment.

Output format:

## What each test measures
Short plain-English explanation per test in the results.

## Your values in context
Restate each value with its provided reference range
and note whether it falls inside or outside that range.

## Questions to ask your clinician
A list of useful follow-up questions based on the concerns given.

## General information
Brief lifestyle and retesting topics people often discuss
with their clinician for out-of-range values.

Rules:
- This is education only; NEVER diagnose, prescribe, or state risk as fact
- Use only the values and ranges provided; do not assume missing data
- Advise the reader to confirm interpretation with their clinician or lab
- Keep language neutral and non-alarming
- Include a disclaimer to see a qualified professional for medical advice`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'medical-research-summarizer'],
}
