import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GameStatus } from '../../generated/api-client'
import * as useGamesModule from '../../hooks/useGames'
import * as usePhasesModule from '../../hooks/usePhases'
import * as useTeamsModule from '../../hooks/useTeams'
import * as gamesServiceModule from '../../services/gamesService'
import { AdminGamesView } from './AdminGamesView'

vi.mock('../../hooks/useGames', () => ({
  useGames: vi.fn(),
}))

vi.mock('../../hooks/usePhases', () => ({
  usePhases: vi.fn(),
}))

vi.mock('../../hooks/useTeams', () => ({
  useTeams: vi.fn(),
}))

vi.mock('../../services/gamesService', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../services/gamesService')>()

  return {
    ...original,
    bulkCreateGames: vi.fn(),
    bulkUpdateGames: vi.fn(),
    deleteGame: vi.fn(),
    deleteGameScore: vi.fn(),
    updateGame: vi.fn(),
    upsertGameScore: vi.fn(),
  }
})

vi.mock('swr', async (importOriginal) => {
  const original = await importOriginal<typeof import('swr')>()

  return {
    ...original,
    useSWRConfig: () => ({
      mutate: vi.fn().mockResolvedValue(undefined),
    }),
  }
})

const useGamesMock = vi.mocked(useGamesModule.useGames)
const usePhasesMock = vi.mocked(usePhasesModule.usePhases)
const useTeamsMock = vi.mocked(useTeamsModule.useTeams)
const bulkCreateGamesMock = vi.mocked(gamesServiceModule.bulkCreateGames)
const bulkUpdateGamesMock = vi.mocked(gamesServiceModule.bulkUpdateGames)
const deleteGameMock = vi.mocked(gamesServiceModule.deleteGame)
const deleteGameScoreMock = vi.mocked(gamesServiceModule.deleteGameScore)
const updateGameMock = vi.mocked(gamesServiceModule.updateGame)
const upsertGameScoreMock = vi.mocked(gamesServiceModule.upsertGameScore)

const game = {
  contestants: new Set([
    { id: 'team-1', name: 'Tigres' },
    { id: 'team-2', name: 'Lynx' },
  ]),
  court: 'Terrain 1',
  group: 'Poule A',
  id: 'game-1',
  subgroup: '1/2',
  phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' as const },
  referee: { id: 'team-3', name: 'Aigles' },
  score: { pointsByTeam: { 'team-1': 21, 'team-2': 18 } },
  status: GameStatus.Completed,
  time: new Date('2026-05-03T10:30:00.000Z'),
}

