import {
  MAX_AGENTS_PER_COLLECTION,
  MAX_COLLECTION_NAME_LENGTH,
} from './useCollections'

export const COLLECTION_EXPORT_FORMAT = 'open-agents.collection'
export const COLLECTION_EXPORT_VERSION = 1
// A real export is well under 2 KB, so this only exists to refuse junk early.
export const MAX_COLLECTION_IMPORT_BYTES = 64 * 1024

const AGENT_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g

/**
 * The file contents for one collection. Only the name and agent ids are
 * exported: no storage ids, timestamps or anything else from the profile.
 */
export function serializeCollection(collection) {
  return JSON.stringify(
    {
      format: COLLECTION_EXPORT_FORMAT,
      version: COLLECTION_EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      collection: {
        name: collection.name,
        agentIds: [...collection.agentIds],
      },
    },
    null,
    2
  )
}

export function collectionExportFilename(collection) {
  const slug = collection.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return `collection-${slug || 'export'}.json`
}

const fail = (error) => ({ ok: false, error })

/**
 * Validate the text of an exported collection file without touching storage.
 *
 * Only `collection.name` and `collection.agentIds` are read; every other key
 * in the file is ignored, so nothing unexpected (or credential-shaped) can be
 * carried into the store. Malformed input is rejected as a whole.
 *
 * @param {string} text
 * @param {{ knownAgentIds?: Iterable<string> }} [options] when given, agent
 *   ids missing from the catalogue are dropped and reported in `skippedAgentIds`
 * @returns {{ ok: true, name: string, agentIds: string[], skippedAgentIds: string[] }
 *   | { ok: false, error: string }}
 */
export function parseCollectionImport(text, { knownAgentIds } = {}) {
  if (typeof text !== 'string' || !text.trim()) return fail('The file is empty.')
  if (text.length > MAX_COLLECTION_IMPORT_BYTES) {
    return fail('The file is too large to be a collection export.')
  }

  let data
  try {
    data = JSON.parse(text)
  } catch {
    return fail('The file is not valid JSON.')
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return fail('This is not an Open Agents collection file.')
  }
  if (data.format !== COLLECTION_EXPORT_FORMAT) {
    return fail('This is not an Open Agents collection file.')
  }
  if (data.version !== COLLECTION_EXPORT_VERSION) {
    return fail(`Unsupported collection file version: ${String(data.version).slice(0, 20)}.`)
  }

  const source = data.collection
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return fail('The file has no collection data.')
  }

  if (typeof source.name !== 'string') return fail('The collection needs a name.')
  const name = source.name.replace(CONTROL_CHARS, '').trim()
  if (!name) return fail('The collection needs a name.')
  if (name.length > MAX_COLLECTION_NAME_LENGTH) {
    return fail(`The collection name is longer than ${MAX_COLLECTION_NAME_LENGTH} characters.`)
  }

  if (!Array.isArray(source.agentIds)) return fail('The collection has no agent list.')
  if (source.agentIds.length > MAX_AGENTS_PER_COLLECTION) {
    return fail(`A collection can hold at most ${MAX_AGENTS_PER_COLLECTION} agents.`)
  }
  if (!source.agentIds.every((id) => typeof id === 'string' && AGENT_ID_PATTERN.test(id))) {
    return fail('The agent list contains an invalid agent id.')
  }

  const unique = [...new Set(source.agentIds)]
  if (!knownAgentIds) return { ok: true, name, agentIds: unique, skippedAgentIds: [] }

  const known = new Set(knownAgentIds)
  return {
    ok: true,
    name,
    agentIds: unique.filter((id) => known.has(id)),
    skippedAgentIds: unique.filter((id) => !known.has(id)),
  }
}
