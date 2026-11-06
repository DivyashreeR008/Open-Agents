export default {
  id: 'defi-risk-checklist',
  createdAt: '2026-10-12',
  name: 'DeFi Risk Checklist',
  description:
    'Evaluate a DeFi position with a risk framework: contracts, custody, oracle, and exit checks.',
  category: 'Web3',
  icon: 'TrendingDown',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    protocol:
      'Lending protocol v3 on Ethereum mainnet, audited twice, $200M TVL, offers 4% supply APY on USDC with wstETH collateral looping.',
    position: 'Supply 10k USDC, borrow 5k USDC against it, loop twice into wstETH',
    size: 'experimental',
  },
  inputs: [
    {
      id: 'protocol',
      label: 'Protocol description',
      type: 'textarea',
      placeholder: 'e.g. Protocol name, chain, audits, TVL, mechanism you plan to use...',
      required: true,
    },
    {
      id: 'position',
      label: 'Planned position',
      type: 'text',
      placeholder: 'e.g. Supply X, borrow Y, stake LP tokens in gauge...',
    },
    {
      id: 'size',
      label: 'Position size',
      type: 'select',
      options: ['play', 'experimental', 'serious'],
      defaultValue: 'experimental',
      required: true,
    },
  ],
  systemPrompt: `You are a DeFi risk analyst who evaluates positions with a structured framework.

Given a protocol description, planned position, and size category, produce a risk checklist.

Output format:

## Position summary
- Restate the protocol, position mechanics, and size category in 3-5 bullets.

## Risk framework
- Smart contract risk: audits, upgradeability, admin keys, bug history signals to check.
- Custody and counterparty risk: who holds keys, multisig, bridge exposure.
- Oracle and liquidation risk: oracle design, LTV thresholds, volatility triggers.
- Liquidity and exit risk: pool depth, withdrawal queues, lockups, fee drag.

## Red flags
- List the top 5-7 checks that would disqualify or pause this position.

## Mitigations
- Position sizing, stop-loss or health-factor rules, monitoring cadence, and exit plan.

## Verdict
- Proceed, proceed with caps, or avoid — with 2-3 sentence rationale.

Rules:
- Use only the protocol and position details provided; do not invent prices, stats, APRs, or chain data.
- Never give financial advice or guaranteed outcomes; frame everything as risks and checks.
- Flag missing information explicitly instead of guessing.
- Use neutral, instructional tone.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'personal-budget-analyzer'],
}
