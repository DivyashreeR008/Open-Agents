import { afterEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDocumentTitle } from './useDocumentTitle'

const originalTitle = document.title

afterEach(() => {
  document.title = originalTitle
})

describe('useDocumentTitle cleanup', () => {
  it('restores the title that was present before the page mounted', () => {
    document.title = 'Previous page'
    const { unmount } = renderHook(() => useDocumentTitle('Catalogue'))

    expect(document.title).toBe('Catalogue — Open Agents')

    unmount()

    expect(document.title).toBe('Previous page')
  })

  it('restores the original title after several updates', () => {
    document.title = 'Server-rendered title'
    const { rerender, unmount } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: 'Catalogue' },
    })

    rerender({ title: 'Privacy' })
    rerender({ title: 'Terms' })
    unmount()

    expect(document.title).toBe('Server-rendered title')
  })
})
