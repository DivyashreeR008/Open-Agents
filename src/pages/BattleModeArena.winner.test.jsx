import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

vi.mock('../lib/llmAdapter', () => ({ runAgent: vi.fn() }))
vi.mock('../lib/useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import { runAgent } from '../lib/llmAdapter'
import BattleModeArena from './BattleModeArena'

const agent = {
  id: 'debate-agent',
  name: 'Debate Agent',
  category: 'Research',
  outputType: 'text',
  systemPrompt: 'Argue carefully.',
  inputs: [{ id: 'topic', label: 'Topic' }],
}

const apiKeys = { openai: 'sk-o', anthropic: 'sk-a', gemini: 'sk-g', openrouter: 'sk-r' }

function WinnerMarker() {
  const { state } = useLocation()
  return (
    <div>
      <div>Winner page</div>
      <div>{state?.provider?.id}</div>
      <div>{state?.content}</div>
      <div>{String(state?.duration)}</div>
      <div>{state?.agentName}</div>
    </div>
  )
}

function renderArena(state = { agent, inputs: { topic: 'AI safety' }, apiKeys }) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/battle/arena', state }]}>
      <Routes>
        <Route path="/battle/arena" element={<BattleModeArena />} />
        <Route path="/battle/setup" element={<div>Battle setup</div>} />
        <Route path="/battle/winner" element={<WinnerMarker />} />
      </Routes>
    </MemoryRouter>
  )
}

function deferredRun() {
  const pending = []
  runAgent.mockImplementation(({ provider }) => {
    let resolve
    let reject
    const promise = new Promise((res, rej) => {
      resolve = res
      reject = rej
    })
    pending.push({ provider, resolve, reject })
    return promise
  })
  return pending
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('BattleModeArena winner handoff and failures', () => {
  it('redirects a direct visit without battle state to setup', async () => {
    renderArena(null)
    expect(await screen.findByText('Battle setup')).toBeInTheDocument()
  })

  it('passes the selected provider content and agent name to the winner route', async () => {
    const pending = deferredRun()
    renderArena()
    await waitFor(() => expect(pending).toHaveLength(4))
    await act(async () => {
      for (const call of pending) {
        call.resolve({
          content: `${call.provider} answer`,
          duration: call.provider === 'anthropic' ? 2300 : 1000,
        })
      }
    })

    const claudePane = await screen.findByRole('region', { name: 'Claude Sonnet' })
    fireEvent.click(within(claudePane).getByRole('button', { name: 'Pick Winner' }))
    expect(await screen.findByText('Winner page')).toBeInTheDocument()
    expect(screen.getByText('anthropic')).toBeInTheDocument()
    expect(screen.getByText('anthropic answer')).toBeInTheDocument()
    expect(screen.getByText('2300')).toBeInTheDocument()
    expect(screen.getByText('Debate Agent')).toBeInTheDocument()
  })

  it('shows friendly timeout and provider error copy without winner actions', async () => {
    const pending = deferredRun()
    renderArena()
    await waitFor(() => expect(pending).toHaveLength(4))
    const abort = Object.assign(new Error('aborted'), { name: 'AbortError' })
    await act(async () => {
      pending
        .find((c) => c.provider === 'openai')
        .resolve({ content: 'OpenAI answer', duration: 1000 })
      pending.find((c) => c.provider === 'anthropic').reject(abort)
      pending.find((c) => c.provider === 'gemini').reject(new Error('Gemini quota exhausted'))
      pending
        .find((c) => c.provider === 'openrouter')
        .resolve({ content: 'Router answer', duration: 1400 })
    })

    expect(
      await screen.findByText(
        'Request timed out - the LLM took too long to respond. Please try again.'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('Gemini quota exhausted')).toBeInTheDocument()
    const claudePane = screen.getByRole('region', { name: 'Claude Sonnet' })
    const geminiPane = screen.getByRole('region', { name: 'Gemini Flash' })
    expect(
      within(claudePane).queryByRole('button', { name: 'Pick Winner' })
    ).not.toBeInTheDocument()
    expect(
      within(geminiPane).queryByRole('button', { name: 'Pick Winner' })
    ).not.toBeInTheDocument()
    expect(
      within(screen.getByRole('region', { name: 'GPT-4o' })).getByRole('button', {
        name: 'Pick Winner',
      })
    ).toBeInTheDocument()
  })

  it('renders markdown answers as formatting and text answers as preformatted text', async () => {
    const markdownRun = deferredRun()
    const markdownPage = renderArena({
      agent: { ...agent, outputType: 'markdown' },
      inputs: { topic: 'AI safety' },
      apiKeys,
    })
    await waitFor(() => expect(markdownRun).toHaveLength(4))
    await act(async () => {
      for (const call of markdownRun) {
        call.resolve({ content: '**Bold answer**', duration: 1000 })
      }
    })
    const bold = await screen.findAllByText('Bold answer')
    expect(bold).toHaveLength(4)
    expect(bold[0].tagName).toBe('STRONG')
    markdownPage.unmount()

    const textRun = deferredRun()
    renderArena({ agent, inputs: { topic: 'AI safety' }, apiKeys })
    await waitFor(() => expect(textRun).toHaveLength(4))
    await act(async () => {
      for (const call of textRun) {
        call.resolve({ content: 'Plain answer', duration: 1000 })
      }
    })
    const plain = await screen.findAllByText('Plain answer')
    expect(plain).toHaveLength(4)
    expect(plain[0].tagName).toBe('PRE')
  })
})
