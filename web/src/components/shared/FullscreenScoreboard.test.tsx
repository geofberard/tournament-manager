import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FullscreenScoreboard } from './FullscreenScoreboard'
import type { Team } from '../../services/apiClient'

const contestants: Team[] = [
  { id: 'team-1', name: 'Équipe Bleue' },
  { id: 'team-2', name: 'Équipe Rouge' },
]

const theme = createTheme()

const scores: Record<string, number> = {
  'team-1': 14,
  'team-2': 18,
}

const renderScoreboard = (props: Partial<Parameters<typeof FullscreenScoreboard>[0]> = {}) => {
  const defaultProps = {
    contestants,
    switchSides: false,
    scores,
    lastTeamPoint: null,
    onChangeScore: vi.fn(),
    onSwitchSides: vi.fn(),
    onClose: vi.fn(),
  }
  const merged = { ...defaultProps, ...props }

  render(
    <ThemeProvider theme={theme}>
      <FullscreenScoreboard {...merged} />
    </ThemeProvider>,
  )

  return merged
}

describe('FullscreenScoreboard', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('should render both team names and their respective scores in separate blocks', () => {
    renderScoreboard()

    expect(screen.getByTestId('fullscreen-scoreboard')).toBeInTheDocument()
    expect(screen.getByText('Équipe Bleue')).toBeInTheDocument()
    expect(screen.getByText('Équipe Rouge')).toBeInTheDocument()
    expect(screen.getByTestId('score-team-1')).toHaveTextContent('14')
    expect(screen.getByTestId('score-team-2')).toHaveTextContent('18')
  })

  it('should display fallback score 0 when team score is not recorded yet', () => {
    renderScoreboard({ scores: {} })

    expect(screen.getByTestId('score-team-1')).toHaveTextContent('0')
    expect(screen.getByTestId('score-team-2')).toHaveTextContent('0')
  })

  it('should add a point when tapping a team block', () => {
    const { onChangeScore } = renderScoreboard()

    fireEvent.click(screen.getByRole('button', { name: /ajouter un point à équipe rouge/i }))

    expect(onChangeScore).toHaveBeenCalledWith('team-2', 1)
  })

  it('should remove a point with the minus button without adding one', () => {
    const { onChangeScore } = renderScoreboard()

    fireEvent.click(screen.getByRole('button', { name: /retirer un point à équipe bleue/i }))

    expect(onChangeScore).toHaveBeenCalledTimes(1)
    expect(onChangeScore).toHaveBeenCalledWith('team-1', -1)
  })

  it('should disable the minus button when the score is 0', () => {
    renderScoreboard({ scores: { 'team-1': 0, 'team-2': 3 } })

    expect(screen.getByRole('button', { name: /retirer un point à équipe bleue/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /retirer un point à équipe rouge/i })).toBeEnabled()
  })

  it('should highlight the team that scored the last point', () => {
    renderScoreboard({ lastTeamPoint: 'team-2' })

    expect(screen.getByTestId('last-point-team-2')).toBeInTheDocument()
    expect(screen.queryByTestId('last-point-team-1')).not.toBeInTheDocument()
  })

  it('should call onSwitchSides when clicking the switch sides button', () => {
    const { onSwitchSides, onChangeScore } = renderScoreboard()

    fireEvent.click(screen.getByRole('button', { name: /changer de côté/i }))

    expect(onSwitchSides).toHaveBeenCalledTimes(1)
    expect(onChangeScore).not.toHaveBeenCalled()
  })

  it('should swap block positions but keep each team color when switchSides is true', () => {
    renderScoreboard({ switchSides: true })

    const blocks = screen.getAllByTestId(/^scoreboard-block-/)
    expect(blocks.map((block) => block.dataset.testid)).toEqual([
      'scoreboard-block-team-2',
      'scoreboard-block-team-1',
    ])
    expect(screen.getByTestId('scoreboard-block-team-1')).toHaveStyle({ backgroundColor: theme.palette.primary.main })
    expect(screen.getByTestId('scoreboard-block-team-2')).toHaveStyle({ backgroundColor: theme.palette.secondary.main })
  })

  it('should call onClose when clicking the exit fullscreen button', () => {
    const { onClose } = renderScoreboard()

    fireEvent.click(screen.getByRole('button', { name: /quitter le mode plein écran/i }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when pressing Escape', () => {
    const { onClose } = renderScoreboard()

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
