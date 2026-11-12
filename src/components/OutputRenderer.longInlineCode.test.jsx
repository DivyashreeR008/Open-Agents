import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import OutputRenderer from './OutputRenderer'

describe('OutputRenderer long inline code', () => {
  it('keeps a long inline code span out of the fenced code regions', () => {
    const longValue = 'a'.repeat(90)
    render(
      <OutputRenderer
        content={`Use \`${longValue}\` inside the sentence.`}
        outputType="markdown"
        agentName="t"
      />
    )

    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(screen.getByText(longValue)).toBeInTheDocument()
  })
})
