import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SWRConfig } from 'swr'
import { AdminTeamsView } from './AdminTeamsView'
import * as useTeamsModule from '../../hooks/useTeams'
import * as teamsServiceModule from '../../services/teamsService'
import { UserFacingError } from '../../services/apiError'

vi.mock('../../hooks/useTeams', () => ({
  useTeams: vi.fn(),
}))

vi.mock('../../services/teamsService', async () => {
  const actual = await vi.importActual<typeof import('../../services/teamsService')>('../../services/teamsService')

  return {
    ...actual,
    createTeam: vi.fn(),
    deleteTeam: vi.fn(),
    updateTeam: vi.fn(),
  }
})

const useTeamsMock = vi.mocked(useTeamsModule.useTeams)
const createTeamMock = vi.mocked(teamsServiceModule.createTeam)
const deleteTeamMock = vi.mocked(teamsServiceModule.deleteTeam)
const updateTeamMock = vi.mocked(teamsServiceModule.updateTeam)

const renderView = () =>
  render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <ThemeProvider theme={createTheme()}>
        <AdminTeamsView />
      </ThemeProvider>
    </SWRConfig>,
  )

describe('AdminTeamsView', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('should render teams as a compact list', () => {
    // GIVEN
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      teams: [
        { id: 'team-1', name: 'Aigles' },
        { id: 'team-2', name: 'Tigres' },
      ],
    })

    // WHEN
    renderView()

    // THEN
    expect(screen.getByRole('heading', { name: 'Équipes' })).toBeInTheDocument()
    expect(screen.getByText('Aigles')).toBeInTheDocument()
    expect(screen.getByText('Tigres')).toBeInTheDocument()
  })

  it('should render loading, error and empty states', () => {
    // GIVEN
    useTeamsMock.mockReturnValue({
      errorMessage: 'Equipes indisponibles',
      isLoading: true,
      teams: [],
    })

    const { rerender } = renderView()

    // THEN
    expect(screen.getByText('Equipes indisponibles')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()

    // WHEN
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      teams: [],
    })
    rerender(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <ThemeProvider theme={createTheme()}>
          <AdminTeamsView />
        </ThemeProvider>
      </SWRConfig>,
    )

    // THEN
    expect(screen.getByText('Aucune equipe disponible.')).toBeInTheDocument()
  })

  it('should create a team from the drawer', async () => {
    // GIVEN
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      teams: [],
    })
    createTeamMock.mockResolvedValueOnce({ id: 'team-1', name: 'Aigles' })
    renderView()

    fireEvent.click(screen.getByRole('button', { name: 'Ajouter une equipe' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Nom' }), { target: { value: ' Aigles ' } })

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    // THEN
    await waitFor(() => {
      expect(createTeamMock).toHaveBeenCalledWith({ name: 'Aigles' })
    })
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Nouvelle equipe' })).not.toBeInTheDocument()
    })
  })

  it('should update the selected team from the drawer', async () => {
    // GIVEN
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      teams: [{ id: 'team-1', name: 'Aigles' }],
    })
    updateTeamMock.mockResolvedValueOnce({ id: 'team-1', name: 'Faucons' })
    renderView()

    fireEvent.click(screen.getByRole('button', { name: 'Editer Aigles' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Nom' }), { target: { value: 'Faucons' } })

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    // THEN
    await waitFor(() => {
      expect(updateTeamMock).toHaveBeenCalledWith('team-1', { name: 'Faucons' })
    })
  })

  it('should keep the drawer open when creation fails', async () => {
    // GIVEN
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      teams: [],
    })
    createTeamMock.mockRejectedValueOnce(new Error('Creation impossible'))
    renderView()

    fireEvent.click(screen.getByRole('button', { name: 'Ajouter une equipe' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Nom' }), { target: { value: 'Aigles' } })

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    // THEN
    expect(await screen.findByText('Creation impossible')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nouvelle equipe' })).toBeInTheDocument()
  })

  it('should delete a team after confirmation', async () => {
    // GIVEN
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      teams: [{ id: 'team-1', name: 'Aigles' }],
    })
    deleteTeamMock.mockResolvedValueOnce(undefined)
    renderView()

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))
    const dialog = screen.getByRole('dialog', { name: 'Supprimer ?' })

    // WHEN
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    // THEN
    await waitFor(() => {
      expect(deleteTeamMock).toHaveBeenCalledWith('team-1')
    })
  })

  it('should display the deletion error when the API rejects it', async () => {
    // GIVEN
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      teams: [{ id: 'team-1', name: 'Aigles' }],
    })
    deleteTeamMock.mockRejectedValueOnce(
      new UserFacingError(
        "Cette équipe ne peut pas être supprimée car elle participe à un ou plusieurs matchs.",
      ),
    )
    renderView()

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))
    const dialog = screen.getByRole('dialog', { name: 'Supprimer ?' })

    // WHEN
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    // THEN
    expect(
      await within(dialog).findByText(
        "Cette équipe ne peut pas être supprimée car elle participe à un ou plusieurs matchs.",
      ),
    ).toBeInTheDocument()
  })
})
