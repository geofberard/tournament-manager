import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CounterBox } from './CounterBox'
import type { Team } from '../../generated/api-client'

const renderBox = (team: Team, score: number, highlight: boolean, onChangeScore: (teamId: string, delta: number) => void) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <CounterBox team={team} score={score} highlight={highlight} onChangeScore={onChangeScore} />
    </ThemeProvider>,
  )

describe('CounterBox', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  const team: Team = { id: 'team-1', name: 'Aigles' }

  it('should render the team name and score', () => {
    renderBox(team, 5, false, vi.fn())

    expect(screen.getByText('Aigles')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should render add and remove buttons', () => {
    renderBox(team, 2, false, vi.fn())

    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument()
  })

  it('should call onChangeScore when buttons are clicked', () => {
    const onChangeScore = vi.fn()
    renderBox(team, 10, true, onChangeScore)

    fireEvent.click(screen.getByRole('button', { name: '+' }))
    fireEvent.click(screen.getByRole('button', { name: '-' }))

    expect(onChangeScore).toHaveBeenCalledWith('team-1', 1)
    expect(onChangeScore).toHaveBeenCalledWith('team-1', -1)
  })
})
