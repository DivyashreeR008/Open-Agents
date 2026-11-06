import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import {
  DEFAULT_TITLE,
  SITE_NAME,
  formatDocumentTitle,
  useDocumentTitle,
} from './useDocumentTitle'

describe('formatDocumentTitle', () => {
  it('returns the site default for empty or missing page titles', () => {
    expect(formatDocumentTitle('')).toBe(DEFAULT_TITLE)
    expect(formatDocumentTitle(null)).toBe(DEFAULT_TITLE)
    expect(formatDocumentTitle(undefined)).toBe(DEFAULT_TITLE)
  })

  it('combines a page title with the site name', () => {
    expect(formatDocumentTitle('Settings')).toBe(`Settings \u2014 ${SITE_NAME}`)
    expect(DEFAULT_TITLE).toBe(`${SITE_NAME} \u2014 AI Agents, Ready to Use`)
  })
})

describe('useDocumentTitle', () => {
  it('writes the formatted title on mount', () => {
    renderHook(() => useDocumentTitle('Catalogue'))

    expect(document.title).toBe('Catalogue \u2014 Open Agents')
  })

  it('updates the document title when the page title changes', () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: 'Catalogue' },
    })

    rerender({ title: 'Privacy' })

    expect(document.title).toBe('Privacy \u2014 Open Agents')
  })

  it('uses the default title when the page title is removed', () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: 'About' },
    })

    rerender({ title: undefined })

    expect(document.title).toBe(DEFAULT_TITLE)
  })
})
