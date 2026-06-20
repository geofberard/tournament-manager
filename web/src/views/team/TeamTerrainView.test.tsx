import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TeamTerrainView } from './TeamTerrainView'

describe('TeamTerrainView', () => {
  it('should display the terrain map', () => {
    render(<TeamTerrainView />)

    expect(screen.getByRole('img', { name: 'Plan du terrain' })).toHaveAttribute('src', expect.stringContaining('map.png'))
  })
})
