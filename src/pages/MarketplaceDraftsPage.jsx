import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PackageOpen, Trash2, Store } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import EmptyState from '../components/layout/EmptyState'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { loadDrafts, removeDraft } from '../lib/marketplace'

export default function MarketplaceDraftsPage() {
  useDocumentTitle('Imported drafts')

  const [drafts, setDrafts] = useState(loadDrafts)

  const handleRemove = (draft) => {
    removeDraft(draft.id)
    setDrafts(loadDrafts())
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Imported drafts"
        meta={drafts.length}
        description="Agents you imported from the marketplace"
        actions={
          <Link to="/marketplace" className="btn-secondary">
            <Store size={14} aria-hidden="true" />
            Back to marketplace
          </Link>
        }
      />

      {drafts.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No imported drafts"
          description="Import an agent from the marketplace and it will show up here."
          action={
            <Link to="/marketplace" className="btn-primary">
              Browse marketplace
            </Link>
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {drafts.map((draft) => (
            <li
              key={draft.id}
              className="flex flex-col border border-zinc-200 bg-white p-3.5 dark:border-border dark:bg-surface-card"
            >
              <h2 className="truncate text-[13px] font-semibold text-zinc-900 dark:text-text-primary">
                {draft.name}
              </h2>
              <span className="eyebrow mt-0.5 block">
                {draft.pendingCredentialFields.length > 0
                  ? `${draft.pendingCredentialFields.length} field(s) to complete`
                  : 'Ready to run'}
              </span>
              <p className="mt-2.5 line-clamp-2 min-h-10 text-xs leading-relaxed text-zinc-500 dark:text-text-secondary">
                {draft.description || 'No description.'}
              </p>
              <div className="mt-3 flex items-center gap-1.5 border-t border-zinc-100 pt-2.5 dark:border-border/60">
                <Link
                  to={`/marketplace/drafts/${encodeURIComponent(draft.id)}`}
                  className="btn-secondary h-7 flex-1 text-[11px]"
                >
                  Open
                </Link>
                <button
                  onClick={() => handleRemove(draft)}
                  className="btn-ghost h-7 px-2 hover:text-black dark:hover:text-white"
                  aria-label={`Remove ${draft.name}`}
                  title="Remove"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
