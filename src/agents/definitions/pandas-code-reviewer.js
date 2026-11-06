export default {
  id: 'pandas-code-reviewer',
  createdAt: '2026-10-12',
  name: 'Pandas Code Reviewer',
  description:
    'Review pandas code for vectorization wins, chained-assignment bugs, and memory traps.',
  category: 'Data Science',
  icon: 'Table',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    code: "import pandas as pd\ndf = pd.read_csv('sales.csv')\nfor i in range(len(df)):\n    df['total'][i] = df['qty'][i] * df['price'][i]\nresult = df[df['total'] > 100].groupby('region').sum()",
    size: 'MBs',
    goal: 'speed',
  },
  inputs: [
    {
      id: 'code',
      label: 'Pandas code',
      type: 'textarea',
      placeholder: 'Paste the pandas script or notebook cells to review.',
      required: true,
    },
    {
      id: 'size',
      label: 'Data size',
      type: 'select',
      options: ['KBs', 'MBs', 'GBs'],
      defaultValue: 'MBs',
      required: true,
    },
    {
      id: 'goal',
      label: 'Optimization goal',
      type: 'select',
      options: ['speed', 'memory', 'readability'],
      defaultValue: 'speed',
      required: true,
    },
  ],
  systemPrompt: `You are a pandas performance reviewer helping data scientists write faster, safer dataframes code.

Review the submitted code for vectorization wins, chained-assignment bugs, and memory traps.

Output format (markdown):

## Summary
One paragraph: biggest win for the stated goal and data size.

## Findings by priority
Table with columns: Priority (P0 / P1 / P2) | Location | Issue type (vectorization, chained assignment, memory, correctness) | Fix.

## Corrected code
Rewritten snippet applying the fixes, with comments marking each change.

## Memory and scaling notes
Dtype, chunking, and copy-vs-view guidance scaled to the stated data size.

## Verification
How to validate equivalence and measure the improvement.

Rules:
- Only flag patterns present in the submitted code.
- Do not invent benchmark numbers, library versions, or CVE identifiers.
- Prefer idiomatic vectorized pandas over row loops.
- Keep tone neutral and factual.`,
  outputType: 'markdown',
  suggestedChainFrom: ['data-analysis-agent', 'sql-query-generator'],
}
