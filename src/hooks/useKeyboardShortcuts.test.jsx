import { describe, it, expect, vi, afterEach } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'
import KeyboardShortcutsModal from '../components/KeyboardShortcutsModal'

function Harness({ shortcuts }) {
  useKeyboardShortcuts(shortcuts)
  return (
    <div>
      <input aria-label="field" />
      <textarea aria-label="prompt" />
      <button>btn</button>
    </div>
  )
}

afterEach(cleanup)

describe('useKeyboardShortcuts', () => {
  it('fires a single-key binding from the page body', () => {
    const slash = vi.fn()
    render(<Harness shortcuts={{ '/': slash }} />)
    fireEvent.keyDown(document.body, { key: '/' })
    expect(slash).toHaveBeenCalledTimes(1)
  })

  it('passes the keyboard event so handlers can preventDefault', () => {
    const slash = vi.fn((e) => e.preventDefault())
    render(<Harness shortcuts={{ '/': slash }} />)
    const notCancelled = fireEvent.keyDown(document.body, { key: '/' })
    expect(notCancelled).toBe(false)
  })

  it('does not fire single-key bindings while typing in an input or textarea', () => {
    const slash = vi.fn()
    const help = vi.fn()
    render(<Harness shortcuts={{ '/': slash, '?': help }} />)
    fireEvent.keyDown(screen.getByLabelText('field'), { key: '/' })
    fireEvent.keyDown(screen.getByLabelText('prompt'), { key: '?' })
    expect(slash).not.toHaveBeenCalled()
    expect(help).not.toHaveBeenCalled()
  })

  it('still fires single-key bindings when a non-text element has focus', () => {
    const help = vi.fn()
    render(<Harness shortcuts={{ '?': help }} />)
    fireEvent.keyDown(screen.getByRole('button'), { key: '?' })
    expect(help).toHaveBeenCalledTimes(1)
  })

  it('fires Control+Enter, including from inside a textarea', () => {
    const run = vi.fn()
    render(<Harness shortcuts={{ 'Control+Enter': run }} />)
    fireEvent.keyDown(screen.getByLabelText('prompt'), { key: 'Enter', ctrlKey: true })
    expect(run).toHaveBeenCalledTimes(1)
  })

  it('treats Cmd (metaKey) the same as Control', () => {
    const run = vi.fn()
    render(<Harness shortcuts={{ 'Control+Enter': run }} />)
    fireEvent.keyDown(document.body, { key: 'Enter', metaKey: true })
    expect(run).toHaveBeenCalledTimes(1)
  })

  it('does not fire Control+Enter for a plain Enter', () => {
    const run = vi.fn()
    render(<Harness shortcuts={{ 'Control+Enter': run }} />)
    fireEvent.keyDown(document.body, { key: 'Enter' })
    expect(run).not.toHaveBeenCalled()
  })

  it('fires Alt+digit bindings and only the matching one', () => {
    const one = vi.fn()
    const two = vi.fn()
    render(<Harness shortcuts={{ 'Alt+1': one, 'Alt+2': two }} />)
    fireEvent.keyDown(document.body, { key: '2', altKey: true })
    expect(one).not.toHaveBeenCalled()
    expect(two).toHaveBeenCalledTimes(1)
  })

  it('does not fire Alt+digit for the bare digit or with extra modifiers', () => {
    const one = vi.fn()
    render(<Harness shortcuts={{ 'Alt+1': one }} />)
    fireEvent.keyDown(document.body, { key: '1' })
    fireEvent.keyDown(document.body, { key: '1', altKey: true, shiftKey: true })
    fireEvent.keyDown(document.body, { key: '1', altKey: true, ctrlKey: true })
    expect(one).not.toHaveBeenCalled()
  })

  it('builds modifier order as Control, Alt, Shift and names the space bar', () => {
    const combo = vi.fn()
    const space = vi.fn()
    render(<Harness shortcuts={{ 'Control+Alt+Shift+k': combo, 'Control+Space': space }} />)
    fireEvent.keyDown(document.body, { key: 'k', ctrlKey: true, altKey: true, shiftKey: true })
    fireEvent.keyDown(document.body, { key: ' ', ctrlKey: true })
    expect(combo).toHaveBeenCalledTimes(1)
    expect(space).toHaveBeenCalledTimes(1)
  })

  it('does not fire a combo binding when only its modifier is pressed', () => {
    const run = vi.fn()
    render(<Harness shortcuts={{ 'Control+Enter': run, 'Alt+1': run }} />)
    fireEvent.keyDown(document.body, { key: 'Control', ctrlKey: true })
    fireEvent.keyDown(document.body, { key: 'Alt', altKey: true })
    expect(run).not.toHaveBeenCalled()
  })

  it('still fires Escape from inside a text field', () => {
    const esc = vi.fn()
    render(<Harness shortcuts={{ Escape: esc }} />)
    fireEvent.keyDown(screen.getByLabelText('prompt'), { key: 'Escape' })
    expect(esc).toHaveBeenCalledTimes(1)
  })

  it('fires Escape and leaves unbound keys alone', () => {
    const esc = vi.fn()
    render(<Harness shortcuts={{ Escape: esc }} />)
    const unbound = fireEvent.keyDown(document.body, { key: 'a' })
    fireEvent.keyDown(document.body, { key: 'Escape' })
    expect(esc).toHaveBeenCalledTimes(1)
    expect(unbound).toBe(true)
  })

  it('leaves browser-reserved combinations (Ctrl+T, Ctrl+W, Ctrl+R, Ctrl+L) untouched', () => {
    const shortcuts = {
      'Control+Enter': vi.fn(),
      Escape: vi.fn(),
      '/': vi.fn(),
      '?': vi.fn(),
      'Alt+1': vi.fn(),
    }
    render(<Harness shortcuts={shortcuts} />)
    for (const key of ['t', 'w', 'r', 'l']) {
      const notCancelled = fireEvent.keyDown(document.body, { key, ctrlKey: true })
      expect(notCancelled).toBe(true)
    }
    Object.values(shortcuts).forEach((fn) => expect(fn).not.toHaveBeenCalled())
  })

  it('removes the listener on unmount', () => {
    const slash = vi.fn()
    const { unmount } = render(<Harness shortcuts={{ '/': slash }} />)
    unmount()
    fireEvent.keyDown(document.body, { key: '/' })
    expect(slash).not.toHaveBeenCalled()
  })

  it('uses the latest bindings after a re-render', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { rerender } = render(<Harness shortcuts={{ '/': first }} />)
    rerender(<Harness shortcuts={{ '/': second }} />)
    fireEvent.keyDown(document.body, { key: '/' })
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })
})

describe('KeyboardShortcutsModal help listing', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<KeyboardShortcutsModal isOpen={false} onClose={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('lists the documented shortcuts when open', () => {
    render(<KeyboardShortcutsModal isOpen onClose={() => {}} />)
    for (const key of ['Ctrl + Enter', '/', 'Esc', 'Alt + 1 / 2 / 3', '?']) {
      expect(screen.getByText(key)).toBeInTheDocument()
    }
  })

  it('calls onClose from the close button', () => {
    const onClose = vi.fn()
    render(<KeyboardShortcutsModal isOpen onClose={onClose} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
