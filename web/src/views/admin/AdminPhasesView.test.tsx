import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SWRConfig } from 'swr'
import { AdminPhasesView } from './AdminPhasesView'
import * as usePhasesModule from '../../hooks/usePhases'

vi.mock('../../hooks/usePhases', () => ({
  usePhases: vi.fn(),
}))

const usePhasesMock = vi.mocked(usePhasesModule.usePhases)

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

  it('should transform phases into a recursively rendered tree', () => {
    // GIVEN
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        {
          id: 'phase-root',
          name: 'Phase de poules',
          order: 1,
        },
        {
          id: 'phase-1',
          name: 'Brassage',
          order: 1,
          parentId: 'phase-root',
          type: 'POOL',
        },
      ],
    })

    // WHEN
    renderView()

    // THEN
    expect(screen.getByRole('heading', { name: 'Phases' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Phase de poules Organisation' })).toBeInTheDocument()
    expect(screen.getByText('Phase de poules')).toBeInTheDocument()
    expect(screen.getByText('Brassage')).toBeInTheDocument()
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

  it('should open the update drawer for the selected phase', () => {
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        {
          details: 'Tableau principal',
          id: 'phase-main',
          name: 'Principale',
          order: 1,
          type: 'BRACKET',
        },
      ],
    })
    renderView()

    fireEvent.click(screen.getByRole('button', { name: 'Editer Principale' }))

    expect(screen.getByRole('heading', { name: 'Modifier la phase' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Principale')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Tableau principal')).toBeInTheDocument()
  })

})
