const CREDENTIAL_FIELD = /^(api[_-]?key|token|secret|password|credential|authorization|auth)$/i

/**
 * Recursively remove credential-shaped fields before data crosses a durable
 * storage or export boundary. The encrypted automation vault is the only
 * reviewed exception; callers must encrypt its values before persistence.
 */
const isPlainObject = (value) => {
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function stripValue(value, seen) {
  if (Array.isArray(value)) {
    if (seen.has(value)) return seen.get(value)
    const output = []
    seen.set(value, output)
    for (const child of value) output.push(stripValue(child, seen))
    return output
  }
  if (!value || typeof value !== 'object') return value
  if (!isPlainObject(value)) return value
  if (seen.has(value)) return seen.get(value)

  const output = {}
  seen.set(value, output)
  for (const [key, child] of Object.entries(value)) {
    if (CREDENTIAL_FIELD.test(key.trim())) continue
    output[key] = stripValue(child, seen)
  }
  return output
}

export function stripCredentialFields(value) {
  return stripValue(value, new WeakMap())
}
