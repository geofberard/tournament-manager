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
    // GIVEN
    renderCard()

    // WHEN
    fireEvent.mouseDown(screen.getByLabelText('Choisir une équipe'))

    // THEN
    expect(screen.getByRole('option', { name: 'Aigles' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Tigres' })).toBeInTheDocument()
  })

  it('should show the selected team summary', () => {
    // WHEN
    renderCard({ currentTeam: teams[1] })

    // THEN
    expect(screen.getByText('Équipe sélectionnée : Tigres')).toBeInTheDocument()
  })

  it('should forward selection changes', () => {
    // GIVEN
    const onTeamChange = vi.fn()
    const { container } = renderCard({ onTeamChange })
    const selectInput = container.querySelector('input')

    expect(selectInput).not.toBeNull()

    // WHEN
    fireEvent.change(selectInput as HTMLInputElement, { target: { value: 'team-2' } })

    // THEN
    expect(onTeamChange).toHaveBeenCalled()
  })

  it('should show an error message when loading fails', () => {
    // WHEN
    renderCard({ errorMessage: 'API indisponible' })

    // THEN
    expect(screen.getByText('API indisponible')).toBeInTheDocument()
  })

  it('should show a loading indicator while teams are loading', () => {
    // WHEN
    renderCard({ isLoading: true })

    // THEN
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should show an empty state when no team is available', () => {
    // WHEN
    renderCard({ teams: [] })

    // THEN
    expect(screen.getByText('Aucune équipe disponible.')).toBeInTheDocument()
  })
})
