import { beforeEach, describe, expect, it, vi } from 'vitest'
import { exportEntries } from './exportActions'

describe('exportEntries', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('downloads JSON with the application/json MIME type', async () => {
    const click = vi.fn()
    const createObjectURL = vi.fn().mockReturnValue('blob:json')
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL: vi.fn() })
    vi.spyOn(document, 'createElement').mockImplementation(() => ({
      click,
      href: '',
      download: '',
    } as unknown as HTMLElement))

    await exportEntries('json', { export: vi.fn().mockResolvedValue('[{"id":"one"}]') })

    const blob = createObjectURL.mock.calls[0][0] as Blob
    expect(blob.type).toBe('application/json;charset=utf-8')
    expect(click).toHaveBeenCalledOnce()
  })

  it('downloads CSV with the text/csv MIME type', async () => {
    const click = vi.fn()
    const createObjectURL = vi.fn().mockReturnValue('blob:csv')
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL: vi.fn() })
    vi.spyOn(document, 'createElement').mockImplementation(() => ({
      click,
      href: '',
      download: '',
    } as unknown as HTMLElement))

    await exportEntries('csv', { export: vi.fn().mockResolvedValue('日期\r\n') })

    const blob = createObjectURL.mock.calls[0][0] as Blob
    expect(blob.type).toBe('text/csv;charset=utf-8')
    expect(click).toHaveBeenCalledOnce()
  })
})
