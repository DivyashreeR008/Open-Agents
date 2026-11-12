import { afterEach, describe, expect, it, vi } from 'vitest'
import { exportWorkflowAsMarkdown } from './exportMarkdown'

afterEach(() => vi.restoreAllMocks())

describe('exportWorkflowAsMarkdown empty step output', () => {
  it('omits a done step whose output is the number zero', () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:workflow')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const download = vi.spyOn(HTMLAnchorElement.prototype, 'download', 'set')

    exportWorkflowAsMarkdown('Zero output', [
      { agentName: 'Writer', status: 'done', output: 0 },
      { agentName: 'Reviewer', status: 'done', output: 'Reviewed.' },
    ])

    expect(download.mock.calls.at(-1)[0]).toBe('zero-output-output.md')
  })
})
