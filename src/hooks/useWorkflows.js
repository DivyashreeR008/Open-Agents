import { isSupabaseConfigured, supabase } from '../lib/supabase'

const LOCAL_WORKFLOWS_KEY = 'open-agents-workflows'
const LOCAL_USER_ID = 'local-user'

function backendIsConfigured() {
  // A literal false means the optional backend is absent. Undefined keeps the
  // backend path for callers that provide a client without the flag.
  return isSupabaseConfigured !== false
}

function localError(message, error) {
  const detail = error?.message ? ` (${error.message})` : ''
  return { message: `${message}${detail}` }
}

function readLocalWorkflows() {
  let storage
  try {
    storage = window.localStorage
  } catch (error) {
    return {
      data: null,
      error: localError(
        'Local workflow storage is unavailable in this browser. Allow site data and try again.',
        error
      ),
    }
  }

  let raw
  try {
    raw = storage.getItem(LOCAL_WORKFLOWS_KEY)
  } catch (error) {
    return {
      data: null,
      error: localError(
        'Local workflow storage could not be read. Allow site data for this page and try again.',
        error
      ),
    }
  }

  if (!raw) return { data: [], error: null }

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) throw new Error('stored value is not a list')
    return { data: parsed, error: null }
  } catch (error) {
    return {
      data: null,
      error: localError(
        `Saved workflows are unreadable. Clear the "${LOCAL_WORKFLOWS_KEY}" entry in browser storage and refresh.`,
        error
      ),
    }
  }
}

function writeLocalWorkflows(workflows) {
  try {
    window.localStorage.setItem(LOCAL_WORKFLOWS_KEY, JSON.stringify(workflows))
    return { error: null }
  } catch (error) {
    return {
      error: localError(
        'Could not store the workflow in this browser. Delete unused workflows or free browser storage, then try again.',
        error
      ),
    }
  }
}

function makeLocalId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function findLocalWorkflow(workflows, id) {
  return workflows.findIndex((workflow) => workflow.id === id)
}

function sortNewestFirst(workflows) {
  return [...workflows].sort((a, b) =>
    String(b.created_at ?? '').localeCompare(String(a.created_at ?? ''))
  )
}

function localSaveWorkflow(workflow) {
  const { data: workflows, error } = readLocalWorkflows()
  if (error) return { data: null, error }

  const now = new Date().toISOString()
  const stored = {
    id: makeLocalId(),
    user_id: LOCAL_USER_ID,
    title: workflow.title,
    description: workflow.description || '',
    agents: Array.isArray(workflow.agents) ? workflow.agents : [],
    is_public: true,
    usage_count: 0,
    created_at: now,
    updated_at: now,
  }

  const write = writeLocalWorkflows([stored, ...workflows])
  if (write.error) return { data: null, error: write.error }
  return { data: stored, error: null }
}

