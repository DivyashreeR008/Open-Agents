import { describe, expect, it } from 'vitest'
import { buildPdfHtml } from './exportPdf'

describe('print-ready PDF document', () => {
  it('declares a page size and print margins', () => {
    const html = buildPdfHtml('Report', 'Body')

    expect(html).toContain('@page{size:A4;margin:18mm;}')
    expect(html).toContain('@media print')
  })

  it('wraps long tokens so code and URLs cannot overflow the page', () => {
    const html = buildPdfHtml('Report', 'https://example.test/' + 'a'.repeat(200))

    expect(html).toContain('overflow-wrap:anywhere')
    expect(html).toContain('word-break:break-word')
    expect(html).toContain('white-space:pre-wrap')
  })

  it('keeps the page heading with the first content block', () => {
    const html = buildPdfHtml('Report', 'Body')

    expect(html).toContain('break-after:avoid')
    expect(html).toContain('page-break-after:avoid')
  })
})
