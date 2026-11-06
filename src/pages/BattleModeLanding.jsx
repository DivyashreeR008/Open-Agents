import { useNavigate } from 'react-router-dom'
import { Swords, Crosshair, PenLine, Cpu, Trophy, Bot } from 'lucide-react'
import BattleNavbar from '../components/BattleNavbar'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const steps = [
  { icon: Crosshair, text: 'Pick any agent', number: '01' },
  { icon: PenLine, text: 'Enter your input once', number: '02' },
  {
    icon: Cpu,
    text: 'GPT-4o vs Claude Sonnet vs Gemini Flash vs OpenRouter generate outputs',
    number: '03',
  },
  { icon: Trophy, text: 'You pick the winner', number: '04' },
]

const providers = [
  {
    name: 'GPT-4o',
    label: 'OpenAI',
    color: 'text-zinc-600 dark:text-zinc-400',
    border: 'border-zinc-300 dark:border-zinc-400/30',
    bg: 'bg-zinc-100 dark:bg-zinc-400/10',
  },
  {
    name: 'Claude',
    label: 'Anthropic',
    color: 'text-zinc-600 dark:text-zinc-400',
    border: 'border-zinc-300 dark:border-zinc-400/30',
    bg: 'bg-zinc-100 dark:bg-zinc-400/10',
  },
  {
    name: 'Gemini',
    label: 'Google',
    color: 'text-zinc-600 dark:text-zinc-400',
    border: 'border-zinc-300 dark:border-zinc-400/30',
    bg: 'bg-zinc-100 dark:bg-zinc-400/10',
  },
  {
    name: 'OpenRouter',
    label: 'Multi-model',
    color: 'text-zinc-600 dark:text-zinc-400',
    border: 'border-zinc-300 dark:border-zinc-400/30',
    bg: 'bg-zinc-100 dark:bg-zinc-400/10',
  },
]

export default function BattleModeLanding() {
  const navigate = useNavigate()
  useDocumentTitle('Battle Mode')

  return (
    <div className="min-h-screen battle-page-transition dark:bg-surface bg-gray-50 dark:text-text-primary text-gray-900">
      <main className="pt-12 pb-12 flex min-h-screen flex-col items-center px-4">
        {/* Hero */}
        <div className="text-center mb-14 battle-fade-in">
          <div className="w-16 h-16 bg-zinc-400/10 border border-zinc-400/30 flex items-center justify-center mx-auto mb-4 battle-glow-white hover:border-zinc-400/60 transition-all duration-300 cursor-default">
            <Swords size={32} className="text-zinc-600 dark:text-zinc-400" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-3 text-zinc-900 dark:text-white">
            Battle Mode
          </h1>
          <p className="text-base text-gray-700 dark:text-text-secondary max-w-md mx-auto leading-relaxed font-medium">
            Pit four AI providers against each other. Same prompt, four outputs, you decide who
            wins.
          </p>
        </div>

        {/* Provider Cards */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mb-14 w-full max-w-3xl flex-wrap">
          {/* GPT */}
          <div
            className={`flex-1 flex flex-col items-center gap-2 p-5 border
              ${providers[0].border} ${providers[0].bg} battle-slide-left`}
            style={{ animationDelay: '200ms' }}
          >
            <Bot size={28} className={providers[0].color} />
            <span className={`text-base font-bold ${providers[0].color}`}>{providers[0].name}</span>
            <span className="text-[10px] text-gray-700 dark:text-text-secondary uppercase tracking-widest">
              {providers[0].label}
            </span>
          </div>

          {/* VS */}
          <div
            className="flex flex-col items-center gap-1 battle-slide-center"
            style={{ animationDelay: '400ms' }}
          >
            <Swords size={22} className="text-zinc-600 dark:text-zinc-400" />
            <span className="text-xs font-extrabold text-zinc-600 dark:text-zinc-400 tracking-widest">
              VS
            </span>
          </div>

          {/* Claude */}
          <div
            className={`flex-1 flex flex-col items-center gap-2 p-5 border
              ${providers[1].border} ${providers[1].bg} battle-slide-center`}
            style={{ animationDelay: '300ms' }}
          >
            <Bot size={28} className={providers[1].color} />
            <span className={`text-sm font-bold ${providers[1].color}`}>{providers[1].name}</span>
            <span className="text-[10px] text-gray-700 dark:text-text-secondary uppercase tracking-widest">
              {providers[1].label}
            </span>
          </div>

          {/* VS */}
          <div
            className="flex flex-col items-center gap-1 battle-slide-center"
            style={{ animationDelay: '400ms' }}
          >
            <Swords size={22} className="text-zinc-600 dark:text-zinc-400" />
            <span className="text-xs font-extrabold text-zinc-600 dark:text-zinc-400 tracking-widest">
              VS
            </span>
          </div>

          {/* Gemini */}
          <div
            className={`flex-1 flex flex-col items-center gap-2 p-5 border
              ${providers[2].border} ${providers[2].bg} battle-slide-right`}
            style={{ animationDelay: '200ms' }}
          >
            <Bot size={28} className={providers[2].color} />
            <span className={`text-sm font-bold ${providers[2].color}`}>{providers[2].name}</span>
            <span className="text-[10px] text-gray-700 dark:text-text-secondary uppercase tracking-widest">
              {providers[2].label}
            </span>
          </div>

          {/* VS */}
          <div
            className="flex flex-col items-center gap-1 battle-slide-center"
            style={{ animationDelay: '400ms' }}
          >
            <Swords size={22} className="text-zinc-600 dark:text-zinc-400" />
            <span className="text-xs font-extrabold text-zinc-600 dark:text-zinc-400 tracking-widest">
              VS
            </span>
          </div>

          {/* OpenRouter */}
          <div
            className={`flex-1 flex flex-col items-center gap-2 p-5 border
              ${providers[3].border} ${providers[3].bg} battle-slide-right`}
            style={{ animationDelay: '200ms' }}
          >
            <Bot size={28} className={providers[3].color} />
            <span className={`text-sm font-bold ${providers[3].color}`}>{providers[3].name}</span>
            <span className="text-[10px] text-gray-700 dark:text-text-secondary uppercase tracking-widest">
              {providers[3].label}
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="w-full max-w-2xl space-y-3 mb-14">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-5 border dark:border-border border-gray-200 bg-white dark:bg-surface battle-step-in hover:border-zinc-400/60 dark:hover:border-zinc-400/60 transition-all duration-200 hover:translate-x-1 cursor-default"
                style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              >
                <div className="w-14 h-14 bg-zinc-400/10 flex items-center justify-center flex-shrink-0 border border-zinc-400/20">
                  <span className="text-base sm:text-lg font-bold text-zinc-600 dark:text-zinc-400">
                    {step.number}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-text-secondary">
                    Step {idx + 1}
                  </span>
                  <p className="text-base sm:text-lg font-semibold text-gray-700 dark:text-text-secondary mt-0.5">
                    {step.text}
                  </p>
                </div>
                <Icon size={18} className="text-gray-700 dark:text-text-secondary flex-shrink-0" />
              </div>
            )
          })}
        </div>

        {/* Start Button */}
        <button
          onClick={() => navigate('/battle/setup')}
          className="flex items-center gap-2.5 px-8 py-4 text-base font-bold bg-zinc-500 text-white hover:bg-zinc-400 transition-colors duration-200 battle-fade-in border border-zinc-400/20 hover:border-zinc-300/40 shadow-panel "
          style={{ animationDelay: '600ms' }}
        >
          <Swords size={18} className="text-zinc-600 dark:text-zinc-400" />
          Start Battle
        </button>
      </main>
    </div>
  )
}
