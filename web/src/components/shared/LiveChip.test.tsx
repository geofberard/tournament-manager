import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LiveChip } from './LiveChip'

afterEach(() => {
  cleanup()
})

describe('LiveChip', () => {
  it('should display the default live label', () => {
    render(<LiveChip />)

    expect(screen.getByText('En direct').closest('.MuiChip-root')).toHaveClass('MuiChip-colorSuccess')
  })

  it('should accept a custom label', () => {
    render(<LiveChip label="Live" sx={{ height: 20 }} />)

    expect(screen.getByText('Live')).toBeInTheDocument()
  })
})
