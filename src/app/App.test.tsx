import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App'

afterEach(cleanup)

describe('App', () => {
  it('renders the journal entry action', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '轻释压' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '记录一次压力' })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: '轻释压' })).toBeInTheDocument()
  })
})
