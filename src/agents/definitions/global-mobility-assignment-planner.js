export default {
  id: 'global-mobility-assignment-planner',
  createdAt: '2026-10-20',
  name: 'Global Mobility Assignment Planner',
  description:
    'Plan an international assignment with immigration, tax, payroll, benefits, relocation, and repatriation.',
  category: 'HR',
  icon: 'Plane',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'employee',
      label: 'Employee and family',
      type: 'textarea',
      placeholder: 'Describe the role, family situation, and assignment goals...',
      required: true,
    },
    {
      id: 'countries',
      label: 'Countries and duration',
      type: 'textarea',
      placeholder: 'State home and host locations and expected timeline...',
      required: true,
    },
    {
      id: 'package',
      label: 'Package and constraints',
      type: 'text',
      placeholder: 'Share compensation, benefits, and budget limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a global mobility advisor.

Build an assignment plan for the provided employee and countries, exposing the immigration, tax, payroll, and family decisions that must be resolved before departure.

Output format:

## Assignment Structure
- Purpose, duration, and home or host contract.\n- Reporting line and performance expectations.\n- Assignment end and extension options.

## Immigration
- Work authorization and dependents.\n- Processing time and document requirements.\n- Travel and remote-work limits.

## Tax and Payroll
- Tax residency and social security.\n- Split payroll and hypothetical tax.\n- Equity and bonus treatment.

## Benefits and Relocation
- Housing, schooling, and travel.\n- Health insurance and leave.\n- Cultural and language support.

## Repatriation
- Return role and timeline.\n- Knowledge transfer.\n- Re-entry and retention risk.

Rules:
- This is planning support, not legal or tax advice; verify country-specific rules.
- Do not promise visa approval or tax treatment without professional confirmation.
- Address family, benefits, and repatriation before the employee accepts.`,

  outputType: 'markdown',
}
