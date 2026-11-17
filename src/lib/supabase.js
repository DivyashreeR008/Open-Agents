import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured =
  Boolean(supabaseUrl && supabaseAnonKey) &&
  supabaseUrl !== 'undefined' &&
  supabaseAnonKey !== 'undefined'

function createNoopQuery(result = { data: [], error: null }) {
  const query = {
    select: () => query,
    insert: () => query,
    upsert: () => query,
    update: () => query,
    delete: () => query,
    eq: () => query,
    neq: () => query,
    gt: () => query,
    gte: () => query,
    lt: () => query,
    lte: () => query,
    like: () => query,
    ilike: () => query,
    is: () => query,
    in: () => query,
    not: () => query,
    or: () => query,
    filter: () => query,
    match: () => query,
    contains: () => query,
    order: () => query,
    limit: () => query,
    range: () => query,
    single: () => createNoopQuery({ data: null, error: null }),
    maybeSingle: () => createNoopQuery({ data: null, error: null }),
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
    catch: (reject) => Promise.resolve(result).catch(reject),
    finally: (callback) => Promise.resolve(result).finally(callback),
  }

  return query
}

const noopChannel = {
  on: () => noopChannel,
  subscribe: () => noopChannel,
}

const noopAuth = {
  getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  signOut: () => Promise.resolve({ error: null }),
  onAuthStateChange: () => ({
    data: { subscription: { unsubscribe: () => {} } },
  }),
}

const noopSupabase = {
  from: () => createNoopQuery(),
  rpc: () => Promise.resolve({ data: null, error: null }),
  channel: () => noopChannel,
  removeChannel: () => Promise.resolve(),
  auth: noopAuth,
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : noopSupabase
