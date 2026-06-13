import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SWRConfig } from 'swr'
import { AdminPhasesView } from './AdminPhasesView'
import * as usePhasesModule from '../../hooks/usePhases'
import * as phasesServiceModule from '../../services/phasesService'
import { UserFacingError } from '../../services/apiError'

vi.mock('../../hooks/usePhases', () => ({
  usePhases: vi.fn(),
}))

vi.mock('../../services/phasesService', async () => {
  const actual = await vi.importActual<typeof import('../../services/phasesService')>('../../services/phasesService')

  return {
    ...actual,
    deletePhase: vi.fn(),
  }
})

const usePhasesMock = vi.mocked(usePhasesModule.usePhases)
const deletePhaseMock = vi.mocked(phasesServiceModule.deletePhase)

const renderView = () =>
  render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <ThemeProvider theme={createTheme()}>
        <AdminPhasesView />
      </ThemeProvider>
    </SWRConfig>,
  )

describe('AdminPhasesView', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('should render phases as accordions', () => {
    // GIVEN
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        {
          details: '# Premiere phase\n\nTexte en **gras**.\n\n- Matchs de poule',
          id: 'phase-1',
          name: 'Brassage',
          order: 1,
          type: 'POOL',
        },
      ],
    })

    // WHEN
    renderView()

    // THEN
    expect(screen.getByRole('heading', { name: 'Phases' })).toBeInTheDocument()
    expect(screen.getByText('Brassage')).toBeInTheDocument()
    expect(screen.getByText('Poules')).toBeInTheDocument()
    expect(screen.getByText('Premiere phase').tagName).toBe('H4')
    expect(screen.getByText('gras').tagName).toBe('STRONG')
    expect(screen.getByText('Matchs de poule')).toBeInTheDocument()
    expect(screen.queryByText('phase-1')).not.toBeInTheDocument()
  })

  it('should render an empty state when there are no phases', () => {
    // GIVEN
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [],
    })

    // WHEN
    renderView()

    // THEN
    expect(screen.getByText('Aucune phase disponible.')).toBeInTheDocument()
  })

  it('should render the loading state', () => {
    // GIVEN
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: true,
      phases: [],
    })

    // WHEN
    renderView()

    // THEN
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render the error message', () => {
    // GIVEN
    usePhasesMock.mockReturnValue({
      errorMessage: 'Phases indisponibles',
      isLoading: false,
      phases: [],
    })

    // WHEN
    renderView()

    // THEN
    expect(screen.getByText('Phases indisponibles')).toBeInTheDocument()
  })

  it('should open the creation drawer', () => {
    // GIVEN
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [],
    })

    renderView()

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter une phase' }))

    // THEN
    expect(screen.getByRole('heading', { name: 'Nouvelle phase' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Nom' })).toBeInTheDocument()
  })

  it('should open the update drawer with selected phase values', () => {
    // GIVEN
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        {
          details: 'Phase finale',
          id: 'phase-2',
          name: 'Finales',
          order: 2,
          type: 'BRACKET',
        },
      ],
    })

    renderView()

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Editer' }))

    // THEN
    expect(screen.getByRole('heading', { name: 'Modifier la phase' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Finales')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Phase finale')).toBeInTheDocument()
  })

  it('should delete a phase after confirmation', async () => {
    // GIVEN
    deletePhaseMock.mockResolvedValueOnce(undefined)
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        {
          details: 'Phase finale',
          id: 'phase-2',
          name: 'Finales',
          order: 2,
          type: 'BRACKET',
        },
      ],
    })

    renderView()

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))
    const dialog = screen.getByRole('dialog', { name: 'Supprimer ?' })

    // WHEN
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    // THEN
    await waitFor(() => {
      expect(deletePhaseMock).toHaveBeenCalledWith('phase-2')
    })
  })

  it('should explain when a phase used by a game cannot be deleted', async () => {
    // GIVEN
    deletePhaseMock.mockRejectedValueOnce(
      new UserFacingError(
        "Cette phase ne peut pas être supprimée car elle est utilisée par un ou plusieurs matchs.",
      ),
    )
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        {
          details: 'Phase finale',
          id: 'phase-2',
          name: 'Finales',
          order: 2,
          type: 'BRACKET',
        },
      ],
    })

    renderView()

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))
    const dialog = screen.getByRole('dialog', { name: 'Supprimer ?' })

    // WHEN
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    // THEN
    expect(
      await within(dialog).findByText(
        "Cette phase ne peut pas être supprimée car elle est utilisée par un ou plusieurs matchs.",
      ),
    ).toBeInTheDocument()
  })
})
