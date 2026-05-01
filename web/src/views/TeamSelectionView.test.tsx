import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it, vi } from 'vitest'
import { TeamSelectionView } from './TeamSelectionView'
import * as useTeamsModule from '../hooks/useTeams'

vi.mock('../hooks/useTeams', () => ({
  useTeams: vi.fn(),
}))

const useTeamsMock = vi.mocked(useTeamsModule.useTeams)

describe('TeamSelectionView', () => {
  it('should render the loading state from the teams hook', () => {
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: true,
      teams: [],
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <TeamSelectionView onTeamChange={vi.fn()} />
      </ThemeProvider>,
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should forward team changes with the teams list from the teams hook', () => {
    const onTeamChange = vi.fn()
    const teams = [
      { id: 'team-1', name: 'Aigles' },
      { id: 'team-2', name: 'Tigres' },
    ]

    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      teams,
    })

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        <TeamSelectionView onTeamChange={onTeamChange} />
      </ThemeProvider>,
    )

    const selectInput = container.querySelector('input')

    expect(selectInput).not.toBeNull()

    fireEvent.change(selectInput as HTMLInputElement, { target: { value: 'team-2' } })

    expect(onTeamChange).toHaveBeenCalled()
    expect(onTeamChange.mock.calls[0][0]).toEqual(teams)
  })
})
