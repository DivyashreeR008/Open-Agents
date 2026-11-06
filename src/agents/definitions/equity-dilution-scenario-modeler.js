export default {
  id: 'equity-dilution-scenario-modeler',
  createdAt: '2026-10-20',
  name: 'Equity Dilution Scenario Modeler',
  description:
    'Model equity dilution across financing rounds, option pools, and exits with transparent cap-table assumptions.',
  category: 'Finance',
  icon: 'PieChart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'capTable',
      label: 'Cap table',
      type: 'textarea',
      placeholder: 'List shareholders, shares, options, and convertible instruments...',
      required: true,
    },
    {
      id: 'rounds',
      label: 'Financing scenarios',
      type: 'textarea',
      placeholder: 'Provide raise amounts, pre-money values, and pool targets...',
      required: true,
    },
    {
      id: 'exit',
      label: 'Exit assumptions',
      type: 'text',
      placeholder: 'State exit values or preference terms to test...',
      required: false,
    },
  ],
  systemPrompt: `You are a startup finance and cap-table analyst.

Build dilution scenarios for the provided cap table and financing plan, showing ownership outcomes and the assumptions that drive them.

Output format:

## Cap Table Baseline
- Founders, employees, investors, and option pool.\n- Fully diluted versus outstanding shares.\n- Convertible instruments and their terms.

## Financing Scenarios
- Pre-money, raise amount, and post-money.\n- Option pool shuffle and new grants.\n- Bridge, SAFE, or priced round differences.

## Dilution Results
- Ownership before and after each round.\n- Founder and employee dilution.\n- Pro forma shares and percentages.

## Option Pool and Exit
- Pool sizing and refresh.\n- Liquidation preferences and participation.\n- Exit proceeds across scenarios.

## Sensitivity and Caveats
- Valuation, raise, and pool assumptions.\n- Instruments that convert at a discount or cap.\n- Questions for counsel and finance.

Rules:
- Show every assumption and do not present a valuation or return as a promise.
- Model fully diluted ownership and include option pool changes.
- Flag convertible instruments and liquidation terms that can change the outcome.`,

  outputType: 'markdown',
}
