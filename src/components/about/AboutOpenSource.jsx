import {
  Code2,
  GitPullRequest,
  GitFork,
  CheckCircle2,
  Terminal,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react'

export default function AboutOpenSource() {
  const steps = [
    {
      step: '01',
      title: 'Fork & Clone',
      description:
        'Fork the repository on GitHub and clone your fork locally. Install dependencies using npm install.',
      command: 'git clone https://github.com/DivyashreeR008/Open-Agents.git',
    },
    {
      step: '02',
      title: 'Create Branch',
      description:
        'Always create a feature branch for your changes (e.g. agent/new-agent or fix/bug-name).',
      command: 'git checkout -b agent/my-new-agent',
    },
    {
      step: '03',
      title: 'Add Agent / Code',
      description:
        'Add a new agent definition in src/agents/definitions/. The registry automatically discovers and loads new agent definitions.',
      command: 'src/agents/definitions/my-new-agent.js',
    },
    {
      step: '04',
      title: 'Validate & Build',
      description:
        'Run local build check before opening a PR to ensure zero compilation or syntax issues.',
      command: 'npm run build',
    },
  ]

  return (
    <section aria-labelledby="about-opensource-title" className="mb-12 panel p-6 sm:p-10 ">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-6 border-b dark:border-border border-gray-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 text-xs font-semibold mb-2">
            <Code2 size={14} />
            <span>100% Open Source • MIT Licensed</span>
          </div>
          <h2
            id="about-opensource-title"
            className="text-2xl sm:text-3xl font-bold dark:text-text-primary text-gray-900 tracking-tight"
          >
            Open Source Philosophy & Contribution Workflow
          </h2>
        </div>
        <a
          href="https://github.com/DivyashreeR008/Open-Agents/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-8 px-3 text-xs font-bold text-white bg-zinc-500 hover:bg-zinc-400 transition-colors shrink-0"
        >
          <GitPullRequest size={15} />
          <span>Read Full Contributing Guide</span>
          <ExternalLink size={12} aria-hidden="true" />
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>

      <p className="text-sm dark:text-text-secondary text-gray-600 mb-8 leading-relaxed">
        OpenAgents is built by developers, designers, and AI enthusiasts around the world. Every
        line of code, agent prompt, and UI component is open to public inspection, contribution, and
        improvement. We maintain a zero-gatekeeping environment where even first-time open-source
        contributors can make a meaningful impact.
      </p>

      {/* Contribution Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {steps.map((item, i) => (
          <div key={i} className="panel p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-zinc-700 bg-zinc-500/10 dark:text-zinc-300 px-2.5 py-1 ">
                  Step {item.step}
                </span>
                <Terminal size={14} className="dark:text-text-muted text-gray-400" />
              </div>
              <h3 className="text-sm font-bold dark:text-text-primary text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-xs dark:text-text-secondary text-gray-600 leading-relaxed mb-3">
                {item.description}
              </p>
            </div>
            <code className="block text-[11px] font-mono dark:bg-black/40 bg-gray-100 dark:text-zinc-200 text-gray-800 p-2 truncate border dark:border-white/5 border-gray-200">
              {item.command}
            </code>
          </div>
        ))}
      </div>

      {/* Verification Rule Note */}
      <div className="flex items-start gap-3 p-4 dark:bg-zinc-500/10 bg-zinc-50 border dark:border-zinc-500/20 border-zinc-200 text-xs dark:text-zinc-300 text-zinc-900">
        <ShieldAlert size={18} className="shrink-0 mt-0.5" />
        <div>
          <strong>Important Requirement Before Opening PR:</strong> Always run{' '}
          <code className="font-mono bg-zinc-200/50 dark:bg-zinc-950/50 px-1 py-0.5 ">
            npm run build
          </code>{' '}
          locally to ensure there are no build errors. Clean, building code keeps the repository
          healthy for everyone!
        </div>
      </div>
    </section>
  )
}
