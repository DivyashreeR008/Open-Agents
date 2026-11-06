// ============================================================
// Open Agents — Agent Registry (Lazy-loaded)
// ============================================================
//
// To contribute an agent: create a new file in ./definitions/
// with `export default { ...agentConfig }`, and it will be
// auto-collected here. See CONTRIBUTING.md for full guidelines.
//
// Agent definitions are lazy-loaded via Vite's import.meta.glob
// with `eager: false` to reduce the initial JS bundle size.
// Each definition file becomes a separate chunk loaded on demand.
// ============================================================

const modules = import.meta.glob('./definitions/*.js', { eager: false });

// Known synchronously from the glob, so count-sensitive UI can render the real
// catalogue size during the lazy load instead of flashing a stale number.
export const AGENT_COUNT = Object.keys(modules).length;

/**
 * Fail loudly when two definitions claim the same id. The registry used to
 * drop the later definition and log a console warning, which made a collision
 * look like a missing agent in the catalogue instead of a source error.
 * @param {Array<{id?: string}>} agents
 * @returns {Array<{id?: string}>} the same array, for chaining
 */
export function assertUniqueAgentIds(agents) {
  const seenIds = new Set();
  const duplicateIds = new Set();

  for (const agent of agents) {
    if (!agent?.id) continue;
    if (seenIds.has(agent.id)) {
      duplicateIds.add(agent.id);
    } else {
      seenIds.add(agent.id);
    }
  }

  if (duplicateIds.size > 0) {
    const label = duplicateIds.size === 1 ? 'id' : 'ids';
    throw new Error(
      `Duplicate agent ${label}: ${[...duplicateIds].join(', ')}. ` +
        'Each definition must declare a unique id that matches its filename.'
    );
  }

  return agents;
}

const normalizeAgents = (agents) => {
  assertUniqueAgentIds(agents);
  return agents.filter(Boolean).filter((agent) => {
    if (!agent?.id) {
      console.warn('Skipping agent without an id:', agent);
      return false;
    }
    return true;
  });
};

let cachedAgentsPromise = null;

export function loadAllAgents() {
  if (cachedAgentsPromise) return cachedAgentsPromise;

  cachedAgentsPromise = Promise.all(
    Object.values(modules).map((loader) => loader())
  ).then((entries) => {
    return normalizeAgents(entries.map((mod) => mod.default));
  })
  .catch((error) => {
    // Allow future calls to retry initialization after a failed load.
    cachedAgentsPromise = null;
    throw error;
  });

  return cachedAgentsPromise;
}
