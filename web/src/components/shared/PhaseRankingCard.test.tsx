import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PhaseRankingCard } from './PhaseRankingCard'
import * as phaseRankingsHook from '../../hooks/usePhaseRankings'

vi.mock('../../hooks/usePhaseRankings', () => ({ usePhaseRankings: vi.fn() }))

describe('PhaseRankingCard', () => {
  it('renders the phase name and ranking', () => {
    vi.mocked(phaseRankingsHook.usePhaseRankings).mockReturnValue({
      errorMessage: null,
      isLoading: false,
      rankings: [{
        contestant: { id: 'team-1', name: 'Aigles' },
        played: 1, won: 1, drawn: 0, lost: 0, score: 3,
        pointsFor: 21, pointsAgainst: 10, pointsDiff: 11,
      }],
    })

    render(<PhaseRankingCard phaseId="phase-1" phaseName="Poule A" />)
    expect(screen.getByText('Poule A')).toBeInTheDocument()
    expect(screen.getByText('Aigles')).toBeInTheDocument()
  })
})
