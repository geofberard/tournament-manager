import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, afterEach, vi } from 'vitest'
import { CounterButton } from './CounterButton'

describe('CounterButton', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('should render a plus button for add action', () => {
    render(<CounterButton action="add" onClick={vi.fn()} />)

    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
  })

  it('should render a minus button for remove action', () => {
    render(<CounterButton action="remove" onClick={vi.fn()} />)

    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument()
  })

  it('should call onClick when add button is clicked', () => {
    const onClick = vi.fn()
    render(<CounterButton action="add" onClick={onClick} />)

    fireEvent.click(screen.getByRole('button', { name: '+' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should call onClick when remove button is clicked', () => {
    const onClick = vi.fn()
    render(<CounterButton action="remove" onClick={onClick} />)

    fireEvent.click(screen.getByRole('button', { name: '-' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
