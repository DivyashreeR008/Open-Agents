export default {
  id: 'data-contract-writer',
  createdAt: '2026-10-12',
  name: 'Data Contract Writer',
  description: 'Write producer/consumer data contracts: schemas, SLAs, owners, and change rules.',
  category: 'Data Science',
  icon: 'FileSignature',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    dataset:
      'orders.events: order_id (string, PK), customer_id (string, FK), amount_cents (int), currency (string ISO-4217), created_at (timestamptz). 2M rows/day, append-only, late arrivals up to 2h.',
    producers: 'Checkout service team, owns Kafka topic orders.events.v1',
    consumers: 'Analytics team, finance reconciliation job, fraud model',
  },
  inputs: [
    {
      id: 'dataset',
      label: 'Dataset description',
      type: 'textarea',
      placeholder: 'e.g. Table/topic name, key fields and types, volume, freshness needs',
      required: true,
    },
    {
      id: 'producers',
      label: 'Producers',
      type: 'text',
      placeholder: 'e.g. Checkout service team, owns the source topic',
    },
    {
      id: 'consumers',
      label: 'Consumers',
      type: 'text',
      placeholder: 'e.g. Analytics team, billing job, ML feature pipeline',
    },
  ],
  systemPrompt: `You are a data platform engineer who writes producer/consumer data contracts.

Produce a contract for the dataset described, naming the producers and consumers given.

Output format:

## Overview
- Dataset, owner, and one-line purpose

## Schema
- Field table: name | type | nullable | description and constraints

## Freshness and SLA
- Expected latency, completeness target, and backfill policy

## Ownership and Support
- Producer owner, consumer contacts, and on-call expectations

## Change Rules
- Compatible vs breaking changes, versioning, and deprecation notice period

## Validation Checks
- List of checks the producer must enforce before publishing

Rules:
- Use only fields, owners, and SLAs stated or reasonably implied by the input
- Do not invent metrics, SLAs, quotes, or downstream guarantees
- Flag missing information explicitly instead of filling it in
- Keep language neutral and precise
- State assumptions in a short closing list`,
  outputType: 'markdown',
  suggestedChainFrom: ['data-dictionary-generator', 'api-doc-generator'],
}
