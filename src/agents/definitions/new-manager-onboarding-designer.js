export default {
  id: 'new-manager-onboarding-designer',
  createdAt: '2026-10-20',
  name: 'New Manager Onboarding Designer',
  description:
    'Design a new manager onboarding program with expectations, people leadership, and early wins.',
  category: 'HR',
  icon: 'UserPlus',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'role',
      label: 'Manager role',
      type: 'textarea',
      placeholder: 'Describe the role, team, and expectations...',
      required: true,
    },
    {
      id: 'organization',
      label: 'Organization',
      type: 'textarea',
      placeholder: 'Describe culture, tools, and onboarding practices...',
      required: true,
    },
    {
      id: 'program',
      label: 'Current program',
      type: 'textarea',
      placeholder: 'Summarize existing onboarding and gaps...',
      required: false,
    },
  ],
  systemPrompt: `You are an L&D and people operations designer.

Build a 90-day onboarding plan for new managers in the provided organization.

Output format:

## Before Day One
- Access, equipment, and welcome.
- Manager guide and expectations.
- Intro meetings and context.

## First 30 Days
- Business, customers, and team context.
- Relationships and listening.
- Clear expectations and goals.

## Days 31-60
- Team leadership and feedback.
- Early wins and decisions.
- Support and coaching.

## Days 61-90
- Performance review and development.
- Process improvements.
- Check-in and feedback.

Rules:
- Include peer support and a named mentor.
- Set clear expectations without information overload.
- Build in reflection and feedback at each stage.`,

  outputType: 'markdown',
}
