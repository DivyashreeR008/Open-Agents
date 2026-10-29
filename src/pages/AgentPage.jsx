import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import AgentRunner from '../components/AgentRunner'
import ErrorCard from '../components/ErrorCard'
import NotFoundPage from './NotFoundPage'

import { useAgents } from '../lib/useAgents'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function AgentPage() {
const { id } = useParams()

const {
agents,
loading: isLoading,
error,
reloadAgents,
} = useAgents()

const agent = agents.find((a) => a.id === id)

useDocumentTitle(agent?.name ?? 'Agent')

useEffect(() => {
if (!agent) return

const existing = JSON.parse(
  localStorage.getItem('recentAgents') || '[]'
)

const updated = [
  agent.id,
  ...existing.filter((item) => item !== agent.id),
].slice(0, 5)

localStorage.setItem(
  'recentAgents',
  JSON.stringify(updated)
)

}, [agent])

if (isLoading) {
return (
<div className="flex min-h-[70vh] flex-col items-center justify-center gap-3" role="status" aria-live="polite" >
<Loader2 size={28} className="animate-spin text-zinc-500" aria-hidden="true" />

    <p className="text-sm text-zinc-500 dark:text-text-secondary">
      Loading agent...
    </p>

    <span className="sr-only">
      Please wait while the agent loads.
    </span>
  </div>
)

}

if (error) {
return (
<div className="mx-auto w-full max-w-3xl p-6">
<ErrorCard
message={
error.message ||
'Unable to load agents. Please try again.'
}
/>

    <button
      type="button"
      onClick={reloadAgents}
      className="btn-primary mt-4"
    >
      Try again
    </button>
  </div>
)

}

if (!agent) {
return <NotFoundPage />
}

return <AgentRunner key={agent.id} agent={agent} />
}