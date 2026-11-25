import { readdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { buildAgentNameContext } from '../src/lib/agentNameContext.js'

const directory = resolve('src/agents/definitions')
const agents = await Promise.all(
  (await readdir(directory))
    .filter((file) => file.endsWith('.js'))
    .sort()
    .map(async (file) => (await import(pathToFileURL(resolve(directory, file)).href)).default)
)
const contexts = buildAgentNameContext(agents)
const pairs = []
for (const [id, context] of contexts)
  for (const peer of context.matches)
    if (id < peer.id) pairs.push({ left: id, right: peer.id, name: peer.name })
console.log(
  JSON.stringify(
    {
      advisoryOnly: true,
      classification: 'Lexical title overlap, not semantic duplicates or workflow stages',
      agentsChecked: agents.length,
      pairs,
      context: Object.fromEntries(contexts),
    },
    null,
    2
  )
)
