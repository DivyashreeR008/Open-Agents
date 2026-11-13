import { Swords } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function BattleNavbar() {
  const { pathname } = useLocation()
  const isCurrent = pathname === '/battle'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-11 flex items-center px-4 sm:px-6 dark:bg-surface bg-white backdrop-blur-md border-b border-zinc-300 dark:border-zinc-400/20 shadow-panel battle-page-transition">
      <Link
        to="/battle"
        aria-current={isCurrent ? 'page' : undefined}
        className={`flex items-center gap-2 px-2 py-1 -ml-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 ${
          isCurrent ? 'bg-zinc-200/70 dark:bg-white/10' : 'hover:bg-zinc-100 dark:hover:bg-white/5'
        }`}
      >
        <div className="w-6 h-6 bg-zinc-500/10 dark:bg-zinc-400/10 border border-zinc-400/50 dark:border-zinc-400/30 flex items-center justify-center group-hover:bg-zinc-400/20 group-hover:border-zinc-400/50 transition-colors duration-200">
          <Swords
            size={14}
            aria-hidden="true"
            className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 transition-colors"
          />
        </div>
        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white tracking-wide transition-colors duration-200">
          Battle Mode
        </span>
      </Link>
    </nav>
  )
}
