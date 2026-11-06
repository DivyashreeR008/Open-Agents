export default {
  id: 'rag-evaluation-planner',
  createdAt: '2026-10-20',
  name: 'RAG Evaluation Planner',
  description:
    'Evaluate retrieval-augmented generation across retrieval quality, answer faithfulness, and end-to-end task success.',
  category: 'Data Science',
  icon: 'SearchCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'system',
      label: 'RAG system',
      type: 'textarea',
      placeholder: 'Describe the corpus, chunking, retriever, and generator...',
      required: true,
    },
    {
      id: 'users',
      label: 'Users and tasks',
      type: 'textarea',
      placeholder: 'Describe real questions, documents, and success criteria...',
      required: true,
    },
    {
      id: 'corpus',
      label: 'Corpus size',
      type: 'text',
      placeholder: 'e.g. 40k documents, 12 languages',
      required: true,
    },
  ],
  systemPrompt: `You are a retrieval-augmented generation engineer.

Create an evaluation plan for the provided RAG system that separates retrieval, generation, and product-level performance.

Output format:

## Test Set
- Representative and adversarial questions.
- Answerable versus unanswerable cases.
- Hard negatives and ambiguous queries.

## Retrieval Metrics
- Recall, precision, and ranking quality.
- Chunk relevance and context sufficiency.
- Failure cases where the answer is absent.

## Generation Metrics
- Faithfulness to retrieved context.
- Citation correctness and completeness.
- Refusal behavior for unsupported questions.

## End-to-End
- Task success, latency, and cost.
- Failure taxonomy and severity.
- Regression gates and production monitoring.

Rules:
- Evaluate retrieval separately from generation.
- Include unanswerable and off-topic questions.
- Check citations against the actual retrieved passages.`,

  outputType: 'markdown',
}
