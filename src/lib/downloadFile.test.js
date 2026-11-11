import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { REVOKE_DELAY_MS, downloadBlob } from './downloadFile'

describe('downloadBlob', () => {
  let clickSpy
  let createdBlob

  beforeEach(() => {
    vi.useFakeTimers()
    createdBlob = null
    URL.createObjectURL = vi.fn((blob) => {
      createdBlob = blob
      return 'blob:download-test'
    })
    URL.revokeObjectURL = vi.fn()
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    delete URL.createObjectURL
    delete URL.revokeObjectURL
  })

  it('attaches a named download to the document and removes it after the click', () => {
    let attachedDuringClick = false
    clickSpy.mockImplementation(function onClick() {
      attachedDuringClick = document.body.contains(this)
    })

    downloadBlob('hello', 'text/plain', 'greeting.txt')

    expect(attachedDuringClick).toBe(true)
    expect(clickSpy.mock.instances[0].download).toBe('greeting.txt')
    expect(clickSpy.mock.instances[0].rel).toBe('noopener')
    expect(document.querySelector('a[download="greeting.txt"]')).toBeNull()
  })

  it('keeps the object URL alive until the browser has had time to read it', () => {
    downloadBlob('hello', 'text/plain', 'greeting.txt')

    expect(URL.revokeObjectURL).not.toHaveBeenCalled()
    vi.advanceTimersByTime(REVOKE_DELAY_MS - 1)
    expect(URL.revokeObjectURL).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:download-test')
  })

  it('adds a UTF-8 charset without duplicating one that is already present', () => {
    downloadBlob('plain', 'text/plain', 'plain.txt')
    downloadBlob('json', 'application/json;charset=utf-8', 'data.json')

    expect(createdBlob.type).toBe('application/json;charset=utf-8')
    expect(URL.createObjectURL).toHaveBeenCalledTimes(2)
  })

  it('passes an existing Blob through without changing its type', async () => {
    const source = new Blob(['already encoded'], { type: 'text/markdown' })

    downloadBlob(source, 'text/plain', 'notes.md')

    expect(createdBlob).toBe(source)
    expect(await createdBlob.text()).toBe('already encoded')
  })
})
