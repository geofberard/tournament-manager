import { cleanup, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { GameList } from './GameList'
import { GameStatus } from '../../generated/api-client'
import type { Game } from '../../services/gamesService'

const renderList = (props?: Partial<React.ComponentProps<typeof GameList>>) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <MemoryRouter>
        <GameList
          errorMessage={null}
          games={[]}
          isLoading={false}
          {...props}
        />
      </MemoryRouter>
    </ThemeProvider>,
  )

const games: Game[] = [
  {
    id: 'game-1',
    phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
    group: 'Poule A',
    time: new Date('2026-05-01T18:30:00Z'),
    court: 'Central',
    status: GameStatus.Completed,
    contestants: new Set([
      { id: 'team-1', name: 'Aigles' },
      { id: 'team-2', name: 'Tigres' },
    ]),
    referee: { id: 'team-3', name: 'Pantheres' },
    score: {
      pointsByTeam: {
        'team-1': 21,
        'team-2': 18,
      },
    },
  },
  {
    id: 'game-2',
    phase: { id: 'phase-2', name: 'Principale', order: 2, type: 'POOL' },
    group: 'Poule B',
    time: new Date('2026-05-02T10:00:00Z'),
    court: 'Annexe',
    status: GameStatus.Scheduled,
    contestants: new Set([
      { id: 'team-2', name: 'Tigres' },
      { id: 'team-4', name: 'Lynx' },
    ]),
    referee: undefined,
    score: {
      pointsByTeam: {},
    },
  },
]

describe('GameList', () => {
  afterEach(() => {
    cleanup()
  })

  it('should show an error state when games fail to load', () => {
    // WHEN
    renderList({ errorMessage: 'API indisponible' })

    // THEN
    expect(screen.getByText('API indisponible')).toBeInTheDocument()
  })

  it('should show the empty message when there is no game to display', () => {
    // WHEN
    renderList({ emptyMessage: 'Aucun match pour le moment.' })

    // THEN
    expect(screen.getByText('Aucun match pour le moment.')).toBeInTheDocument()
  })

  it('should not show the empty message while loading', () => {
    // WHEN
    const { container } = renderList({ isLoading: true })

    // THEN
    expect(screen.queryByText(/Aucun match/)).not.toBeInTheDocument()
    expect(container.firstChild).toBeEmptyDOMElement()
  })

  it('should render one card per game', () => {
    // WHEN
    renderList({ games })

    // THEN
    expect(screen.getByText('Aigles vs Tigres')).toBeInTheDocument()
    expect(screen.getByText('Tigres vs Lynx')).toBeInTheDocument()
  })
})
