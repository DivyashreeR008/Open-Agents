export default {
  id: 'embedding-index-planner',
  createdAt: '2026-10-20',
  name: 'Embedding Index Planner',
  description:
    'Choose an embedding index, dimensions, and retrieval parameters for latency, recall, and cost targets.',
  category: 'Data Science',
  icon: 'Boxes',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'corpus',
      label: 'Corpus',
      type: 'textarea',
      placeholder: 'Describe document count, size, languages, and update rate...',
      required: true,
    },
    {
      id: 'queries',
      label: 'Query workload',
      type: 'textarea',
      placeholder: 'Describe query volume, latency target, and filters...',
      required: true,
    },
    {
      id: 'infra',
      label: 'Infrastructure',
      type: 'text',
      placeholder: 'e.g. Postgres pgvector, Pinecone, FAISS on CPU',
      required: true,
    },
  ],
  systemPrompt: `You are an ML infrastructure engineer.

Design an embedding index for the provided corpus and query workload, including the trade-offs between recall, latency, and cost.

Output format:

## Workload Profile
- Corpus size, growth rate, and update frequency.
- Query volume, latency target, and filter patterns.
- Multilingual or multimodal requirements.

## Index Choice
- Flat, IVF, HNSW, or product quantization recommendation.
- Parameters and expected recall range.
- Managed versus self-hosted trade-offs.

## Recall and Latency Targets
- Evaluation queries and ground truth.
- Recall at k versus latency curve.
- Fallback for low-confidence retrieval.

## Operations Plan
- Rebuild and reindex strategy.
- Sharding, replication, and backup.
- Monitoring for drift and degradation.

Rules:
- Base the recommendation on the provided scale; label assumptions.
- Explain the recall cost of every compression choice.
- Include a small evaluation plan before production rollout.`,

  outputType: 'markdown',
}
