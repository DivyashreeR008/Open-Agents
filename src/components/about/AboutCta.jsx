import { Link } from 'react-router-dom'
import { Sparkles, GitPullRequest, ArrowRight, PlusCircle, ExternalLink } from 'lucide-react'
import GitHubIcon from '../GitHubIcon'

export default function AboutCta() {
  return (
    <section
      aria-labelledby="about-cta-title"
      className="relative overflow-hidden panel border-zinc-500/25 p-8 sm:p-12 text-center shadow-pop"
    >
      {/* Glow overlays */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-zinc-500/30" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 text-xs font-semibold border border-zinc-500/30">
          <Sparkles size={14} className="text-zinc-600 dark:text-zinc-300" />
          <span>Join 100+ Community Contributors</span>
        </div>

        <h2
          id="about-cta-title"
          className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white"
        >
          Ready to Shape the Future of Open AI Tools?
        </h2>

        <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-100/70 max-w-2xl mx-auto leading-relaxed">
          Whether you want to add a 5-minute agent, polish UI components, or fix open issues — your
          contributions power this platform.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="https://github.com/DivyashreeR008/Open-Agents/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-8 px-3 text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 transition-colors duration-300"
          >
            <GitPullRequest size={16} />
            <span>Explore Open Issues</span>
            <ExternalLink size={12} aria-hidden="true" />
            <span className="sr-only">(opens in new tab)</span>
          </a>

          <a
            href="https://github.com/DivyashreeR008/Open-Agents"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-8 px-3 text-sm font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 border border-zinc-300 dark:border-zinc-400/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 transition-colors duration-300"
          >
            <GitHubIcon size={16} />
            <span>Star on GitHub</span>
            <ExternalLink size={12} aria-hidden="true" />
            <span className="sr-only">(opens in new tab)</span>
          </a>

          <Link
            to="/agents"
            className="inline-flex items-center gap-2 h-8 px-3 text-sm font-bold text-zinc-800 dark:text-zinc-200 bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 border border-zinc-300 dark:border-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 transition-colors duration-300"
          >
            <PlusCircle size={16} />
            <span>Use AI Agents Now</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
