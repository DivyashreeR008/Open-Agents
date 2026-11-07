import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorCard from './ErrorCard'

describe('ErrorCard connectivity detection', () => {
  it('treats capitalized connection failures as warnings', () => {
    render(<ErrorCard message="Connection reset by peer" />)

    expect(screen.getByRole('heading', { level: 4, name: 'Warning' })).toBeInTheDocument()
  })

  it('treats capitalized reachability failures as warnings', () => {
    render(<ErrorCard message="Host is Unreachable" />)

    expect(screen.getByRole('heading', { level: 4, name: 'Warning' })).toBeInTheDocument()
  })
})
