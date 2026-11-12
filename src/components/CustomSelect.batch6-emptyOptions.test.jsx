import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CustomSelect from './CustomSelect'

describe('CustomSelect with no options', () => {
  it('opens an empty listbox and leaves the trigger usable', () => {
    render(<CustomSelect value="" onChange={() => {}} options={[]} label="Empty picker" />)

    const trigger = screen.getByRole('button', { name: 'Empty picker' })
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox', { name: 'Empty picker' })).toBeInTheDocument()
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })
})
