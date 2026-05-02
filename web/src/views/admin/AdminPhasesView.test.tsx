import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it, vi } from 'vitest'
import { AdminPhasesView } from './AdminPhasesView'
import * as usePhasesModule from '../../hooks/usePhases'

vi.mock('../../hooks/usePhases', () => ({
  usePhases: vi.fn(),
}))

const usePhasesMock = vi.mocked(usePhasesModule.usePhases)

describe('AdminPhasesView', () => {
  it('should render the phases table', () => {
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        {
          details: 'Premiere phase',
          id: 'phase-1',
          name: 'Brassage',
          order: 1,
          type: 'POOL',
        },
      ],
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <AdminPhasesView />
      </ThemeProvider>,
    )

    expect(screen.getByRole('heading', { name: 'Phases' })).toBeInTheDocument()
    expect(screen.getByText('Brassage')).toBeInTheDocument()
    expect(screen.getByText('phase-1')).toBeInTheDocument()
    expect(screen.getByText('Premiere phase')).toBeInTheDocument()
  })

  it('should render an empty state when there are no phases', () => {
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [],
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <AdminPhasesView />
      </ThemeProvider>,
    )

    expect(screen.getByText('Aucune phase disponible.')).toBeInTheDocument()
  })

  it('should render the loading state', () => {
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: true,
      phases: [],
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <AdminPhasesView />
      </ThemeProvider>,
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render the error message', () => {
    usePhasesMock.mockReturnValue({
      errorMessage: 'Phases indisponibles',
      isLoading: false,
      phases: [],
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <AdminPhasesView />
      </ThemeProvider>,
    )

    expect(screen.getByText('Phases indisponibles')).toBeInTheDocument()
  })
})
