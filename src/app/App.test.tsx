import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('renders the journal entry action', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '轻释压' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '记录一次压力' })).toBeInTheDocument()
  })
})
