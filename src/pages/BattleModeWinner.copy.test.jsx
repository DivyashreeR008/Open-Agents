import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import BattleModeWinner from './BattleModeWinner'

const state = {
  provider: { label: 'Provider' },
  content: 'Winning output',
  duration: 1200,
  agentName: 'Agent',
}

function renderWinner() {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/battle/winner', state }]}>
      <Routes>
        <Route path="/battle/winner" element={<BattleModeWinner />} />
      </Routes>
    </MemoryRouter>
  )
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('BattleModeWinner copy', () => {
  it('copies through the clipboard and shows confirmation', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    renderWinner()
    fireEvent.click(screen.getByRole('button', { name: /Copy Winner Output/ }))
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('Winning output'))
    expect(screen.getByRole('button', { name: /Copied!/ })).toBeInTheDocument()
  })

  it('falls back to a temporary textarea when the clipboard rejects', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('blocked')) } })
    const execCommand = vi.fn(() => true)
    Object.defineProperty(document, 'execCommand', { value: execCommand, configurable: true })
    renderWinner()

    fireEvent.click(screen.getByRole('button', { name: /Copy Winner Output/ }))

    await waitFor(() => expect(execCommand).toHaveBeenCalledWith('copy'))
    expect(document.querySelector('textarea')).toBeNull()
    expect(screen.getByRole('button', { name: /Copied!/ })).toBeInTheDocument()
  })
})
