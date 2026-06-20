import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TeamBuvetteView } from './TeamBuvetteView'

describe('TeamBuvetteView', () => {
  it('should display the food menu', () => {
    render(<TeamBuvetteView />)

    const foodMenu = screen.getByRole('img', { name: 'Menu de la buvette' })

    expect(foodMenu).toHaveAttribute(
      'src',
      expect.stringContaining('food.png'),
    )
    expect(foodMenu).toHaveStyle({ maxHeight: '70vh', maxWidth: '600px', width: '100%' })
  })
})
