import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

describe('ErrorBoundary non-Error throws', () => {
  let consoleError

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => consoleError.mockRestore())

  it('renders a thrown string as the diagnostic', () => {
    function StringThrower() {
      throw 'plain text failure'
    }

    render(
      <ErrorBoundary>
        <StringThrower />
      </ErrorBoundary>
    )

    expect(screen.getByText('plain text failure')).toBeInTheDocument()
  })

  it('renders the generic diagnostic for a null throw', () => {
    function NullThrower() {
      throw null
    }

    render(
      <ErrorBoundary>
        <NullThrower />
      </ErrorBoundary>
    )

    expect(screen.getByText('Unknown error')).toBeInTheDocument()
  })
})
