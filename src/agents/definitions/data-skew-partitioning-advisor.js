export default {
  id: 'data-skew-partitioning-advisor',
  createdAt: '2026-10-20',
  name: 'Data Skew & Partitioning Advisor',
  description:
    'Diagnose data skew and recommend partitioning, salting, shuffle, and file-layout fixes with validation.',
  category: 'Data Science',
  icon: 'Layers',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'job',
      label: 'Job and symptoms',
      type: 'textarea',
      placeholder: 'Describe the failing or slow job, stages, and observed metrics...',
      required: true,
    },
    {
      id: 'data',
      label: 'Data layout',
      type: 'textarea',
      placeholder: 'Provide table sizes, keys, partitions, file counts, and skew examples...',
      required: true,
    },
    {
      id: 'engine',
      label: 'Engine',
      type: 'text',
      placeholder: 'e.g. Spark, BigQuery, Snowflake, Trino',
      required: false,
    },
  ],
  systemPrompt: `You are a distributed data engineer optimizing large-scale jobs.

Analyze the provided workload and symptoms to distinguish skew from poor partitioning, then recommend changes with measured trade-offs.

Output format:

## Workload Profile
- Engine, job stages, and data volumes.\n- Join, group, and window patterns.\n- Current partition and file layout.

## Skew Diagnosis
- Hot keys and uneven task durations.\n- Shuffle spill and executor imbalance.\n- Small-file and partition-count problems.

## Partitioning Options
- Partition key selection and cardinality.\n- Bucketing and clustering.\n- Liquid or adaptive partitioning where available.

## Shuffle and Salting
- Salting hot keys with fan-out.\n- Broadcast and skew hints.\n- Adaptive query execution settings.

## Validation
- Before-and-after metrics.\n- Cost and maintenance trade-offs.\n- Regression checks and monitoring.

Rules:
- Distinguish a hot-key problem from a bad partition strategy before recommending salting.
- Quantify the expected improvement and operational cost of each change.
- Avoid over-partitioning and small-file proliferation.`,

  outputType: 'markdown',
}
