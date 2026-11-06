import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ApiKeyBar from '../components/ApiKeyBar'
import PromptHistoryPanel from '../components/PromptHistoryPanel'
import ScheduleAgentModal from '../components/ScheduleAgentModal'
import SettingsPage from '../pages/SettingsPage'

// Placeholder text is not a name: it disappears as soon as the user types and many screen
// readers skip it. A control has to be named by aria-label, aria-labelledby or a <label>.
function accessibleName(el) {
  const label = el.getAttribute('aria-label')?.trim()
  if (label) return label
  const by = el.getAttribute('aria-labelledby')
  if (by) {
    return by
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent ?? '')
      .join(' ')
      .trim()
  }
  return Array.from(el.labels ?? [])
    .map((node) => node.textContent)
    .join(' ')
    .trim()
}

function unnamedControls(container) {
  return Array.from(container.querySelectorAll('input, select, textarea'))
    .filter((el) => el.type !== 'hidden')
    .filter((el) => !accessibleName(el))
}

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) return entry === 'test' ? [] : sourceFiles(path)
    return /\.jsx$/.test(entry) && !/\.test\./.test(entry) ? [path] : []
  })
}

// The opening tag of each <input>, <select> and <textarea>, with nested {...} expressions kept whole.
function controlTags(source) {
  const tags = []
  const start = /<(input|select|textarea)(?=[\s/>])/g
  let match
  while ((match = start.exec(source))) {
    let depth = 0
    let i = match.index + match[0].length
    for (; i < source.length; i += 1) {
      const ch = source[i]
      if (ch === '{') depth += 1
      else if (ch === '}') depth -= 1
      else if (ch === '>' && depth === 0) break
    }
    tags.push({ index: match.index, text: source.slice(match.index, i + 1), tag: match[1] })
  }
  return tags
}

describe('form controls have a programmatic name', () => {
  it('names every input, select and textarea in the source', () => {
    const offenders = []
    for (const file of sourceFiles('src')) {
      const source = readFileSync(file, 'utf8')
      const forIds = new Set(
        [...source.matchAll(/htmlFor=(?:"([^"]+)"|\{([^}]+)\})/g)].map((m) => m[1] ?? m[2])
      )
      for (const { index, text, tag } of controlTags(source)) {
        if (/type=["']hidden["']/.test(text)) continue
        const named = /aria-label(?:ledby)?=/.test(text)
        const id = /\bid=(?:"([^"]+)"|\{([^}]+)\})/.exec(text)
        const labelled = Boolean(id && forIds.has(id[1] ?? id[2]))
        const before = source.slice(Math.max(0, index - 400), index)
        const wrapped = before.lastIndexOf('<label') > before.lastIndexOf('</label>')
        if (!named && !labelled && !wrapped) {
          const line = source.slice(0, index).split('\n').length
          offenders.push(`${file.replaceAll('\\', '/')}:${line} <${tag}>`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it('has a name on the API key bar controls, not just a placeholder', () => {
    const { container } = render(
      <MemoryRouter>
        <ApiKeyBar
          provider="openai"
          setProvider={vi.fn()}
          apiKey=""
          setApiKey={vi.fn()}
          saveForSession={false}
          setSaveForSession={vi.fn()}
          agentProvider="any"
          model="gpt-4o"
          setModel={vi.fn()}
        />
      </MemoryRouter>
    )
    expect(unnamedControls(container)).toHaveLength(0)
    expect(screen.getByLabelText('API key')).toBeInTheDocument()
    // the provider and model pickers say what they are, not only what they currently hold
    expect(screen.getByRole('button', { name: 'Provider' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Model' })).toBeInTheDocument()
  })

  it('keeps the name after the user types', () => {
    render(
      <MemoryRouter>
        <ApiKeyBar
          provider="openai"
          setProvider={vi.fn()}
          apiKey="sk-typed-value"
          setApiKey={vi.fn()}
          saveForSession={false}
          setSaveForSession={vi.fn()}
          agentProvider="any"
          model="gpt-4o"
          setModel={vi.fn()}
        />
      </MemoryRouter>
    )
    const field = screen.getByLabelText('API key')
    expect(field).toHaveValue('sk-typed-value')
    expect(accessibleName(field)).toBe('API key')
  })

  it('names the prompt history search', () => {
    const { container } = render(
      <PromptHistoryPanel open onClose={vi.fn()} onUsePrompt={vi.fn()} />
    )
    expect(unnamedControls(container)).toHaveLength(0)
    expect(screen.getByLabelText('Search prompts')).toBeInTheDocument()
  })

  it('names every field of the schedule modal', () => {
    const { container } = render(
      <ScheduleAgentModal
        agent={{ id: 'a', name: 'Test Agent' }}
        inputs={{}}
        provider="openai"
        apiKey=""
        onSchedule={vi.fn()}
        onClose={vi.fn()}
      />
    )
    expect(unnamedControls(container)).toHaveLength(0)
    expect(screen.getByLabelText('Schedule name')).toBeInTheDocument()
    expect(screen.getByLabelText('Provider API key')).toBeInTheDocument()
  })

  it('names the provider key fields and the default provider on the settings page', () => {
    const { container } = render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    )
    expect(unnamedControls(container)).toHaveLength(0)
    expect(screen.getByLabelText('OpenAI API key')).toBeInTheDocument()
  })
})
