const CREDENTIAL_FIELD = /^(api[_-]?key|token|secret|password|credential|authorization|auth)$/i

const SECRET_VALUE_PATTERNS = [
  /\bsk-(?:proj-|live-|test-)?[A-Za-z0-9_-]{16,}\b/g,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,
  /\bAKIA[0-9A-Z]{16}\b/g,
  /\bAIza[0-9A-Za-z_-]{35}\b/g,
  /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
  /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
]

const ASSIGNED_SECRET =
  /\b(api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|secret|password|authorization)(\s*[:=]\s*)(['"]?)([^\s'"]{8,})\3/gi

/**
 * Exported prompts and notes sometimes contain a pasted credential whose field
 * name is harmless. Redact recognizable token shapes and key/value assignments
 * so a value copied into a prompt cannot leave through an export.
 */
function redactSecretValues(value) {
  let output = value
  for (const pattern of SECRET_VALUE_PATTERNS) output = output.replace(pattern, '[REDACTED]')
  return output.replace(ASSIGNED_SECRET, (match, key, separator) => `${key}${separator}[REDACTED]`)
}

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
  if (typeof value === 'string') return redactSecretValues(value)
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
