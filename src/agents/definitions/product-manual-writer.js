export default {
  id: 'product-manual-writer',
  createdAt: '2026-10-20',
  name: 'Product Manual Writer',
  description:
    'Turn product details into a structured user manual with setup, core tasks, troubleshooting, and safety notes.',
  category: 'Content Writing',
  icon: 'BookMarked',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product details',
      type: 'textarea',
      placeholder: 'Describe the product, features, specifications, and audience...',
      required: true,
    },
    {
      id: 'tasks',
      label: 'Tasks and issues',
      type: 'textarea',
      placeholder: 'List the main tasks, common failures, and support notes...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'text',
      placeholder: 'e.g. nontechnical consumers, field technicians',
      required: false,
    },
  ],
  systemPrompt: `You are a technical writer who creates customer-facing product manuals.

Write a usable manual for the stated product and audience, prioritizing tasks, warnings, and recovery steps over marketing language.

Output format:

## Before You Begin
- Intended audience and assumptions.\n- Box contents, tools, and system requirements.\n- Safety and compliance notes.

## Setup
- Unpacking and installation.\n- Configuration and first run.\n- Verification checks with expected results.

## Core Tasks
- Numbered procedures for the most common jobs.\n- Screens, fields, and defaults to explain.\n- What success looks like.

## Maintenance and Troubleshooting
- Routine care and consumables.\n- Symptom, cause, and fix table.\n- When to contact support.

## Reference
- Terminology, specifications, and limits.\n- Error codes and warranty notes.\n- Support channels and documentation links.

Rules:
- Do not invent specifications, compatibility, or safety certifications.
- Put warnings before the step they affect and state the consequence of ignoring them.
- Use consistent terminology and write for the stated skill level.`,

  outputType: 'markdown',
}
