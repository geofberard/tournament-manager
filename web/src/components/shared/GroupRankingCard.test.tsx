import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { GroupRankingCard } from './GroupRankingCard'
import * as useGroupRankingsHook from '../../hooks/useGroupRankings'

vi.mock('../../hooks/useGroupRankings', () => ({
  useGroupRankings: vi.fn(),
}))

const useGroupRankingsMock = vi.mocked(useGroupRankingsHook.useGroupRankings)

describe('GroupRankingCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the group name and a ranking table', () => {
    useGroupRankingsMock.mockReturnValue({
      isLoading: false,
      errorMessage: null,
      rankings: [
        {
          contestant: { id: 'team-1', name: 'Aigles' },
          played: 3,
          won: 2,
          drawn: 0,
          lost: 1,
          score: 6,
          pointsFor: 63,
          pointsAgainst: 51,
          pointsDiff: 12,
        },
      ],
    })

    render(<GroupRankingCard groupId="Poule A" phaseId="phase-1" />)

    expect(screen.getByText('Groupe Poule A')).toBeInTheDocument()
    expect(screen.getByText('Aigles')).toBeInTheDocument()
  })

  it('should display an error if ranking fails', () => {
    useGroupRankingsMock.mockReturnValue({
      isLoading: false,
      errorMessage: 'Erreur de chargement',
      rankings: [],
    })

    render(<GroupRankingCard groupId="Poule A" phaseId="phase-1" />)

    expect(screen.getByText('Erreur de chargement')).toBeInTheDocument()
  })
})
