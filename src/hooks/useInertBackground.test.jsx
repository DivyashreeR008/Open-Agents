import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useInertBackground } from './useInertBackground'

function Harness({ active = true }) {
  const panelRef = useRef(null)
  useInertBackground(panelRef, active)

  return (
    <div>
      <button type="button">Page action</button>
      <div>
        <button type="button" aria-hidden="true">
          Decorative
        </button>
        <section ref={panelRef} aria-label="Dialog panel">
          <button type="button">Dialog action</button>
        </section>
      </div>
    </div>
  )
}

describe('useInertBackground', () => {
  it('inerts every background sibling at every level while the panel is active', () => {
    render(<Harness />)

    const pageAction = screen.getByText('Page action').closest('button')
    const decorative = screen.getByText('Decorative').closest('button')
    const panel = screen.getByRole('region', { name: 'Dialog panel' })

    expect(pageAction).toHaveAttribute('inert')
    expect(pageAction).toHaveAttribute('aria-hidden', 'true')
    expect(decorative).toHaveAttribute('inert')
    expect(decorative).toHaveAttribute('aria-hidden', 'true')
    expect(panel).not.toHaveAttribute('inert')
    expect(screen.getByRole('button', { name: 'Dialog action' })).not.toHaveAttribute('inert')
  })

  it('restores removed state and leaves pre-existing aria-hidden values alone', () => {
    const { unmount } = render(<Harness />)
    const pageAction = screen.getByText('Page action').closest('button')
    const decorative = screen.getByText('Decorative').closest('button')

    unmount()

    expect(pageAction).not.toHaveAttribute('inert')
    expect(pageAction).not.toHaveAttribute('aria-hidden')
    expect(decorative).not.toHaveAttribute('inert')
    expect(decorative).toHaveAttribute('aria-hidden', 'true')
  })

  it('does nothing when the panel is not active', () => {
    render(<Harness active={false} />)

    expect(screen.getByText('Page action').closest('button')).not.toHaveAttribute('inert')
    expect(screen.getByText('Decorative').closest('button')).not.toHaveAttribute('inert')
  })
})

function PortalHarness({ onBackdrop }) {
  const panelRef = useRef(null)
  useInertBackground(panelRef)

  return (
    <div>
      <button type="button">Page action</button>
      <div>
        <div aria-hidden="true" onClick={onBackdrop}>
          Backdrop
        </div>
        <section ref={panelRef} aria-label="Dialog panel">
          <button type="button">Dialog action</button>
        </section>
      </div>
    </div>
  )
}

describe('useInertBackground and dialog backdrops', () => {
  it('leaves an already hidden, non-interactive backdrop clickable', () => {
    const onBackdrop = vi.fn()
    render(<PortalHarness onBackdrop={onBackdrop} />)

    const backdrop = screen.getByText('Backdrop')
    expect(backdrop).not.toHaveAttribute('inert')
    expect(backdrop).toHaveAttribute('aria-hidden', 'true')

    fireEvent.click(backdrop)
    expect(onBackdrop).toHaveBeenCalledTimes(1)
  })
})
