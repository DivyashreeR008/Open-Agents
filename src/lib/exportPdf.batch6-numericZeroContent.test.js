import { describe, expect, it } from 'vitest'
import { buildPdfHtml } from './exportPdf'

describe('PDF export of numeric output', () => {
  it('keeps a numeric zero instead of replacing it with an empty body', () => {
    const html = buildPdfHtml('Counter agent', 0)
    expect(html).toContain('<pre>0</pre>')
  })
})
