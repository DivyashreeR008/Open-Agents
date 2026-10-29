import { useDocumentTitle } from '../lib/useDocumentTitle'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Github, Mail } from 'lucide-react'
import { useAgents } from '../lib/useAgents'
import { CATEGORIES } from '../agents/categories'

export default function PortfolioPage() {
  useDocumentTitle('OpenAgents')

  const { agents, catalogSize } = useAgents()
  const agentCount = agents.length || catalogSize

  const index = [
    { n: '01', title: 'Agent Catalogue', note: `${agentCount} agents, ${CATEGORIES.length} categories`, to: '/agents' },
    { n: '02', title: 'Battle Mode', note: 'Head-to-head model comparison', to: '/battle' },
    { n: '03', title: 'Workflow Builder', note: 'Chain agents into pipelines', to: '/workflows/build' },
    { n: '04', title: 'Automations', note: 'Schedules, retries, batch runs', to: '/automations' },
    { n: '05', title: 'Analytics', note: 'Usage, cost, run history', to: '/analytics' },
  ]

  const stack = [
    ['Frontend', 'React 18, Vite 6, Tailwind CSS 3'],
    ['Routing', 'React Router 6, lazy-loaded routes'],
    ['Backend', 'Supabase — Postgres, auth, storage'],
    ['Agents', `${agentCount} file-based definitions, zero-config registry`],
    ['Testing', 'Vitest'],
  ]

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black antialiased">
      <a href="#index" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:text-sm">
        Skip to content
      </a>

      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link to="/" className="font-mono text-sm tracking-tight shrink-0">openagents_</Link>
          <nav className="flex items-center gap-4 sm:gap-6 font-mono text-xs text-neutral-400">
            <a href="#index" className="hover:text-white transition-colors">Index</a>
            <a href="#stack" className="hidden sm:inline hover:text-white transition-colors">Stack</a>
            <a href="#license" className="hidden sm:inline hover:text-white transition-colors">License</a>
            <a
              href="https://github.com/DivyashreeR008/Open-Agents"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors inline-flex items-center gap-1"
            >
              GitHub <ArrowUpRight size={12} />
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-white/10">
          <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24">
            <p className="font-mono text-xs text-neutral-500 mb-6">OPEN-SOURCE AI AGENT WORKSPACE — MIT LICENSED</p>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-[0.95]">
              OpenAgents
            </h1>
            <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-neutral-400">
              A self-hostable workspace for running AI agents. Pick from {agentCount} definitions,
              compare models side by side, chain steps into workflows, and schedule
              recurring runs — without handing your data to a black-box SaaS.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/agents"
                className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                Enter Agent Workspace <ArrowRight size={15} />
              </Link>
              <a
                href="https://github.com/DivyashreeR008/Open-Agents"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/25 px-5 py-2.5 text-sm font-medium hover:border-white hover:bg-white/5 transition-colors"
              >
                <Github size={15} /> Source code
              </a>
            </div>
            <dl className="mt-14 grid grid-cols-3 max-w-lg gap-6 border-t border-white/10 pt-6">
              <div>
                <dt className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest">Agents</dt>
                <dd className="mt-1 text-2xl font-semibold tracking-tight">{agentCount}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest">Routes</dt>
                <dd className="mt-1 text-2xl font-semibold tracking-tight">20+</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest">License</dt>
                <dd className="mt-1 text-2xl font-semibold tracking-tight">MIT</dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="index" className="border-b border-white/10 scroll-mt-14">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="font-mono text-xs text-neutral-500 uppercase tracking-widest">Index</h2>
              <span className="font-mono text-xs text-neutral-600">05 sections</span>
            </div>
            <ul className="border-t border-white/10">
              {index.map((item) => (
                <li key={item.n} className="border-b border-white/10">
                  <Link
                    to={item.to}
                    className="group flex items-baseline gap-5 md:gap-8 py-5 md:py-6 hover:bg-white/[0.03] transition-colors -mx-6 px-6"
                  >
                    <span className="font-mono text-xs text-neutral-600 w-6 shrink-0">{item.n}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-xl md:text-2xl font-medium tracking-tight group-hover:underline underline-offset-4 decoration-white/40">
                        {item.title}
                      </span>
                      <span className="block mt-1 text-sm text-neutral-500">{item.note}</span>
                    </span>
                    <ArrowUpRight size={18} className="shrink-0 text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-white/10">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-5">Why open source</h2>
              <p className="text-neutral-300 leading-relaxed">
                Most agent platforms are closed: your prompts, outputs, and usage data
                live on someone else's servers. OpenAgents keeps the whole loop —
                definitions, runs, history — in a codebase you can read, fork, and
                self-host.
              </p>
            </div>
            <div>
              <h2 className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-5">What it is not</h2>
              <p className="text-neutral-300 leading-relaxed">
                Not a model, not an API wrapper, not a demo. It is a workspace:
                versioned agent definitions on disk, explicit run history, and pages
                for the jobs teams actually do — compare, chain, schedule, measure.
              </p>
            </div>
          </div>
        </section>

        <section id="stack" className="border-b border-white/10 scroll-mt-14">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
            <h2 className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-2">Stack</h2>
            <dl className="border-t border-white/10">
              {stack.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] gap-4 py-4 border-b border-white/10">
                  <dt className="font-mono text-xs text-neutral-500 pt-0.5">{k}</dt>
                  <dd className="text-sm text-neutral-200">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 font-mono text-xs text-neutral-600">
              No UI animation libraries. No component kits. Transitions are plain CSS.
            </p>
          </div>
        </section>

        <section id="license" className="scroll-mt-14">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
            <h2 className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-5">License & contact</h2>
            <p className="text-neutral-300 leading-relaxed max-w-2xl">
              MIT licensed. Fork it, self-host it, ship client work on it — no
              permission needed. Issues and pull requests are welcome on the repo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs">
              <a
                href="https://github.com/DivyashreeR008/Open-Agents"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/25 px-4 py-2.5 hover:border-white hover:bg-white/5 transition-colors"
              >
                <Github size={14} /> DivyashreeR008/Open-Agents
              </a>
              <a
                href="mailto:hello@openagents.dev"
                className="inline-flex items-center gap-2 border border-white/25 px-4 py-2.5 hover:border-white hover:bg-white/5 transition-colors"
              >
                <Mail size={14} /> hello@openagents.dev
              </a>
            </div>
            <p className="mt-14 font-mono text-[11px] text-neutral-600 uppercase tracking-widest">
              (c) {new Date().getFullYear()} OpenAgents — MIT
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}