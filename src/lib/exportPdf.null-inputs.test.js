import { describe, expect, it } from 'vitest'
import { buildPdfHtml } from './exportPdf'

describe('PDF export null inputs', () => {
  it('uses the fallback title and an empty body for null values', () => {
    const html = buildPdfHtml(null, null)

    expect(html).toContain('<title>Agent output</title>')
    expect(html).toContain('<h1>Agent output</h1><pre></pre>')
  })
})
