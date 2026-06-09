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

  it('should render phases as accordions', () => {
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

    renderView()

    expect(screen.getByRole('heading', { name: 'Phases' })).toBeInTheDocument()
    expect(screen.getByText('Brassage')).toBeInTheDocument()
    expect(screen.getByText('Poules')).toBeInTheDocument()
    expect(screen.getByText('Premiere phase').tagName).toBe('H4')
    expect(screen.getByText('gras').tagName).toBe('STRONG')
    expect(screen.getByText('Matchs de poule')).toBeInTheDocument()
    expect(screen.queryByText('phase-1')).not.toBeInTheDocument()
  })

  it('should render an empty state when there are no phases', () => {
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [],
    })

    renderView()

    expect(screen.getByText('Aucune phase disponible.')).toBeInTheDocument()
  })

  it('should render the loading state', () => {
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: true,
      phases: [],
    })

    renderView()

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render the error message', () => {
    usePhasesMock.mockReturnValue({
      errorMessage: 'Phases indisponibles',
      isLoading: false,
      phases: [],
    })

    renderView()

    expect(screen.getByText('Phases indisponibles')).toBeInTheDocument()
  })

  it('should open the creation drawer', () => {
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [],
    })

    renderView()

    fireEvent.click(screen.getByRole('button', { name: 'Ajouter une phase' }))

    expect(screen.getByRole('heading', { name: 'Nouvelle phase' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Nom' })).toBeInTheDocument()
  })

  it('should open the update drawer with selected phase values', () => {
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

    fireEvent.click(screen.getByRole('button', { name: 'Editer' }))

    expect(screen.getByRole('heading', { name: 'Modifier la phase' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Finales')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Phase finale')).toBeInTheDocument()
  })
})
