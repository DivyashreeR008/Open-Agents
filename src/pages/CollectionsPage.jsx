import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Download, Edit3, FolderPlus, Plus, Trash2, Upload } from 'lucide-react'
import CollectionModal from '../components/CollectionModal'
import ImportCollectionModal from '../components/collections/ImportCollectionModal'
import PageHeader from '../components/layout/PageHeader'
import EmptyState from '../components/layout/EmptyState'
import { useAgents } from '../lib/useAgents'
import { DEFAULT_COLLECTION_ID, MAX_COLLECTIONS, useCollections } from '../lib/useCollections'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useFlashNotice } from '../lib/useFlashNotice'
import { collectionExportFilename, serializeCollection } from '../lib/collectionTransfer'

export default function CollectionsPage() {
  useDocumentTitle('Collections')

  const {
    collections,
    createCollection,
    deleteCollection,
    renameCollection,
    importCollection,
    duplicateCollection,
  } = useCollections()
  const { notice, flash } = useFlashNotice()
  const { agents, loading, error: agentsError } = useAgents()
  const [modal, setModal] = useState(null)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const customCollections = useMemo(
    () => collections.filter((collection) => collection.id !== DEFAULT_COLLECTION_ID),
    [collections]
  )
  const agentMap = useMemo(() => new Map(agents.map((agent) => [agent.id, agent])), [agents])

  const openCreate = () => { setModal('create'); setName(''); setError('') }
  const submitCreate = (event) => {
    event.preventDefault()
    const result = createCollection(name)
    if (!result.ok) return setError(result.error)
    setModal(null)
  }
  const submitRename = (event) => {
    event.preventDefault()
    const result = renameCollection(modal.id, name)
    if (!result.ok) return setError(result.error)
    setModal(null)
  }

  const handleExport = (collection) => {
    const blob = new Blob([serializeCollection(collection)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = collectionExportFilename(collection)
    link.click()
    URL.revokeObjectURL(url)
    flash(`Exported "${collection.name}".`)
  }

  const handleDuplicate = (collection) => {
    const result = duplicateCollection(collection.id)
    flash(result.ok ? `Created "${result.collection.name}".` : result.error)
  }

  const handleImport = (data) => {
    const result = importCollection(data)
    if (result.ok) {
      setModal(null)
      flash(`Imported "${result.collection.name}".`)
    }
    return result
  }

  const getPreviewText = (collection) => {
    if (loading) return 'Loading agent previews…'
    if (agentsError) return 'Agent previews unavailable. Open the collection to manage saved agents.'

    const previewAgents = collection.agentIds
      .map((id) => agentMap.get(id))
      .filter(Boolean)
      .slice(0, 3)

    if (previewAgents.length) {
      return previewAgents.map((agent) => agent.name).join(', ')
    }

    return collection.agentIds.length
      ? 'Saved agents are unavailable. Open the collection to review them.'
      : 'Empty collection. Add agents from the agent cards.'
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Collections"
        meta={customCollections.length}
        description="Custom groups of agents"
        actions={
          <>
            <button
              onClick={() => setModal('import')}
              disabled={customCollections.length >= MAX_COLLECTIONS}
              className="btn-secondary"
            >
              <Upload size={14} aria-hidden="true" />
              Import
            </button>
            <button
              onClick={openCreate}
              disabled={customCollections.length >= MAX_COLLECTIONS}
              className="btn-primary"
            >
              <Plus size={14} aria-hidden="true" />
              New collection
            </button>
          </>
        }
      />

      {notice && (
        <p role="status" className="mb-3 border border-zinc-200 px-3 py-2 text-xs text-zinc-700 dark:border-border dark:text-text-secondary">
          {notice}
        </p>
      )}

      {customCollections.length === 0 ? (
        <EmptyState
          icon={FolderPlus}
          title="No collections yet"
          description="Create a collection, then add agents to it from any agent card — or drag an agent straight onto a collection in the sidebar."
          action={
            <button onClick={openCreate} className="btn-primary">
              Create collection
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {customCollections.map((collection) => (
            <article
              key={collection.id}
              className="flex flex-col border border-zinc-200 bg-white p-3.5 transition-colors hover:border-zinc-400 dark:hover:border-zinc-400 dark:border-border dark:bg-surface-card"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate text-[13px] font-semibold text-zinc-900 dark:text-text-primary">
                    {collection.name}
                  </h2>
                  <span className="eyebrow mt-0.5 block">{collection.agentIds.length} agents</span>
                </div>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-zinc-500/10 text-zinc-600 dark:text-zinc-300">
                  <FolderPlus size={13} aria-hidden="true" />
                </span>
              </div>

              <p className="mt-2.5 line-clamp-2 min-h-10 text-xs leading-relaxed text-zinc-500 dark:text-text-secondary">
                {getPreviewText(collection)}
              </p>

              <div className="mt-3 flex items-center gap-1.5 border-t border-zinc-100 pt-2.5 dark:border-border/60">
                <Link to={`/collections/${collection.id}`} className="btn-secondary h-7 flex-1 text-[11px]">
                  Open
                </Link>
                <button
                  onClick={() => {
                    setModal(collection)
                    setName(collection.name)
                    setError('')
                  }}
                  className="btn-ghost h-7 px-2"
                  aria-label={`Rename ${collection.name}`}
                  title="Rename"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => handleExport(collection)}
                  className="btn-ghost h-7 px-2"
                  aria-label={`Export ${collection.name}`}
                  title="Export as JSON"
                >
                  <Download size={13} />
                </button>
                <button
                  onClick={() => handleDuplicate(collection)}
                  disabled={customCollections.length >= MAX_COLLECTIONS}
                  className="btn-ghost h-7 px-2"
                  aria-label={`Duplicate ${collection.name}`}
                  title="Duplicate"
                >
                  <Copy size={13} />
                </button>
                <button
                  onClick={() => deleteCollection(collection.id)}
                  className="btn-ghost h-7 px-2 hover:text-black dark:hover:text-white"
                  aria-label={`Delete ${collection.name}`}
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {modal === 'create' && (
        <CollectionModal
          title="New Collection"
          description={`You can create up to ${MAX_COLLECTIONS} collections.`}
          value={name}
          onChange={setName}
          error={error}
          onClose={() => setModal(null)}
          onSubmit={submitCreate}
          submitLabel="Create"
        />
      )}
      {modal === 'import' && (
        <ImportCollectionModal agents={agents} onImport={handleImport} onClose={() => setModal(null)} />
      )}
      {modal && modal !== 'create' && modal !== 'import' && (
        <CollectionModal
          title="Rename Collection"
          value={name}
          onChange={setName}
          error={error}
          onClose={() => setModal(null)}
          onSubmit={submitRename}
          submitLabel="Save"
        />
      )}
    </div>
  )
}
