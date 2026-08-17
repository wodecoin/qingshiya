import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { clearAllData } from '../storage/db'
import { entriesRepository } from '../storage/entriesRepository'

afterEach(cleanup)
beforeEach(async () => { await clearAllData() })

describe('App', () => {
  it('renders the journal entry action', async () => {
    render(<App />)

    expect(await screen.findByRole('heading', { name: '轻释压' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '记录一次压力' })).toBeInTheDocument()
    const navigation = screen.getByRole('navigation', { name: '主要导航' })
    expect(navigation).toHaveAttribute('data-mobile-layout', 'fit-five-items')
    for (const link of within(navigation).getAllByRole('link')) {
      expect(link).toHaveAttribute('data-min-touch-target', '44px')
    }
  })

  it('navigates to all five app destinations', async () => {
    render(<App />)

    for (const destination of ['记录', '练习', '复盘', '设置', '首页']) {
      fireEvent.click(within(screen.getByRole('navigation', { name: '主要导航' })).getByRole('link', { name: destination }))
      expect(screen.getByRole('navigation', { name: '主要导航' })).toHaveAttribute('aria-label', '主要导航')
    }

    fireEvent.click(within(screen.getByRole('navigation', { name: '主要导航' })).getByRole('link', { name: '记录' }))
    expect(screen.getByRole('heading', { name: '此刻的压力有多强？' })).toBeInTheDocument()
    fireEvent.click(within(screen.getByRole('navigation', { name: '主要导航' })).getByRole('link', { name: '练习' }))
    expect(screen.getByRole('heading', { name: '选择一个练习' })).toBeInTheDocument()
    fireEvent.click(within(screen.getByRole('navigation', { name: '主要导航' })).getByRole('link', { name: '复盘' }))
    expect(screen.getByRole('heading', { name: '复盘' })).toBeInTheDocument()
    fireEvent.click(within(screen.getByRole('navigation', { name: '主要导航' })).getByRole('link', { name: '设置' }))
    expect(screen.getByRole('heading', { name: '设置' })).toBeInTheDocument()
    expect(screen.getByText(/不会上传/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '清除全部数据' }))
    expect(screen.getByRole('alertdialog')).toHaveTextContent('此操作不可恢复')
    fireEvent.click(screen.getByRole('button', { name: '取消' }))
    fireEvent.click(within(screen.getByRole('navigation', { name: '主要导航' })).getByRole('link', { name: '首页' }))
    expect(await screen.findByRole('heading', { name: '轻释压' })).toBeInTheDocument()
  })

  it('saves one entry with the completed exercise result', async () => {
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: '跳过' }))
    fireEvent.click(await screen.findByRole('button', { name: '记录一次压力' }))
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    ;[1, 2, 3, 4, 5].forEach(() => fireEvent.click(screen.getByRole('button', { name: '跳过此步' })))
    fireEvent.click(screen.getAllByRole('button', { name: '开始' })[0])
    fireEvent.click(screen.getByRole('button', { name: '开始练习' }))
    fireEvent.click(screen.getByRole('button', { name: '完成练习' }))
    fireEvent.click(screen.getByRole('button', { name: '下一步' }))
    fireEvent.click(screen.getByRole('button', { name: '保存记录' }))

    await waitFor(async () => expect(await entriesRepository.list()).toHaveLength(1))
    const entries = await entriesRepository.list()
    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({ exerciseId: 'arc-breakdown', durationMinutes: 5 })
  })

  it('saves the pressure draft without an exercise after exiting an unfinished exercise', async () => {
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: '跳过' }))
    fireEvent.click(screen.getByRole('button', { name: '记录一次压力' }))
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    ;[1, 2, 3, 4, 5].forEach(() => fireEvent.click(screen.getByRole('button', { name: '跳过此步' })))
    fireEvent.click(screen.getAllByRole('button', { name: '开始' })[0])
    fireEvent.click(screen.getByRole('button', { name: '退出' }))
    fireEvent.click(screen.getByRole('button', { name: '下一步' }))
    fireEvent.click(screen.getByRole('button', { name: '保存记录' }))

    await waitFor(async () => expect(await entriesRepository.list()).toHaveLength(1))
    const entries = await entriesRepository.list()
    expect(entries).toHaveLength(1)
    expect(entries[0].exerciseId).toBeUndefined()
    expect(entries[0].durationMinutes).toBeUndefined()
  })

  it('clears a prefilled post-exercise intensity when exiting an unfinished exercise', async () => {
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: '跳过' }))
    fireEvent.click(await screen.findByRole('button', { name: '记录一次压力' }))
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: '下一步' }))
    fireEvent.click(screen.getByRole('button', { name: '焦虑' }))
    fireEvent.click(screen.getByRole('button', { name: '下一步' }))
    ;[1, 2, 3].forEach(() => fireEvent.click(screen.getByRole('button', { name: '跳过此步' })))
    fireEvent.change(screen.getByRole('spinbutton', { name: '练习后压力强度' }), { target: { value: '3' } })
    fireEvent.click(screen.getAllByRole('button', { name: '开始' })[0])
    fireEvent.click(screen.getByRole('button', { name: '退出' }))
    fireEvent.click(screen.getByRole('button', { name: '下一步' }))
    fireEvent.click(screen.getByRole('button', { name: '保存记录' }))

    await waitFor(async () => expect(await entriesRepository.list()).toHaveLength(1))
    const [entry] = await entriesRepository.list()
    expect(entry).toMatchObject({ intensityBefore: 5, primaryEmotions: ['焦虑'] })
    expect(entry.exerciseId).toBeUndefined()
    expect(entry.durationMinutes).toBeUndefined()
    expect(entry.intensityAfter).toBeUndefined()
  })

  it('clears the runner and result when leaving and re-entering the entry flow', async () => {
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: '跳过' }))
    fireEvent.click(await screen.findByRole('button', { name: '记录一次压力' }))
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    ;[1, 2, 3, 4, 5].forEach(() => fireEvent.click(screen.getByRole('button', { name: '跳过此步' })))
    fireEvent.click(screen.getAllByRole('button', { name: '开始' })[0])
    fireEvent.click(screen.getByRole('button', { name: '开始练习' }))
    fireEvent.click(screen.getByRole('button', { name: '完成练习' }))
    fireEvent.click(within(screen.getByRole('navigation', { name: '主要导航' })).getByRole('link', { name: '首页' }))
    fireEvent.click(await screen.findByRole('button', { name: '记录一次压力' }))
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    ;[1, 2, 3, 4, 5].forEach(() => fireEvent.click(screen.getByRole('button', { name: '跳过此步' })))

    expect(screen.queryByRole('button', { name: '完成练习' })).not.toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: '练习后压力强度' })).toHaveValue(null)
  })
})
