import { useMemo, useState } from 'react'
import CollectionModal from '../CollectionModal'
import {
  MAX_COLLECTION_IMPORT_BYTES,
  parseCollectionImport,
} from '../../lib/collectionTransfer'

export default function ImportCollectionModal({ agents, onImport, onClose }) {
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')

  const agentById = useMemo(() => new Map(agents.map((agent) => [agent.id, agent])), [agents])

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    setPreview(null)
    setError('')
    if (!file) return

    if (file.size > MAX_COLLECTION_IMPORT_BYTES) {
      setError('The file is too large to be a collection export.')
      return
    }
    if (agents.length === 0) {
      setError('Agents are still loading. Try again in a moment.')
      return
    }

    let text
    try {
      text = await file.text()
    } catch {
      setError('Could not read that file.')
      return
    }

    const result = parseCollectionImport(text, { knownAgentIds: agentById.keys() })
    if (!result.ok) {
      setError(result.error)
      return
    }
    setPreview(result)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!preview) {
      setError('Choose a collection file first.')
      return
    }
    const result = onImport(preview)
    if (!result.ok) setError(result.error)
  }

  return (
    <CollectionModal
      title="Import Collection"
      description="Choose a collection file exported from Open Agents."
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Import"
    >
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary">
          Collection file
          <input
            type="file"
            accept="application/json,.json"
            onChange={handleFile}
            className="mt-2 block w-full text-sm text-gray-700 dark:text-text-secondary"
          />
        </label>

        {preview && (
          <div className="border border-gray-200 p-3 text-sm dark:border-border" aria-live="polite">
            <p className="font-semibold text-gray-900 dark:text-text-primary">{preview.name}</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-text-secondary">
              {preview.agentIds.length} agent{preview.agentIds.length === 1 ? '' : 's'} will be added
            </p>
            {preview.agentIds.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-xs text-gray-700 dark:text-text-secondary">
                {preview.agentIds.map((id) => (
                  <li key={id}>{agentById.get(id)?.name ?? id}</li>
                ))}
              </ul>
            )}
            {preview.skippedAgentIds.length > 0 && (
              <p className="mt-2 text-xs text-gray-500 dark:text-text-secondary">
                {preview.skippedAgentIds.length} agent
                {preview.skippedAgentIds.length === 1 ? ' is' : 's are'} not in this catalogue and
                will be skipped.
              </p>
            )}
          </div>
        )}
      </div>
    </CollectionModal>
  )
}
