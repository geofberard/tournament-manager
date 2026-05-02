import { cleanup, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it } from 'vitest'
import { RankingTable } from './RankingTable'
import type { ContestantStats } from '../../services/statisticsService'

const renderTable = (props?: Partial<React.ComponentProps<typeof RankingTable>>) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <RankingTable
        currentTeamId="team-2"
        errorMessage={null}
        isLoading={false}
        rankings={[]}
        {...props}
      />
    </ThemeProvider>,
  )

const rankings: ContestantStats[] = [
  {
    contestant: { id: 'team-1', name: 'Aigles' },
    played: 3,
    won: 2,
    drawn: 0,
    lost: 1,
    score: 6,
    pointsFor: 63,
    pointsAgainst: 51,
    pointsDiff: 12,
  },
  {
    contestant: { id: 'team-2', name: 'Tigres' },
    played: 3,
    won: 2,
    drawn: 1,
    lost: 0,
    score: 7,
    pointsFor: 65,
    pointsAgainst: 52,
    pointsDiff: 13,
  },
]

describe('RankingTable', () => {
  afterEach(() => {
    cleanup()
  })

  it('should show an error state when rankings fail to load', () => {
    renderTable({ errorMessage: 'Resultats indisponibles' })

    expect(screen.getByText('Resultats indisponibles')).toBeInTheDocument()
  })

  it('should show the empty state when no ranking is available', () => {
    renderTable()

    expect(screen.getByText("Les resultats ne sont pas encore disponibles.")).toBeInTheDocument()
  })

  it('should render ranking rows and highlight the current team rank', () => {
    renderTable({ rankings })

    const aiglesRow = screen.getByText('Aigles').closest('tr')
    const tigresRow = screen.getByText('Tigres').closest('tr')

    expect(aiglesRow).not.toBeNull()
    expect(tigresRow).not.toBeNull()
    expect(aiglesRow).not.toHaveClass('Mui-selected')
    expect(tigresRow).toHaveClass('Mui-selected')
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })
})
