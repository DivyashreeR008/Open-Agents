import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OutputMarkdown from './OutputMarkdown'
import OutputRenderer from './OutputRenderer'
import { expectNoA11yViolations } from '../test/a11y'

const address = 'https://images.example/pixel.png?reader=private'
const markdown = `![A useful diagram](${address} "Diagram title")`

describe('explicit output image consent', () => {
  it('shows the entire destination and description without mounting an image', () => {
    const { container } = render(<OutputMarkdown>{markdown}</OutputMarkdown>)
    expect(screen.getByText(address)).toBeInTheDocument()
    expect(screen.getByText('A useful diagram')).toBeInTheDocument()
    expect(container.querySelector('img, iframe, video, source, link')).toBeNull()
    expect(screen.getByRole('button', { name: 'Load image from images.example' })).toBeEnabled()
  })

  it('supports keyboard consent, no referrer, and accessible blocked/loaded states', async () => {
    const { container } = render(<OutputMarkdown>{markdown}</OutputMarkdown>)
    await expectNoA11yViolations(container)
    const user = userEvent.setup()
    await user.tab()
    expect(screen.getByRole('button')).toHaveFocus()
    await user.keyboard('{Enter}')
    const image = screen.getByRole('img', { name: 'A useful diagram' })
    expect(image).toHaveAttribute('src', address)
    expect(image).toHaveAttribute('referrerpolicy', 'no-referrer')
    expect(image).toHaveAttribute('title', 'Diagram title')
    await expectNoA11yViolations(container)
  })

  it('retains consent for the same output but resets on A to B to A and reopening', () => {
    const { rerender, unmount } = render(<OutputMarkdown>{markdown}</OutputMarkdown>)
    fireEvent.click(screen.getByRole('button'))
    rerender(<OutputMarkdown>{markdown}</OutputMarkdown>)
    expect(screen.getByRole('img')).toBeInTheDocument()
    rerender(<OutputMarkdown>{`Other text\n\n${markdown}`}</OutputMarkdown>)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    rerender(<OutputMarkdown>{markdown}</OutputMarkdown>)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button'))
    unmount()
    render(<OutputMarkdown>{markdown}</OutputMarkdown>)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('requires a separate action for each image and each failed retry', () => {
    render(
      <OutputMarkdown>{`${markdown}\n\n![Another](https://other.example/image)`}</OutputMarkdown>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Load image from images.example' }))
    expect(screen.getAllByRole('img')).toHaveLength(1)
    fireEvent.error(screen.getByRole('img'))
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Image could not be loaded.')
    fireEvent.click(screen.getByRole('button', { name: 'Retry image from images.example' }))
    expect(screen.getAllByRole('img')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Load image from other.example' })).toBeEnabled()
  })

  it.each([
    'javascript:alert(1)',
    'data:image/png;base64,abc',
    'blob:https://x/y',
    'https://user:password@example.com/x',
  ])('keeps %s inert', (url) => {
    const { container } = render(<OutputMarkdown>{`![Untrusted](<${url}>)`}</OutputMarkdown>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByText(/Unsupported image address/)).toBeInTheDocument()
  })

  it.each(['/relative.png', '//images.example/a.png', 'http://images.example/a.png'])(
    'previews the canonical address before allowing %s',
    (url) => {
      render(<OutputMarkdown>{`![Relative](${url})`}</OutputMarkdown>)
      const resolved = new URL(url, window.location.href).href
      expect(screen.getByText(resolved)).toBeInTheDocument()
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
      fireEvent.click(screen.getByRole('button'))
      expect(screen.getByRole('img')).toHaveAttribute('src', resolved)
    }
  )

  it('does not follow a surrounding image link when consent is clicked', async () => {
    const { container } = render(
      <OutputMarkdown>{`[${markdown}](https://unrelated.example/)`}</OutputMarkdown>
    )
    await expectNoA11yViolations(container)
    expect(fireEvent.click(screen.getByRole('button'))).toBe(false)
    expect(screen.getByRole('img')).toHaveAttribute('src', address)
  })

  it('preserves tables, links and custom code while dropping raw HTML', () => {
    const { container } = render(
      <OutputMarkdown
        components={{ code: ({ children }) => <code data-testid="code">{children}</code> }}
      >
        {
          '| Heading |\n| --- |\n| Value |\n\n[Safe](https://example.com) `sample`\n\n<img src="https://tracker.example/x" />\n\n[Bad](javascript:alert%281%29)'
        }
      </OutputMarkdown>
    )
    expect(screen.getByRole('table')).toHaveTextContent('Value')
    expect(screen.getByRole('link', { name: 'Safe' })).toHaveAttribute(
      'href',
      'https://example.com'
    )
    expect(screen.getByTestId('code')).toHaveTextContent('sample')
    expect(container.querySelector('img, [href^="javascript:"]')).toBeNull()
  })

  it('protects the normal output renderer without changing plain output', () => {
    const { rerender } = render(<OutputRenderer content={markdown} outputType="markdown" />)
    expect(screen.getByRole('button', { name: 'Load image from images.example' })).toBeEnabled()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    rerender(<OutputRenderer content={markdown} outputType="text" />)
    expect(screen.getByText(markdown)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Load image/ })).not.toBeInTheDocument()
  })
})
