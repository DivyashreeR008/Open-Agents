import { useMemo, useRef, useState } from 'react'
import { FolderPlus, Plus, X } from 'lucide-react'
import { DEFAULT_COLLECTION_ID, MAX_COLLECTIONS, useCollections } from '../lib/useCollections'
import { useDialogFocus } from '../hooks/useDialogFocus'

export default function CollectionPicker({ agentId, onClose }) {
  const {
    collections,
    createCollection,
    addAgentToCollection,
    removeAgentFromCollection,
    moveAgentToCollection,
    getAgentCollectionId,
    isAgentInCollection,
  } = useCollections()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const panelRef = useRef(null)
  useDialogFocus(panelRef, { onClose })

  const visibleCollections = useMemo(
    () => collections.filter((collection) => collection.id !== DEFAULT_COLLECTION_ID),
    [collections]
  )

  const handleCreate = () => {
    const result = createCollection(name)
    if (!result.ok) return setMessage(result.error)
    setName('')
    const addResult = addAgentToCollection(result.collection.id, agentId)
    setMessage(addResult.ok ? `Added to ${result.collection.name}.` : addResult.error)
  }

  const currentCollectionId = getAgentCollectionId(agentId)
  const currentCollection = visibleCollections.find(
    (collection) => collection.id === currentCollectionId
  )

  const handleMove = (collection) => {
    const result = moveAgentToCollection(agentId, collection.id)
    const source = currentCollection ? ` from ${currentCollection.name}` : ''
    setMessage(result.ok ? `Moved to ${collection.name}${source}.` : result.error)
  }

  const handleRemove = (collection) => {
    const result = removeAgentFromCollection(collection.id, agentId)
    setMessage(result.ok ? `Removed from ${collection.name}.` : result.error)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 pt-8 bg-black/50 backdrop-blur-sm">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Add to collection"
        className="flex max-h-[80vh] w-full max-w-md flex-col border border-gray-200 bg-white shadow-pop dark:border-border dark:bg-surface-card"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 dark:border-border">
          <div className="flex items-start gap-3">
            <div className=" bg-zinc-500/10 p-2 text-zinc-600 dark:text-zinc-300">
              <FolderPlus size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-text-primary">
                Add to Collection
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-text-secondary">
                Choose a collection or create a new one.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className=" p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-text-primary"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-5">
          <div className="min-h-0 flex-1 overflow-y-auto space-y-2">
            {visibleCollections.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-text-secondary">No collections yet.</p>
            ) : (
              visibleCollections.map((collection) => {
                const isCurrent = collection.id === currentCollectionId
                return (
                  <div
                    key={collection.id}
                    className="flex items-stretch border border-gray-200 dark:border-border"
                  >
                    <button
                      type="button"
                      onClick={() => handleMove(collection)}
                      disabled={isCurrent}
                      title={
                        isCurrent
                          ? `This agent is already in ${collection.name}.`
                          : `Move this agent to ${collection.name}.`
                      }
                      className="flex min-w-0 flex-1 items-center justify-between px-3 py-2 text-left text-sm transition hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-70 dark:hover:border-zinc-400"
                    >
                      <span className="truncate font-medium text-gray-800 dark:text-text-primary">
                        {collection.name}
                      </span>
                      <span className="ml-2 shrink-0 text-xs text-gray-500 dark:text-text-muted">
                        {isCurrent ? 'Current collection' : `${collection.agentIds.length} agents`}
                      </span>
                    </button>
                    {isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleRemove(collection)}
                        aria-label={`Remove from ${collection.name}`}
                        className="border-l border-gray-200 px-3 text-xs font-semibold text-zinc-700 hover:bg-gray-100 dark:border-border dark:text-zinc-300 dark:hover:bg-white/10"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>
          <div className="flex gap-2 border-t border-gray-100 pt-4 dark:border-border">
            <label htmlFor="collection-picker-name" className="sr-only">
              New collection name
            </label>
            <input
              id="collection-picker-name"
              data-autofocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={visibleCollections.length >= MAX_COLLECTIONS}
              className="min-w-0 flex-1 border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/40 disabled:opacity-60 dark:border-border dark:bg-surface-input dark:text-text-primary"
              placeholder="New collection name"
            />
            <button
              type="button"
              onClick={handleCreate}
              disabled={visibleCollections.length >= MAX_COLLECTIONS}
              className="inline-flex items-center gap-1.5 bg-black dark:bg-white px-3 py-2 text-sm font-semibold text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={15} />
              Create
            </button>
          </div>
          {message && (
            <p className=" border border-zinc-500/20 bg-zinc-500/10 px-3 py-2 text-sm text-zinc-900 dark:text-white">
              {message}
            </p>
          )}
          {visibleCollections.length >= MAX_COLLECTIONS && (
            <p className="text-xs text-gray-500 dark:text-text-muted">
              You can create up to {MAX_COLLECTIONS} collections.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
