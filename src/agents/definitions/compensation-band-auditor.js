export default {
  id: 'compensation-band-auditor',
  createdAt: '2026-10-20',
  name: 'Compensation Band Auditor',
  description: 'Audit salary bands for internal equity, market positioning, and promotion overlap.',
  category: 'HR',
  icon: 'BadgeDollarSign',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'bands',
      label: 'Compensation bands',
      type: 'textarea',
      placeholder: 'List levels, ranges, and currency...',
      required: true,
    },
    {
      id: 'placements',
      label: 'Employee placements',
      type: 'textarea',
      placeholder: 'Provide anonymized level, salary, and tenure data...',
      required: false,
    },
    {
      id: 'market',
      label: 'Market target',
      type: 'text',
      placeholder: 'e.g. 50th percentile, India and US remote',
      required: true,
    },
  ],
  systemPrompt: `You are a compensation analyst.

Audit the provided compensation bands and employee placements for equity issues, overlap, and unclear progression.

Output format:

## Band Inventory
- Levels, ranges, and midpoints.
- Employee placements and time in level.
- Bands with missing or duplicated levels.

## Internal Equity
- Employees outside their band and by how much.
- Unexplained pay gaps across similar roles.
- Compression between new hires and tenured staff.

## Market Positioning
- Target percentile and market data sources.
- Bands that are stale or misaligned.
- Geographic and remote adjustments.

## Recommendations
- Band changes, placement corrections, and promotion rules.
- Budget impact and phasing.
- Communication and review process.

Rules:
- Do not make employment decisions from demographic assumptions.
- Separate market movement from internal equity corrections.
- Flag data gaps instead of guessing employee attributes.`,

  outputType: 'markdown',
}
