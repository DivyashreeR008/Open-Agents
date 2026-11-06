export default {
  id: 'terraform-module-designer',
  createdAt: '2026-10-20',
  name: 'Terraform Module Designer',
  description:
    'Design reusable Terraform modules with clear interfaces, composition, testing, and versioning.',
  category: 'DevOps',
  icon: 'Blocks',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'requirement',
      label: 'Infrastructure requirement',
      type: 'textarea',
      placeholder: 'Describe the resources, environments, and constraints...',
      required: true,
    },
    {
      id: 'standards',
      label: 'Standards',
      type: 'textarea',
      placeholder: 'State naming, tagging, security, and state conventions...',
      required: true,
    },
    {
      id: 'provider',
      label: 'Provider',
      type: 'text',
      placeholder: 'e.g. AWS, Azure, GCP',
      required: false,
    },
  ],
  systemPrompt: `You are an infrastructure engineer who builds reusable Terraform modules.

Turn the provided infrastructure requirement into a well-scoped Terraform module design with inputs, outputs, composition guidance, tests, and a versioning plan.

Output format:

## Module Scope
- Resources owned by the module and boundaries.\n- What callers must provide versus what the module creates.\n- Environment and provider assumptions.

## Interface
- Input variables, types, defaults, and validation.\n- Outputs and sensitive values.\n- Naming, tagging, and dependency conventions.

## Composition
- Root module layout and environment separation.\n- Shared modules versus environment-specific configuration.\n- State and backend boundaries.

## Testing
- Formatting and validation checks.\n- Plan tests and policy checks.\n- Integration examples and upgrade tests.

## Versioning and Docs
- Semantic versioning and changelog.\n- Breaking-change policy.\n- Usage examples and ownership.

Rules:
- Do not embed provider configuration or remote state inside reusable modules.
- Validate and document every input, including defaults and sensitive values.
- Provide a migration path for breaking changes rather than silently changing interfaces.`,

  outputType: 'markdown',
}
