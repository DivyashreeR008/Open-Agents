import { Bot, Cpu, Swords, Workflow, Lock, Folder } from 'lucide-react'
import { useAgents } from '../../lib/useAgents'

export default function AboutFeatures() {
  const { agents, catalogSize } = useAgents()
  const agentCount = agents.length || catalogSize
  const features = [
    {
      title: `${agentCount} Specialized AI Agents`,
      description:
        'Focused tools built for code reviews, SQL generation, blog optimization, resume screening, flashcard creation, and much more.',
      icon: Bot,
      color: 'bg-zinc-500/20 text-zinc-500',
    },
    {
      title: 'Multi-LLM Provider Support',
      description:
        'Switch directly between OpenAI (GPT-4o), Anthropic (Claude Sonnet), and Google (Gemini Flash) at runtime with zero setup.',
      icon: Cpu,
      color: 'bg-zinc-500/20 text-zinc-500',
    },
    {
      title: 'Battle Mode Arena',
      description:
        'Pit three AI models head-to-head on the exact same prompt, compare speed & response quality, and pick the winner.',
      icon: Swords,
      color: 'bg-zinc-500/20 text-zinc-500',
    },
    {
      title: 'AI Workflow Builder',
      description:
        'Chain multiple agents together sequentially where the output of one agent automatically becomes the prompt input for the next.',
      icon: Workflow,
      color: 'bg-zinc-500/20 text-zinc-500',
    },
    {
      title: '100% Client-Side Privacy (BYOK)',
      description:
        'Your API key never leaves your browser. Requests go directly from your client to the LLM provider — no middleman backend or database.',
      icon: Lock,
      color: 'bg-zinc-500/20 text-zinc-500',
    },
    {
      title: 'Suites & Custom Collections',
      description:
        'Group your favorite agents into personalized collections or answer quiz questions in the Suite Wizard to find the perfect tools.',
      icon: Folder,
      color: 'bg-zinc-500/20 text-zinc-500',
    },
  ]

  return (
    <section aria-labelledby="about-features-title" className="mb-12">
      <div className="text-center mb-8">
        <h2
          id="about-features-title"
          className="text-2xl sm:text-3xl font-bold dark:text-text-primary text-gray-900 tracking-tight mb-2"
        >
          Key Platform Capabilities
        </h2>
        <p className="text-sm dark:text-text-secondary text-gray-600 max-w-xl mx-auto">
          Everything you need to turn raw AI models into actionable, daily productivity superpowers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <div
              key={idx}
              className="panel p-5 transition-colors hover:border-zinc-400 dark:hover:border-zinc-400 duration-300 flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-12 h-12 bg-zinc-100 dark:bg-surface-input ${feature.color} flex items-center justify-center mb-4`}
                >
                  <Icon size={24} />
                </div>
                <h3 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm dark:text-text-secondary text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
