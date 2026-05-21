import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, afterEach, vi } from 'vitest'
import { CounterButton } from './CounterButton'

describe('CounterButton', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('should render a plus button for add action', () => {
    render(<CounterButton action="add" teamId="team-1" onChangeScore={vi.fn()} />)

    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
  })

  it('should render a minus button for remove action', () => {
    render(<CounterButton action="remove" teamId="team-1" onChangeScore={vi.fn()} />)

    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument()
  })

  it('should call onChangeScore with +1 when add button is clicked', () => {
    const onChangeScore = vi.fn()
    render(<CounterButton action="add" teamId="team-1" onChangeScore={onChangeScore} />)

    fireEvent.click(screen.getByRole('button', { name: '+' }))

    expect(onChangeScore).toHaveBeenCalledWith('team-1', 1)
  })

  it('should call onChangeScore with -1 when remove button is clicked', () => {
    const onChangeScore = vi.fn()
    render(<CounterButton action="remove" teamId="team-1" onChangeScore={onChangeScore} />)

    fireEvent.click(screen.getByRole('button', { name: '-' }))

    expect(onChangeScore).toHaveBeenCalledWith('team-1', -1)
  })
})
