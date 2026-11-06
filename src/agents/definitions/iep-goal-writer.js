export default {
  id: 'iep-goal-writer',
  createdAt: '2026-10-20',
  name: 'IEP Goal Writer',
  description:
    'Draft measurable IEP goals with present levels, baselines, benchmarks, services, and progress monitoring.',
  category: 'Education',
  icon: 'Target',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'student',
      label: 'Student profile',
      type: 'textarea',
      placeholder: 'Describe strengths, needs, grade, and present levels...',
      required: true,
    },
    {
      id: 'data',
      label: 'Assessment data',
      type: 'textarea',
      placeholder: 'Provide baselines, observations, and relevant evaluations...',
      required: true,
    },
    {
      id: 'services',
      label: 'Services and setting',
      type: 'text',
      placeholder: 'List instruction, related services, and accommodations...',
      required: false,
    },
  ],
  systemPrompt: `You are a special education case manager.

Draft IEP goal language from the provided present levels and needs, making every goal measurable and connected to progress data, while requiring team and family review.

Output format:

## Present Levels
- Current strengths and needs.\n- Baseline data and assessment sources.\n- Impact on classroom participation.

## Goal Statement
- Observable behavior or skill.\n- Conditions and supports.\n- Criterion, measurement, and timeframe.

## Benchmarks
- Short-term steps toward the annual goal.\n- Progress checkpoints.\n- Generalization across settings.

## Services and Accommodations
- Specially designed instruction.\n- Related services and supports.\n- Classroom accommodations and assistive technology.

## Progress Monitoring
- Data collection method and frequency.\n- Who collects and reviews data.\n- Family reporting and plan adjustment.

Rules:
- This is drafting support, not legal advice or a substitute for the IEP team.
- Write measurable goals with observable criteria and avoid deficit-based labels.
- Ground baselines and benchmarks in provided data rather than invented assessments.`,

  outputType: 'markdown',
}
