import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PublicView } from './PublicView'
import * as usePhasesHook from '../../hooks/usePhases'
import { KIOSK_MODE_STORAGE_KEY } from '../../hooks/usePublicLayout'

vi.mock('../../hooks/usePhases', () => ({
  usePhases: vi.fn(),
}))

const usePhasesMock = vi.mocked(usePhasesHook.usePhases)

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/public" element={<PublicView />}>
          <Route index element={<div>Contenu terrains</div>} />
          <Route path="terrains/:court" element={<div>Contenu terrain</div>} />
          <Route path="matchs" element={<div>Contenu matchs</div>} />
          <Route path="classements" element={<div>Contenu classements</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  localStorage.clear()
})

describe('PublicView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    usePhasesMock.mockReturnValue({
      phases: [{ id: 'phase-1', type: 'POOL', name: 'Phase 1', order: 1 }],
      isLoading: false,
      errorMessage: null,
    })
  })

  it('should display an info message if no tournament is configured', () => {
    usePhasesMock.mockReturnValue({ phases: [], isLoading: false, errorMessage: null })

    renderAt('/public')

    expect(screen.getByText("Aucun tournoi n'est configuré pour le moment.")).toBeInTheDocument()
    expect(screen.queryByText('Contenu terrains')).not.toBeInTheDocument()
  })

  it('should display the header, the QR code and the current section content', () => {
    renderAt('/public')

    expect(screen.getByText('Suivi du tournoi')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'QR Code du tournoi' })).toBeInTheDocument()
    expect(screen.getByText('Contenu terrains')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Terrains' })).toHaveClass('Mui-selected')
  })

  it('should keep the courts section selected on a court detail page', () => {
    renderAt('/public/terrains/Terrain%201')

    expect(screen.getByText('Contenu terrain')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Terrains' })).toHaveClass('Mui-selected')
  })

  it('should navigate between sections', () => {
    renderAt('/public')

    fireEvent.click(screen.getByRole('button', { name: 'Classements' }))

    expect(screen.getByText('Contenu classements')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Classements' })).toHaveClass('Mui-selected')
    expect(screen.getByTestId('active-tab-indicator')).toHaveStyle({ transform: 'translateX(200%)' })

    fireEvent.click(screen.getByRole('button', { name: 'Matchs' }))

    expect(screen.getByText('Contenu matchs')).toBeInTheDocument()
  })

  describe('kiosk mode', () => {
    it('should come back to the courts after one minute without interaction once enabled', () => {
      vi.useFakeTimers()
      renderAt('/public/matchs?borne')

      act(() => {
        vi.advanceTimersByTime(40_000)
      })
      fireEvent.pointerDown(screen.getByText('Contenu matchs'))
      act(() => {
        vi.advanceTimersByTime(40_000)
      })

      expect(screen.getByText('Contenu matchs')).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(20_000)
      })

      expect(screen.getByText('Contenu terrains')).toBeInTheDocument()
    })

    it('should remember the kiosk mode on the device', () => {
      vi.useFakeTimers()
      localStorage.setItem(KIOSK_MODE_STORAGE_KEY, 'true')
      renderAt('/public/classements')

      act(() => {
        vi.advanceTimersByTime(60_000)
      })

      expect(screen.getByText('Contenu terrains')).toBeInTheDocument()
    })

    it('should not come back automatically on personal devices', () => {
      vi.useFakeTimers()
      renderAt('/public/matchs')

      act(() => {
        vi.advanceTimersByTime(120_000)
      })

      expect(screen.getByText('Contenu matchs')).toBeInTheDocument()
    })
  })
})