function localUpdateWorkflow(id, updates) {
  const { data: workflows, error } = readLocalWorkflows()
  if (error) return { data: null, error }

  const index = findLocalWorkflow(workflows, id)
  if (index === -1) {
    return {
      data: null,
      error: {
        message: `Workflow ${id} was not found in local storage. Refresh the workflow library and try again.`,
      },
    }
  }

  const updated = {
    ...workflows[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  const next = workflows.map((workflow, position) => (position === index ? updated : workflow))
  const write = writeLocalWorkflows(next)
  if (write.error) return { data: null, error: write.error }
  return { data: updated, error: null }
}

function localDeleteWorkflow(id) {
  const { data: workflows, error } = readLocalWorkflows()
  if (error) return { error }

  const next = workflows.filter((workflow) => workflow.id !== id)
  if (next.length === workflows.length) {
    return {
      error: {
        message: `Workflow ${id} was not found in local storage. Refresh the workflow library and try again.`,
      },
    }
  }

  const write = writeLocalWorkflows(next)
  if (write.error) return { error: write.error }
  return { error: null }
}

function localIncrementUsage(id) {
  const { data: workflows, error } = readLocalWorkflows()
  if (error) return { error }

  const index = findLocalWorkflow(workflows, id)
  if (index === -1) {
    return {
      error: {
        message: `Workflow ${id} was not found in local storage. Refresh the workflow library and try again.`,
      },
    }
  }

  const count = Number(workflows[index].usage_count)
  const next = workflows.map((workflow, position) =>
    position === index
      ? { ...workflow, usage_count: (Number.isFinite(count) ? count : 0) + 1 }
      : workflow
  )
  const write = writeLocalWorkflows(next)
  if (write.error) return { error: write.error }
  return { error: null }
}

function localFetchWorkflows() {
  const { data, error } = readLocalWorkflows()
  if (error) return { data: [], error }
  return { data: sortNewestFirst(data), error: null }
}

function localFetchWorkflowById(id) {
  const { data, error } = readLocalWorkflows()
  if (error) return { data: null, error }

  const workflow = data.find((item) => item.id === id)
  if (!workflow) {
    return {
      data: null,
      error: {
        message: `Workflow ${id} was not found in local storage. Open the workflow library and choose an existing workflow.`,
      },
    }
  }
  return { data: workflow, error: null }
}

function localSubscription(name) {
  if (typeof supabase.channel === 'function') return supabase.channel(name)
  const channel = {
    on() {
      return channel
    },
    subscribe() {
      return channel
    },
  }
  return channel
}

/**
 * Get the currently authenticated user's ID.
 * Returns null if no user is logged in or Supabase auth is unavailable.
 * @returns {Promise<string|null>}
 */
async function getCurrentUserId() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error || !user) return null
    return user.id
  } catch (err) {
    console.warn('Failed to get current user:', err)
    return null
  }
}

/**
 * Fetch all public workflows from Supabase, ordered by newest first.
 * @returns {Promise<{ data: Array, error: object|null }>}
 */
export async function fetchWorkflows() {
  if (!backendIsConfigured()) return localFetchWorkflows()

  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  return { data: data ?? [], error }
}

/**
 * Fetch a single workflow by its ID.
 * @param {string} id
 * @returns {Promise<{ data: object|null, error: object|null }>}
 */
export async function fetchWorkflowById(id) {
  if (!backendIsConfigured()) return localFetchWorkflowById(id)

  const { data, error } = await supabase.from('workflows').select('*').eq('id', id).single()

  return { data: data ?? null, error }
}

/**
 * Save a new workflow to Supabase with user ownership verification.
 * Ensures the current authenticated user is recorded as the workflow owner.
 * @param {{ title: string, description: string, agents: string[] }} workflow
 * @returns {Promise<{ data: object|null, error: object|null }>}
 */
export async function saveWorkflow(workflow) {
  if (!backendIsConfigured()) return localSaveWorkflow(workflow)

  const userId = await getCurrentUserId()

  // Require user authentication to prevent unauthorized writes
  if (!userId) {
    return {
      data: null,
      error: {
        message: 'User must be authenticated to save workflows. Please log in first.',
      },
    }
  }

  const { data, error } = await supabase
    .from('workflows')
    .insert([
      {
        user_id: userId,
        title: workflow.title,
        description: workflow.description || '',
        agents: workflow.agents,
        is_public: true,
        usage_count: 0,
      },
    ])
    .select()
    .single()

  return { data: data ?? null, error }
}

/**
 * Update an existing workflow with user ownership verification.
 * Only allows updates if the current user is the workflow owner.
 * @param {string} id - Workflow ID
 * @param {{ title?: string, description?: string, agents?: string[], is_public?: boolean }} updates
 * @returns {Promise<{ data: object|null, error: object|null }>}
 */
export async function updateWorkflow(id, updates) {
  if (!backendIsConfigured()) return localUpdateWorkflow(id, updates)

  const userId = await getCurrentUserId()

  if (!userId) {
    return {
      data: null,
      error: {
        message: 'User must be authenticated to update workflows.',
      },
    }
  }

  // Verify ownership: fetch workflow and check user_id matches
  const { data: workflow, error: fetchError } = await supabase
    .from('workflows')
    .select('user_id')
    .eq('id', id)
    .single()

  if (fetchError || !workflow) {
    return {
      data: null,
      error: fetchError || { message: 'Workflow not found.' },
    }
  }

  if (workflow.user_id !== userId) {
    return {
      data: null,
      error: {
        message:
          'You do not have permission to update this workflow. Only the owner can make changes.',
      },
    }
  }

  // Proceed with update (ownership verified)
  const { data, error } = await supabase
    .from('workflows')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  return { data: data ?? null, error }
}

