import { Compass, Target, Milestone, Zap, Layers, Sparkles } from 'lucide-react'

export default function AboutVision() {
  const roadmapItems = [
    {
      phase: 'Phase 1 • Core Foundation',
      status: 'Active',
      title: 'Config-Driven AI Agent Ecosystem',
      description:
        'Expand a growing library of specialized single-purpose agents across engineering, marketing, education, design, business, and healthcare with instant browser execution.',
      icon: Target,
    },
    {
      phase: 'Phase 2 • Agent Orchestration',
      status: 'Active',
      title: 'Workflows & Battle Arena',
      description:
        'Chain multiple agents into automated pipelines where outputs flow directly. Compare models side-by-side in real-time in Battle Mode.',
      icon: Layers,
    },
    {
      phase: 'Phase 3 • Community Hub',
      status: 'Upcoming',
      title: 'Community Marketplace & Custom Suites',
      description:
        'Enable community members to share custom agent suites, export workflow definitions, and discover curated agent packs with one click.',
      icon: Sparkles,
    },
    {
      phase: 'Phase 4 • Open Protocol',
      status: 'Vision',
      title: 'Local LLMs & Privacy Extensions',
      description:
        'Support local model runtimes (Ollama, LM Studio) and extended browser storage for fully offline, zero-network agent execution.',
      icon: Zap,
    },
  ]

  return (
    <section aria-labelledby="about-vision-title" className="mb-12">
      <div className="flex items-center gap-2 mb-3">
        <Compass className="text-zinc-600 dark:text-zinc-300" size={22} />
        <h2
          id="about-vision-title"
          className="text-2xl sm:text-3xl font-bold dark:text-text-primary text-gray-900 tracking-tight"
        >
          Project Vision & Future Roadmap
        </h2>
      </div>

      <p className="text-sm dark:text-text-secondary text-gray-600 mb-8 max-w-3xl leading-relaxed">
        We believe the future of AI tooling belongs to open, privacy-preserving, and lightweight
        applications. Rather than complex server infrastructures, OpenAgents turns your browser into
        a powerful AI workspace powered by your own API keys.
      </p>

      {/* Roadmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roadmapItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className="group relative panel p-5 transition-colors hover:border-zinc-400 dark:hover:border-zinc-400 duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-zinc-500/15 text-zinc-600 dark:text-zinc-300 transition-transform">
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {item.phase}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 border ${
                      item.status === 'Active'
                        ? 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20'
                        : item.status === 'Upcoming'
                          ? 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/25'
                          : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm dark:text-text-secondary text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
