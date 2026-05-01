import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it, vi } from 'vitest'
import { TeamLoginCard } from './TeamLoginCard'
import type { Team } from '../../services/teamsService'

const teams: Team[] = [
  { id: 'team-1', name: 'Aigles' },
  { id: 'team-2', name: 'Tigres' },
]

const renderCard = (props?: Partial<React.ComponentProps<typeof TeamLoginCard>>) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <TeamLoginCard
        currentTeam={null}
        errorMessage={null}
        isLoading={false}
        onTeamChange={vi.fn()}
        teams={teams}
        {...props}
      />
    </ThemeProvider>,
  )

describe('TeamLoginCard', () => {
  it('should render the available teams in the select menu', () => {
    // Given
    renderCard()

    // When
    fireEvent.mouseDown(screen.getByLabelText('Choisir une équipe'))

    // Then
    expect(screen.getByRole('option', { name: 'Aigles' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Tigres' })).toBeInTheDocument()
  })

  it('should show the selected team summary', () => {
    // Given
    renderCard({ currentTeam: teams[1] })

    // Then
    expect(screen.getByText('Équipe sélectionnée : Tigres')).toBeInTheDocument()
  })

  it('should forward selection changes', () => {
    // Given
    const onTeamChange = vi.fn()
    const { container } = renderCard({ onTeamChange })
    const selectInput = container.querySelector('input')

    expect(selectInput).not.toBeNull()

    // When
    fireEvent.change(selectInput as HTMLInputElement, { target: { value: 'team-2' } })

    // Then
    expect(onTeamChange).toHaveBeenCalled()
  })

  it('should show an error message when loading fails', () => {
    // Given
    renderCard({ errorMessage: 'API indisponible' })

    // Then
    expect(screen.getByText('API indisponible')).toBeInTheDocument()
  })

  it('should show a loading indicator while teams are loading', () => {
    // Given
    renderCard({ isLoading: true })

    // Then
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should show an empty state when no team is available', () => {
    // Given
    renderCard({ teams: [] })

    // Then
    expect(screen.getByText('Aucune équipe disponible.')).toBeInTheDocument()
  })
})
