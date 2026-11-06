import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FolderPlus, Trash2, X } from 'lucide-react'
import AgentCard from '../components/AgentCard'
import CollectionAgentPicker from '../components/collections/CollectionAgentPicker'
import { useAgents } from '../lib/useAgents'
import { MAX_AGENTS_PER_COLLECTION, useCollections } from '../lib/useCollections'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import PageHeader from '../components/layout/PageHeader'
import SectionHeader from '../components/layout/SectionHeader'
import EmptyState from '../components/layout/EmptyState'

export default function CollectionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { getCollectionById, deleteCollection, addAgentToCollection, removeAgentFromCollection } =
    useCollections()
  const { agents, loading, error } = useAgents()

  const collection = getCollectionById(id)

  useDocumentTitle(collection ? `${collection.name} Collection` : 'Collection not found')

  const agentById = useMemo(() => new Map(agents.map((agent) => [agent.id, agent])), [agents])

  const collectionAgents = useMemo(() => {
    if (!collection) return []

    return collection.agentIds.map((agentId) => agentById.get(agentId)).filter(Boolean)
  }, [agentById, collection])

  if (!collection) {
    return (
      <EmptyState
        title="Collection not found"
        description="This collection may have been deleted."
        action={
          <Link to="/collections" className="btn-primary">
            Back to collections
          </Link>
        }
      />
    )
  }

  if (loading) {
    return (
      <EmptyState
        title="Loading agents"
        description="Preparing the agent list for this collection."
      />
    )
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load agents"
        description="Refresh the page and try opening this collection again."
      />
    )
  }

  const staleCount = collection.agentIds.length - collectionAgents.length

  const handleDelete = () => {
    deleteCollection(collection.id)
    navigate('/collections')
  }

  const handleAddAgent = (agentId) => {
    return addAgentToCollection(collection.id, agentId)
  }

  const handleRemoveAgent = (agentId) => {
    return removeAgentFromCollection(collection.id, agentId)
  }

  return (
    <div className="animate-fade-in">
      <Link
        to="/collections"
        className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 transition-colors hover:text-black dark:hover:text-white dark:text-text-muted"
      >
        <ArrowLeft size={12} aria-hidden="true" />
        Collections
      </Link>

      <PageHeader
        eyebrow="Agent collection"
        title={collection.name}
        meta={`${collectionAgents.length} / ${MAX_AGENTS_PER_COLLECTION}`}
        description={
          staleCount > 0 ? `runnable agents · ${staleCount} unavailable hidden` : 'runnable agents'
        }
        actions={
          <button
            onClick={handleDelete}
            className="btn-ghost hover:text-black dark:hover:text-white"
          >
            <Trash2 size={14} aria-hidden="true" />
            Delete
          </button>
        }
      />

      <section>
        <SectionHeader
          title="Agents in this collection"
          count={`${collectionAgents.length} / ${MAX_AGENTS_PER_COLLECTION}`}
        />

        {collectionAgents.length === 0 ? (
          <EmptyState
            icon={FolderPlus}
            title="No agents in this collection yet"
            description="Use the checklist below to add agents to this collection."
          />
        ) : (
          <div className="grid grid-cols-1 gap-2.5 pt-1.5 sm:grid-cols-2 xl:grid-cols-3">
            {collectionAgents.map((agent) => (
              <div key={agent.id} className="relative">
                <AgentCard agent={agent} />

                <button
                  onClick={() => handleRemoveAgent(agent.id)}
                  aria-label={`Remove ${agent.name} from collection`}
                  title="Remove from collection"
                  className="absolute -right-1 -top-1 z-10 inline-flex h-5 w-5 items-center justify-center border border-zinc-200 bg-white text-zinc-400 transition-colors hover:border-zinc-400 hover:text-black dark:hover:text-white dark:border-border dark:bg-surface-card"
                >
                  <X size={11} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <CollectionAgentPicker
        collection={collection}
        agents={agents}
        onAddAgent={handleAddAgent}
        onRemoveAgent={handleRemoveAgent}
        maxAgents={MAX_AGENTS_PER_COLLECTION}
      />
    </div>
  )
}
