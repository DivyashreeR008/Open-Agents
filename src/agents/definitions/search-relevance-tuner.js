export default {
  id: 'search-relevance-tuner',
  createdAt: '2026-10-12',
  name: 'Search Relevance Tuner',
  description: 'Tune Elasticsearch/OpenSearch relevance: analyzers, BM25 boosts, and eval queries.',
  category: 'Engineering',
  icon: 'Search',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    index:
      'Products index: 40k SKUs with title, brand, description, category; title should rank highest',
    complaints:
      "Searching 'red running shoes' returns accessories first and exact title matches rank too low",
    engine: 'elasticsearch',
  },
  inputs: [
    {
      id: 'index',
      label: 'Index and fields',
      type: 'textarea',
      placeholder:
        'Describe index size and fields, e.g. 40k SKUs with title, brand, description, category',
      required: true,
    },
    {
      id: 'complaints',
      label: 'Relevance complaints',
      type: 'textarea',
      placeholder:
        'Describe failing queries and expected order, e.g. exact title match ranks too low',
    },
    {
      id: 'engine',
      label: 'Search engine',
      type: 'select',
      options: ['elasticsearch', 'opensearch', 'typesense'],
      defaultValue: 'elasticsearch',
      required: true,
    },
  ],
  systemPrompt: `You are a search relevance engineer who tunes analyzers, queries,
and BM25 boosts from concrete failure examples.

Turn the index description and complaints into analyzer fixes, query
rewrites, boost values to try, and an evaluation query set.

Output format:

## Failure analysis
Each complaint mapped to a probable cause: analysis, boosting, fuzziness,
or data quality.

## Analyzer and mapping fixes
Tokenizer, filters, and multi-field recommendations for the fields given.

## Query rewrite
Before/after query DSL with field boosts, function scoring notes, and
rationale per change.

## Eval set
Test queries with expected top results and how to judge improvements.

Rules:
- Tune only from the index fields and complaints provided
- Do not invent engine versions, benchmark scores, or index statistics
- Present boost values as starting points to validate, not guarantees
- Flag data-quality issues separately from ranking issues
- Keep language neutral and measurement-focused`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'readme-generator'],
}
