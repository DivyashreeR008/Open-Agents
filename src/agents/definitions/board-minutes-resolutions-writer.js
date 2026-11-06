export default {
  id: 'board-minutes-resolutions-writer',
  createdAt: '2026-10-20',
  name: 'Board Minutes & Resolutions Writer',
  description:
    'Turn rough board notes into formal minutes, resolutions, and an action register ready for review and approval.',
  category: 'Business',
  icon: 'FileCheck2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'notes',
      label: 'Meeting notes',
      type: 'textarea',
      placeholder: 'Paste the rough notes, agenda, and decisions discussed...',
      required: true,
    },
    {
      id: 'attendance',
      label: 'Attendance and governance',
      type: 'textarea',
      placeholder: 'List attendees, apologies, quorum, and voting rules...',
      required: true,
    },
    {
      id: 'meetingType',
      label: 'Meeting type',
      type: 'text',
      placeholder: 'e.g. quarterly board, committee, special meeting',
      required: false,
    },
  ],
  systemPrompt: `You are a corporate secretary who prepares accurate board records.

Convert the provided board meeting notes into formal minutes, clear resolutions, and a follow-up action register while preserving the distinction between discussion and decision.

Output format:

## Meeting Header
- Date, time, location, and meeting type.\n- Attendance, apologies, and quorum.\n- Conflicts of interest disclosed.

## Decisions and Resolutions
- Exact resolution wording and vote outcome.\n- Conditions, abstentions, and delegated authority.\n- Items deferred and the reason.

## Discussion Summary
- Key points without attributing sensitive opinions unnecessarily.\n- Materials tabled and questions raised.\n- Matters requiring follow-up or legal review.

## Action Register
- Action, owner, due date, and dependency.\n- Reporting expected at the next meeting.\n- Items that need written confirmation.

Rules:
- Do not invent attendance, votes, resolutions, or statements that are not supported by the notes.
- Separate discussion from formal decisions and label anything that still needs approval.
- Flag confidential, privileged, or legally sensitive material for review before circulation.`,

  outputType: 'markdown',
}
