import * as LucideIcons from 'lucide-react'
import GitHubIcon from '../components/GitHubIcon'

/**
 * Agent definitions store an icon name as a string. Resolving that string
 * through this module keeps the lookup in one place and gives removed or
 * renamed lucide exports a controlled fallback.
 *
 * `Github` is aliased because lucide-react 1.x dropped brand icons. The
 * underlying definitions still use `Github`, so the alias keeps published
 * definitions and stored favourites rendering the same mark.
 */
const ICON_ALIASES = {
  Github: GitHubIcon,
  GitHub: GitHubIcon,
}

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key)

export function resolveAgentIcon(name) {
  if (!name) return LucideIcons.Bot
  if (hasOwn(ICON_ALIASES, name)) return ICON_ALIASES[name]
  return hasOwn(LucideIcons, name) ? LucideIcons[name] : LucideIcons.Bot
}

export function isKnownAgentIcon(name) {
  if (!name) return false
  return hasOwn(ICON_ALIASES, name) || (hasOwn(LucideIcons, name) && Boolean(LucideIcons[name]))
}
