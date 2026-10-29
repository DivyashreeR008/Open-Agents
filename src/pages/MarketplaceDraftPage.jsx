import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import AgentRunner from '../components/AgentRunner'
import EmptyState from '../components/layout/EmptyState'
import PageHeader from '../components/layout/PageHeader'
import { useAgents } from '../lib/useAgents'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import {
  buildDraftAgent,
  getDraft,
  getMissingDraftFields,
  removeDraft,
} from '../lib/marketplace'

export default function MarketplaceDraftPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { agents, loading } = useAgents()

  const [draft] = useState(() => getDraft(id))
  // Credential values live in memory only. They are never written to storage,
  // so they have to be entered again after a reload.
  const [values, setValues] = useState({})

  useDocumentTitle(draft ? draft.name : 'Draft not found')

  const draftAgent = useMemo(
    () => (draft ? buildDraftAgent(draft, agents) : null),
    [draft, agents]
  )
  const missing = draft ? getMissingDraftFields(draft, values) : []

  if (!draft) {
    return (
      <EmptyState
        title="Draft not found"
        description="This draft may have been removed."
        action={
          <Link to="/marketplace/drafts" className="btn-primary">
            Back to drafts
          </Link>
        }
      />
    )
  }

  const handleRemove = () => {
    removeDraft(draft.id)
    navigate('/marketplace/drafts')
  }

  return (
    <div className="animate-fade-in">
      <Link
        to="/marketplace/drafts"
        className="mb-3 inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-black dark:text-text-secondary dark:hover:text-white"
      >
        <ArrowLeft size={13} aria-hidden="true" />
        All drafts
      </Link>

      <PageHeader
        title={draft.name}
        description={draft.description || undefined}
        actions={
          <button onClick={handleRemove} className="btn-secondary">
            <Trash2 size={14} aria-hidden="true" />
            Remove draft
          </button>
        }
      />

      {draft.pendingCredentialFields.length > 0 && (
        <section
          aria-labelledby="draft-fields-heading"
          className="mb-5 border border-zinc-200 p-4 dark:border-border"
        >
          <h2 id="draft-fields-heading" className="text-[13px] font-semibold text-zinc-900 dark:text-text-primary">
            Fields to complete
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-text-secondary">
            The publisher's values were removed. Enter your own to run this agent. They are kept
            in this tab only and are not saved.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {draft.pendingCredentialFields.map((field) => (
              <label key={field} className="block text-xs font-medium text-zinc-700 dark:text-text-secondary">
                {field}
                <input
                  type="password"
                  autoComplete="off"
                  value={values[field] ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field]: e.target.value }))}
                  className="mt-1 h-8 w-full border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-border dark:bg-surface-card dark:text-text-primary"
                />
              </label>
            ))}
          </div>
        </section>
      )}

      {loading ? null : !draftAgent ? (
        <EmptyState
          title="This draft cannot run"
          description="The agent it was built from is no longer in the catalogue. You can still remove the draft."
        />
      ) : missing.length > 0 ? (
        <p role="status" className="border border-dashed border-zinc-300 p-4 text-xs text-zinc-500 dark:border-border-light dark:text-text-secondary">
          Complete {missing.length} more field{missing.length === 1 ? '' : 's'} above to unlock the
          runner.
        </p>
      ) : (
        <AgentRunner key={draft.id} agent={draftAgent} />
      )}
    </div>
  )
}
