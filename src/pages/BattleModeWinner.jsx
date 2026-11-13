import { useEffect } from 'react'
import { useTimedState } from '../lib/useTimedState'
import { useNavigate, useLocation } from 'react-router-dom'
import { Trophy, Copy, Check, RotateCcw, ArrowLeft } from 'lucide-react'
import BattleNavbar from '../components/BattleNavbar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Single monochrome theme — winner is never color-coded by provider.
const winnerTheme = {
  bg: 'bg-zinc-400/10',
  border: 'border-zinc-400/30',
  text: 'text-zinc-400',
  hoverBorder: 'hover:border-zinc-400/60',
  shadow: '',
  lightBg: 'bg-zinc-400/5',
}

export default function BattleModeWinner() {
  const navigate = useNavigate()
  const location = useLocation()
  const { provider, content, duration, agentName } = location.state || {}
  const [copied, setCopied] = useTimedState(false)
  useDocumentTitle(agentName ? `${agentName} Battle Winner` : 'Battle Winner')

  useEffect(() => {
    if (!provider || !content) {
      navigate('/battle', { replace: true })
    }
  }, [provider, content, navigate])

  if (!provider || !content) {
    return null
  }

  const colors = winnerTheme

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true, 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = content
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true, 2000)
    }
  }

  return (
    <div className="min-h-screen dark:bg-surface bg-gray-50 text-white battle-page-transition">
      <main className="pt-14 max-w-3xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12 battle-fade-in">
          <div
            className={`w-24 h-24 ${colors.bg} border ${colors.border}
            flex items-center justify-center mx-auto mb-8
            ${colors.hoverBorder} ${colors.shadow}
            transition-colors duration-300 cursor-default`}
          >
            <Trophy size={52} className={`${colors.text}`} />
          </div>
          <h1
            className={`text-5xl font-extrabold tracking-wider mb-3
            text-zinc-900 dark:text-white`}
          >
            Winner
          </h1>
          <p className={`text-lg font-bold mb-1 ${colors.text}`}>{provider.label}</p>
          <p className="text-xs dark:text-text-muted text-gray-500 font-medium">
            {agentName && `Agent: ${agentName}`}
            {duration && ` \u00B7 ${(duration / 1000).toFixed(1)}s`}
          </p>
        </div>

        {/* Winning Output */}
        <div
          className={` border ${colors.border} ${colors.lightBg} p-6 mb-10 battle-fade-in
          hover:border-opacity-60 transition-colors duration-300`}
          style={{ animationDelay: '150ms' }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest dark:text-text-muted text-gray-500">
              Winning Output
            </span>
          </div>
          <div className="markdown-output text-sm dark:text-text-primary text-gray-900 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 battle-fade-in"
          style={{ animationDelay: '250ms' }}
        >
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold dark:bg-surface-input bg-gray-50 border border-gray-700/60 dark:text-text-primary text-gray-900 hover:bg-gray-900/80 hover:border-gray-600 transition-colors duration-200 battle-btn-secondary"
          >
            {copied ? <Check size={16} className="text-zinc-400" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Winner Output'}
          </button>

          <button
            onClick={() => navigate('/battle/setup')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold dark:bg-surface-input bg-gray-50 border border-gray-700/60 dark:text-text-primary text-gray-900 hover:bg-gray-900/80 hover:border-gray-600 transition-colors duration-200 battle-btn-secondary"
          >
            <RotateCcw size={16} />
            Run Battle Again
          </button>

          <button
            onClick={() => navigate('/agents')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold dark:bg-surface-input bg-gray-50 border border-gray-700/60 dark:text-text-primary text-gray-900 hover:bg-gray-900/80 hover:border-gray-600 transition-colors duration-200 battle-btn-secondary"
          >
            <ArrowLeft size={16} />
            Back to Agents
          </button>
        </div>
      </main>
    </div>
  )
}
