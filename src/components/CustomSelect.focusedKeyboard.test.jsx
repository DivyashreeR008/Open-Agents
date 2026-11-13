import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CustomSelect from './CustomSelect'

const options = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'gemini', label: 'Gemini' },
]

describe('CustomSelect focused keyboard interactions', () => {
  it('commits the highlighted option when Enter is received by the open trigger', () => {
    const onChange = vi.fn()
    render(<CustomSelect value="" onChange={onChange} options={options} label="Provider" />)

    const trigger = screen.getByRole('button', { name: 'Provider' })
    fireEvent.click(trigger)
    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'Enter' })

    expect(onChange).toHaveBeenCalledWith('openai')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('commits the highlighted option when Space is received by the open trigger', () => {
    const onChange = vi.fn()
    render(<CustomSelect value="" onChange={onChange} options={options} label="Provider" />)

    const trigger = screen.getByRole('button', { name: 'Provider' })
    fireEvent.click(trigger)
    trigger.focus()
    fireEvent.keyDown(trigger, { key: ' ' })

    expect(onChange).toHaveBeenCalledWith('openai')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('wraps highlight navigation in both directions', () => {
    render(<CustomSelect value="openai" onChange={vi.fn()} options={options} label="Provider" />)

    const trigger = screen.getByRole('button', { name: 'Provider' })
    fireEvent.click(trigger)
    trigger.focus()

    fireEvent.keyDown(trigger, { key: 'ArrowUp' })
    expect(screen.getAllByRole('option')[2]).toHaveFocus()

    fireEvent.keyDown(screen.getAllByRole('option')[2], { key: 'ArrowDown' })
    expect(screen.getAllByRole('option')[0]).toHaveFocus()

    fireEvent.keyDown(screen.getAllByRole('option')[0], { key: 'ArrowUp' })
    expect(screen.getAllByRole('option')[2]).toHaveFocus()
  })

  it('explains an empty option state instead of showing a blank list', () => {
    render(<CustomSelect value="" onChange={vi.fn()} options={[]} label="Provider" />)

    fireEvent.click(screen.getByRole('button', { name: 'Provider' }))

    expect(screen.getByRole('listbox', { name: 'Provider' })).toHaveTextContent(
      'No options available'
    )
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })
})
