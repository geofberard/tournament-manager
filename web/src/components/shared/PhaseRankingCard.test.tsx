import { render, screen } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { describe, expect, it, vi } from 'vitest'
import { PhaseRankingCard } from './PhaseRankingCard'
import * as statisticsService from '../../services/statisticsService'

vi.mock('../../services/statisticsService', () => ({ getPhaseStatistics: vi.fn() }))

describe('PhaseRankingCard', () => {
  it('renders the phase name and ranking', async () => {
    vi.mocked(statisticsService.getPhaseStatistics).mockResolvedValue({
      completionRate: 1,
      gameCount: 1,
      teams: [{ id: 'team-1', name: 'Aigles' }],
      teamStats: [{
        contestant: { id: 'team-1', name: 'Aigles' },
        played: 1, won: 1, drawn: 0, lost: 0, score: 3,
        pointsFor: 21, pointsAgainst: 10, pointsDiff: 11,
      }],
    })

    render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <PhaseRankingCard phase={{ id: 'phase-1', name: 'Poule A', order: 1, type: 'POOL' }} />
      </SWRConfig>,
    )
    expect(screen.getByText('Poule A')).toBeInTheDocument()
    expect(await screen.findByText('Aigles')).toBeInTheDocument()
    expect(statisticsService.getPhaseStatistics).toHaveBeenCalledWith('phase-1')
  })

  it('can render extended statistics and highlight the current team', async () => {
    vi.mocked(statisticsService.getPhaseStatistics).mockResolvedValue({
      completionRate: 1,
      gameCount: 1,
      teams: [{ id: 'team-1', name: 'Aigles' }],
      teamStats: [{
        contestant: { id: 'team-1', name: 'Aigles' },
        played: 1, won: 1, drawn: 0, lost: 0, score: 3,
        pointsFor: 21, pointsAgainst: 10, pointsDiff: 11,
      }],
    })

    render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <PhaseRankingCard
          currentTeamId="team-1"
          extended
          phase={{ id: 'phase-1', name: 'Poule A', order: 1, type: 'POOL' }}
        />
      </SWRConfig>,
    )

    expect(await screen.findByRole('columnheader', { name: 'Marqués' })).toBeInTheDocument()
    expect(screen.getByRole('row', { name: /1 Aigles 1 1 0 0 3 21 10 11/ })).toHaveClass('Mui-selected')
  })
})
