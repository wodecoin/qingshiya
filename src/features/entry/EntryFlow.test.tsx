import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { EntryFlow } from './EntryFlow'

describe('EntryFlow', () => {
  afterEach(cleanup)

  it('saves a complete entry after stepping through each decision group', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'saved-entry' })
    render(<EntryFlow repository={{ create }} />)

    fireEvent.click(screen.getByRole('button', { name: '8' }))
    fireEvent.click(screen.getByRole('button', { name: '下一步' }))
    fireEvent.click(screen.getByRole('button', { name: '焦虑' }))
    fireEvent.click(screen.getByRole('button', { name: '恐惧' }))
    fireEvent.click(screen.getByRole('button', { name: '下一步' }))
    fireEvent.click(screen.getByRole('button', { name: '反复思考' }))
    fireEvent.click(screen.getByRole('button', { name: '下一步' }))
    fireEvent.click(screen.getByRole('button', { name: '胸闷' }))
    fireEvent.click(screen.getByRole('button', { name: '下一步' }))
    fireEvent.click(screen.getByRole('button', { name: '回避任务' }))
    fireEvent.click(screen.getByRole('button', { name: '下一步' }))
    fireEvent.click(screen.getByRole('button', { name: '跳过此步' }))

    expect(screen.getByRole('heading', { name: '确认这次记录' })).toBeInTheDocument()
    expect(screen.getByText(/压力强度：8/)).toBeInTheDocument()
    expect(screen.getByText(/焦虑、恐惧/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '保存记录' }))
    await screen.findByText('记录已保存')
    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      intensityBefore: 8,
      primaryEmotions: ['焦虑', '恐惧'],
      secondaryReactions: ['反复思考'],
      bodySignals: ['胸闷'],
      behaviorUrges: ['回避任务'],
    }))
  })

  it('supports skipping optional steps and returning without losing selections', () => {
    const create = vi.fn().mockResolvedValue({ id: 'saved-entry' })
    render(<EntryFlow repository={{ create }} />)

    fireEvent.click(screen.getByRole('button', { name: '9' }))
    expect(screen.getByText('压力很高，但你仍然可以按自己的节奏记录。')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '下一步' }))
    fireEvent.click(screen.getByRole('button', { name: '焦虑' }))
    fireEvent.click(screen.getByRole('button', { name: '下一步' }))
    fireEvent.click(screen.getByRole('button', { name: '上一步' }))
    expect(screen.getByRole('button', { name: '焦虑' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: '下一步' }))
    fireEvent.click(screen.getByRole('button', { name: '跳过此步' }))
    fireEvent.click(screen.getByRole('button', { name: '跳过此步' }))
    fireEvent.click(screen.getByRole('button', { name: '跳过此步' }))
    fireEvent.click(screen.getByRole('button', { name: '跳过此步' }))

    expect(screen.getByRole('heading', { name: '确认这次记录' })).toBeInTheDocument()
    expect(screen.getAllByText('未填写').length).toBe(3)
    expect(screen.queryByText('请立即寻求帮助')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '需要立即帮助' }))
    expect(screen.getByText(/请立即联系当地急救服务/)).toBeInTheDocument()
  })

  it('keeps existing choices and shows a prompt when a selection limit is exceeded', () => {
    render(<EntryFlow repository={{ create: vi.fn() }} />)

    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: '下一步' }))
    ;['焦虑', '恐惧', '愤怒'].forEach((label) => fireEvent.click(screen.getByRole('button', { name: label })))

    expect(screen.getByText('最多选择 2 项')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '焦虑' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '恐惧' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '愤怒' })).toHaveAttribute('aria-pressed', 'false')
  })
})