/**
 * Delete a workflow with user ownership verification.
 * Only allows deletion if the current user is the workflow owner.
 * @param {string} id - Workflow ID
 * @returns {Promise<{ error: object|null }>}
 */
export async function deleteWorkflow(id) {
  if (!backendIsConfigured()) return localDeleteWorkflow(id)

  const userId = await getCurrentUserId()

  if (!userId) {
    return {
      error: {
        message: 'User must be authenticated to delete workflows.',
      },
    }
  }

  // Verify ownership: fetch workflow and check user_id matches
  const { data: workflow, error: fetchError } = await supabase
    .from('workflows')
    .select('user_id')
    .eq('id', id)
    .single()

  if (fetchError || !workflow) {
    return {
      error: fetchError || { message: 'Workflow not found.' },
    }
  }

  if (workflow.user_id !== userId) {
    return {
      error: {
        message:
          'You do not have permission to delete this workflow. Only the owner can delete it.',
      },
    }
  }

  // Proceed with deletion (ownership verified)
  const { error } = await supabase.from('workflows').delete().eq('id', id).eq('user_id', userId)

  return { error }
}

/**
 * Increment the usage_count for a workflow by 1.
 * Uses a raw RPC-style update to safely increment without race conditions.
 * @param {string} id
 * @returns {Promise<{ error: object|null }>}
 */
/**
 * Increment the usage_count for a workflow by 1.
 * Uses a raw RPC-style update to safely increment without race conditions.
 * @param {string} id
 * @returns {Promise<{ error: object|null }>}
 */
export async function incrementUsage(id) {
  if (!backendIsConfigured()) return localIncrementUsage(id)

  const { error: rpcError } = await supabase.rpc('increment_workflow_usage', { workflow_id: id })

  // 1. If the RPC works perfectly, exit immediately with no error.
  if (!rpcError) {
    return { error: null }
  }

  // 2. If we reach this point, the RPC failed. Attempt client-side fallback.
  console.warn('RPC failed, executing client-side fallback:', rpcError.message)

  const { data: current, error: readError } = await supabase
    .from('workflows')
    .select('usage_count')
    .eq('id', id)
    .single()

  if (readError) return { error: readError }

  if (current) {
    const { error: updateError } = await supabase
      .from('workflows')
      .update({ usage_count: (current.usage_count ?? 0) + 1 })
      .eq('id', id)

    return { error: updateError }
  }

  // 3. THE FIX: If 'current' is null (row not found), return a clear contextual error
  // instead of letting it slip through to return the old rpcError.
  return {
    error: {
      message: `Failed to increment usage. Workflow with ID ${id} could not be found during fallback.`,
    },
  }
}

/**
 * Subscribe to realtime updates for a specific workflow's usage_count.
 * Returns the channel object — call supabase.removeChannel(channel) to unsubscribe.
 * @param {string} workflowId
 * @param {(payload: object) => void} callback
 * @returns {RealtimeChannel}
 */
export function subscribeToWorkflow(workflowId, callback) {
  if (!backendIsConfigured()) return localSubscription(`workflow-usage-${workflowId}`)

  const channel = supabase
    .channel(`workflow-usage-${workflowId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'workflows',
        filter: `id=eq.${workflowId}`,
      },
      (payload) => {
        callback(payload)
      }
    )
    .subscribe()

  return channel
}

/**
 * Subscribe to realtime updates for ALL public workflows (for library page).
 * Returns the channel object — call supabase.removeChannel(channel) to unsubscribe.
 * @param {(payload: object) => void} callback
 * @returns {RealtimeChannel}
 */
export function subscribeToAllWorkflows(callback) {
  if (!backendIsConfigured()) return localSubscription('workflow-usage-all')

  const channel = supabase
    .channel('workflow-usage-all')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'workflows',
      },
      (payload) => {
        callback(payload)
      }
    )
    .subscribe()

  return channel
}
