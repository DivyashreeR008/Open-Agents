import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, ExternalLink } from 'lucide-react'
import Github from '../icons/Github'
import { useAgents } from '../../lib/useAgents'

export default function AboutHero() {
  const { agents, catalogSize } = useAgents()
  const agentCount = agents.length || catalogSize

  return (
    <section
      aria-labelledby="about-hero-title"
      className="relative overflow-hidden panel p-6 sm:p-10 md:p-12 mb-12"
    >
      {/* Background glow accents */}

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-zinc-500/30 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 text-xs font-semibold tracking-wide">
          <Sparkles size={14} className="animate-pulse" />
          <span>Open Source • Community Driven • Zero Backend</span>
        </div>

        {/* Project Title */}
        <h1
          id="about-hero-title"
          className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight dark:text-white text-gray-900 leading-tight"
        >
          Welcome to <span className="text-zinc-900 dark:text-white">OpenAgents</span>
        </h1>

        {/* Short Project Overview & Mission Statement */}
        <p className="text-base sm:text-lg dark:text-text-secondary text-gray-600 max-w-3xl mx-auto leading-relaxed">
          <strong>OpenAgents</strong> is an open-source platform designed to make AI tools
          accessible, transparent, and effortlessly executable directly inside your browser. Bring
          your own API key, keep 100% data privacy, and explore specialized agents built for
          real-world tasks.
        </p>

        {/* Mission Card */}
        <div className="p-4 sm:p-6 panel p-4 text-left max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-zinc-500/10 text-zinc-600 dark:text-zinc-300 shrink-0 mt-0.5">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold dark:text-text-primary text-gray-900 mb-1">
                Our Mission
              </h2>
              <p className="text-xs sm:text-sm dark:text-text-secondary text-gray-600 leading-relaxed">
                To democratize AI automation by fostering a global community of developers,
                creators, and students who build, chain, and share open-source AI tools without
                paywalls, telemetry, or server lock-in.
              </p>
            </div>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/agents"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-zinc-400 hover:bg-zinc-300 transition-colors shadow-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
          >
            <span>Explore {agentCount} Agents</span>
            <ArrowRight size={16} />
          </Link>

          <a
            href="https://github.com/DivyashreeR008/Open-Agents"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Star OpenAgents on GitHub (opens in new tab)"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold dark:text-text-primary text-gray-800 dark:bg-white/10 bg-white border border-gray-200 dark:border-white/10 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
          >
            <Github size={16} />
            <span>Star on GitHub</span>
            <ExternalLink size={12} aria-hidden="true" />
          </a>

          <Link
            to="/workflows"
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold dark:text-text-secondary text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <span>Browse Workflows</span>
          </Link>
        </div>

        {/* Quick Highlights / Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t dark:border-white/10 border-gray-200/80">
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              {agentCount}
            </div>
            <div className="text-xs dark:text-text-secondary text-gray-500 font-medium">
              Ready-to-use Agents
            </div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              4
            </div>
            <div className="text-xs dark:text-text-secondary text-gray-500 font-medium">
              AI Providers
            </div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              100%
            </div>
            <div className="text-xs dark:text-text-secondary text-gray-500 font-medium">
              Browser Privacy
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
