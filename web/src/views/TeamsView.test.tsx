import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it, vi } from 'vitest'
import { TeamsView } from './TeamsView'
import * as useTeamLoginModule from '../hooks/useTeamLogin'
import * as useTeamsModule from '../hooks/useTeams'

vi.mock('../hooks/useTeamLogin', () => ({
  useTeamLogin: vi.fn(),
}))

vi.mock('../hooks/useTeams', () => ({
  useTeams: vi.fn(),
}))

const useTeamLoginMock = vi.mocked(useTeamLoginModule.useTeamLogin)
const useTeamsMock = vi.mocked(useTeamsModule.useTeams)

describe('TeamsView', () => {
  it('should assemble the team login page with banner and card content', () => {
    // Given
    useTeamLoginMock.mockReturnValue({
      currentTeam: { id: 'team-2', name: 'Tigres' },
      handleTeamChange: vi.fn(),
    })
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      teams: [
        { id: 'team-1', name: 'Aigles' },
        { id: 'team-2', name: 'Tigres' },
      ],
    })

    // When
    render(
      <ThemeProvider theme={createTheme()}>
        <TeamsView />
      </ThemeProvider>,
    )

    // Then
    expect(screen.getByAltText('SCUF')).toBeInTheDocument()
    expect(screen.getByText('Tournois')).toBeInTheDocument()
    expect(screen.getByText('Équipe sélectionnée : Tigres')).toBeInTheDocument()
  })

  it('should render the loading state from the teams hook', () => {
    // Given
    useTeamLoginMock.mockReturnValue({
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: true,
      teams: [],
    })

    // When
    render(
      <ThemeProvider theme={createTheme()}>
        <TeamsView />
      </ThemeProvider>,
    )

    // Then
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should forward team changes with the teams list from the teams hook', () => {
    // Given
    const handleTeamChange = vi.fn()
    const teams = [
      { id: 'team-1', name: 'Aigles' },
      { id: 'team-2', name: 'Tigres' },
    ]

    useTeamLoginMock.mockReturnValue({
      currentTeam: null,
      handleTeamChange,
    })
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      teams,
    })

    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        <TeamsView />
      </ThemeProvider>,
    )

    const selectInput = container.querySelector('input')

    expect(selectInput).not.toBeNull()

    // When
    fireEvent.change(selectInput as HTMLInputElement, { target: { value: 'team-2' } })

    // Then
    expect(handleTeamChange).toHaveBeenCalled()
    expect(handleTeamChange.mock.calls[0][0]).toEqual(teams)
  })
})
