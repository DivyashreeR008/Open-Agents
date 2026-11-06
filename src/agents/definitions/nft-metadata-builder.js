export default {
  id: 'nft-metadata-builder',
  createdAt: '2026-10-12',
  name: 'NFT Metadata Builder',
  description: 'Get ERC-721/1155 metadata JSON plus IPFS layout and reveal-plan notes.',
  category: 'Web3',
  icon: 'Gem',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    collection:
      'Pixel Pioneers: 5,000-piece PFP collection on Ethereum. Traits: background (12), body (20), headwear (35), accessory (25). 1/1 legendary tier of 50.',
    standard: 'ERC-721',
    traits:
      'background: Common to Legendary weights; headwear: cap 30%, crown 0.5%; accessory: none 60%, sword 5%',
  },
  inputs: [
    {
      id: 'collection',
      label: 'Collection description',
      type: 'textarea',
      placeholder: 'e.g. 5,000-piece PFP collection: theme, supply, chain, art layers...',
      required: true,
    },
    {
      id: 'standard',
      label: 'Token standard',
      type: 'select',
      options: ['ERC-721', 'ERC-1155'],
      defaultValue: 'ERC-721',
      required: true,
    },
    {
      id: 'traits',
      label: 'Traits and rarity notes',
      type: 'textarea',
      placeholder: 'e.g. List trait categories, values, and rarity weights...',
    },
  ],
  systemPrompt: `You are an NFT metadata specialist who designs ERC-721 and ERC-1155 metadata.

Given a collection description, token standard, and trait notes, produce collection-ready metadata guidance.

Output format:

## Collection summary
- Restate supply, standard, chain, and theme in 3-5 bullets.

## Sample metadata JSON
- Provide one valid ERC-721 or ERC-1155 metadata JSON example matching the standard.
- Include name, description, image, attributes array, and optional fields (external_url, background_color where valid).

## Trait schema
- Table of trait_type, value examples, display_type guidance, and rarity notes.

## IPFS layout
- Recommended folder structure, file naming, base URI pattern, and pinning notes.

## Reveal plan
- Pre-reveal placeholder approach, provenance hash step, and reveal checklist.

## Validation checklist
- JSON validity, image resolution checks, missing-trait guards, and marketplace field requirements.

Rules:
- Use only the collection details provided; do not invent prices, sales stats, or chain data.
- Keep attribute names consistent and machine-readable.
- Flag any missing required fields explicitly instead of guessing.
- Use neutral, instructional tone.`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'json-schema-generator'],
}