describe('AdminGamesView', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  beforeEach(() => {
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [game.phase],
    })
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      teams: [
        { id: 'team-1', name: 'Tigres' },
        { id: 'team-2', name: 'Lynx' },
        { id: 'team-3', name: 'Aigles' },
      ],
    })
    bulkUpdateGamesMock.mockResolvedValue([game])
    bulkCreateGamesMock.mockResolvedValue([game])
    deleteGameScoreMock.mockResolvedValue(undefined)
    deleteGameMock.mockResolvedValue(undefined)
    updateGameMock.mockResolvedValue(game)
    upsertGameScoreMock.mockResolvedValue(game.score)
  })

  it('should render the games table', () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [game],
      isLoading: false,
    })

    // WHEN
    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )

    // THEN
    expect(screen.getByRole('heading', { name: 'Matchs' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Heure/ })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Phase/ })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Groupe/ })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Equipe 1/ })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Score/ })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Equipe 2/ })).toBeInTheDocument()
    expect(screen.getByText('Brassage')).toBeInTheDocument()
    expect(screen.getByText('Poule A')).toBeInTheDocument()
    expect(screen.getByText('Tigres')).toBeInTheDocument()
    expect(screen.getByText('Lynx')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Modifier le score de Tigres' })).toHaveTextContent('21')
    expect(screen.getByRole('button', { name: 'Modifier le score de Lynx' })).toHaveTextContent('18')
    expect(screen.queryByText('Finale')).not.toBeInTheDocument()
    expect(screen.queryByText('game-1')).not.toBeInTheDocument()
  })

  it('should render an empty symbol instead of a score when the game is not completed', () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [
        {
          ...game,
          score: { pointsByTeam: {} },
          status: GameStatus.Scheduled,
        },
      ],
      isLoading: false,
    })

    // WHEN
    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )

    // THEN
    expect(screen.getByText('∅')).toBeInTheDocument()
    expect(screen.queryByText('- - -')).not.toBeInTheDocument()
  })

  it('should render an empty state when there are no games', () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [],
      isLoading: false,
    })

    // WHEN
    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )

    // THEN
    expect(screen.getByText('Aucun match disponible.')).toBeInTheDocument()
  })

  it('should edit the score without opening the game drawer', async () => {
    // GIVEN
    const scheduledGame = {
      ...game,
      score: { pointsByTeam: {} },
      status: GameStatus.Scheduled,
    }
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [scheduledGame],
      isLoading: false,
    })
    updateGameMock.mockResolvedValue({
      ...scheduledGame,
      status: GameStatus.Completed,
    })
    upsertGameScoreMock.mockResolvedValue({
      pointsByTeam: { 'team-1': 21, 'team-2': 18 },
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Modifier le score de Tigres contre Lynx' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Score Tigres' }), { target: { value: '21' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Score Lynx' }), { target: { value: '18' } })
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Score Lynx' }), { key: 'Enter' })

    // THEN
    await waitFor(() => {
      expect(upsertGameScoreMock).toHaveBeenCalledWith('game-1', {
        'team-1': 21,
        'team-2': 18,
      })
    })
    expect(updateGameMock).not.toHaveBeenCalled()
    expect(screen.queryByRole('heading', { name: 'Modifier le match' })).not.toBeInTheDocument()
  })

  it('should render the loading state', () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [],
      isLoading: true,
    })

    // WHEN
    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )

    // THEN
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render the error message', () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: 'Matchs indisponibles',
      games: [],
      isLoading: false,
    })

    // WHEN
    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )

    // THEN
    expect(screen.getByText('Matchs indisponibles')).toBeInTheDocument()
  })

  it('should choose and open the single game creation form', () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [],
      isLoading: false,
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter des matchs' }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Creer un match' }))

    // THEN
    expect(screen.getByRole('heading', { name: 'Nouveau match' })).toBeInTheDocument()
    expect(screen.queryByRole('combobox', { name: 'Statut' })).not.toBeInTheDocument()
  })

  it('should create all pool games from the dedicated form', async () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [],
      isLoading: false,
    })
    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter des matchs' }))
    fireEvent.click(screen.getByRole('menuitem', { name: "Creer les matchs d'une poule" }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Poule' }), {
      target: { value: 'Poule A' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: 'Terrain' }), {
      target: { value: 'Terrain 1' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: 'Tigres' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Lynx' }))

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Creer les matchs' }))

    // THEN
    await waitFor(() =>
      expect(bulkCreateGamesMock).toHaveBeenCalledWith(
        expect.objectContaining({
          assignReferees: false,
          breakDurationMinutes: undefined,
          court: 'Terrain 1',
          gameDurationMinutes: undefined,
          group: 'Poule A',
          phaseId: 'phase-1',
          startTime: undefined,
          teamIds: new Set(['team-1', 'team-2']),
        }),
      ),
    )
    expect(screen.queryByRole('heading', { name: "Matchs d'une poule" })).not.toBeInTheDocument()
  }, 10_000)

  it('should open the update drawer with selected game values', () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [game],
      isLoading: false,
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )

    // WHEN
    fireEvent.click(screen.getByRole('row', { name: /Brassage Poule A Tigres 21 - 18 Lynx/ }))

    // THEN
    expect(screen.getByRole('heading', { name: 'Modifier le match' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('1/2')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Terrain 1')).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: 'Score Equipe 1' })).toHaveValue(21)
    expect(screen.getByRole('spinbutton', { name: 'Score Equipe 2' })).toHaveValue(18)
    expect(screen.queryByRole('combobox', { name: 'Statut' })).not.toBeInTheDocument()
  })

  it('should preserve and save the score when updating game information', async () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [game],
      isLoading: false,
    })
    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )
    fireEvent.click(screen.getByRole('row', { name: /Brassage Poule A Tigres 21 - 18 Lynx/ }))

    // WHEN
    fireEvent.change(screen.getByDisplayValue(/2026-05-03T/), {
      target: { value: '2026-05-03T11:30' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    // THEN
    await waitFor(() => {
      expect(updateGameMock).toHaveBeenCalledWith(
        'game-1',
        expect.objectContaining({
          pointsByTeam: {
            'team-1': 21,
            'team-2': 18,
          },
          time: new Date('2026-05-03T11:30'),
        }),
      )
    })
    expect(upsertGameScoreMock).toHaveBeenCalledWith('game-1', {
      'team-1': 21,
      'team-2': 18,
    })
    expect(deleteGameScoreMock).not.toHaveBeenCalled()
  })

  it('should delete the score when both score fields are cleared', async () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [game],
      isLoading: false,
    })
    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )
    fireEvent.click(screen.getByRole('row', { name: /Brassage Poule A Tigres 21 - 18 Lynx/ }))
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Score Equipe 1' }), {
      target: { value: '' },
    })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Score Equipe 2' }), {
      target: { value: '' },
    })

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    // THEN
    await waitFor(() => expect(deleteGameScoreMock).toHaveBeenCalledWith('game-1'))
    expect(upsertGameScoreMock).not.toHaveBeenCalled()
  })

  it('should delete selected games after confirmation', async () => {
    // GIVEN
    const secondGame = { ...game, id: 'game-2', subgroup: 'Finales' }
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [game, secondGame],
      isLoading: false,
    })
    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )
    const gameCheckboxes = screen.getAllByRole('checkbox', { name: 'Selectionner le match' })
    fireEvent.click(gameCheckboxes[0])
    fireEvent.click(gameCheckboxes[1])

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))
    expect(screen.getByText('Confirmez-vous la suppression ?')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))

    // THEN
    await waitFor(() => {
      expect(deleteGameMock).toHaveBeenCalledWith('game-1')
      expect(deleteGameMock).toHaveBeenCalledWith('game-2')
    })
    expect(screen.queryByText('2 matchs selectionnes')).not.toBeInTheDocument()
  })

  it('should bulk update selected games from the drawer', async () => {
    // GIVEN
    const secondGame = { ...game, id: 'game-2', subgroup: 'Finales' }
    const updatedGames = [
      { ...game, court: 'Central' },
      { ...secondGame, court: 'Central' },
    ]
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [game, secondGame],
      isLoading: false,
    })
    bulkUpdateGamesMock.mockResolvedValue(updatedGames)
    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )
    const gameCheckboxes = screen.getAllByRole('checkbox', { name: 'Selectionner le match' })
    fireEvent.click(gameCheckboxes[0])
    fireEvent.click(gameCheckboxes[1])

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Modifier les matchs selectionnes' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Modifier le terrain' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Terrain' }), {
      target: { value: 'Central' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Modifier les matchs' }))

    // THEN
    await waitFor(() =>
      expect(bulkUpdateGamesMock).toHaveBeenCalledWith(
        new Set(['game-1', 'game-2']),
        { court: 'Central' },
      ),
    )
    expect(screen.queryByRole('heading', { name: 'Modifier 2 matchs' })).not.toBeInTheDocument()
    expect(screen.queryByText('2 matchs selectionnes')).not.toBeInTheDocument()
  })

  it('should keep failed deletions selected and display an error', async () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [game],
      isLoading: false,
    })
    deleteGameMock.mockRejectedValueOnce(new Error('Boom'))
    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )
    fireEvent.click(screen.getByRole('checkbox', { name: 'Selectionner le match' }))

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))
    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))

    // THEN
    expect(await screen.findByText('Impossible de supprimer pour le moment.')).toBeInTheDocument()
    expect(screen.getByText('1 match selectionne')).toBeInTheDocument()
  })
})
