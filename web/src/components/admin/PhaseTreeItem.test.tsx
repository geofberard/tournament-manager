import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { PhaseNode } from '../../hooks/usePhaseTree'
import { PhaseTreeItem } from './PhaseTreeItem'

const node: PhaseNode = {
  phase: { id: 'root', name: 'Phase finale', order: 1 },
  subPhases: [
    {
      phase: { id: 'main', name: 'Principale', order: 1, parentId: 'root' },
      subPhases: undefined,
    },
  ],
}

describe('PhaseTreeItem', () => {
  afterEach(cleanup)

  const renderTreeItem = () => {
    const onDelete = vi.fn()
    const onEdit = vi.fn()
    render(<PhaseTreeItem node={node} onDelete={onDelete} onEdit={onEdit} />)
    return { onDelete, onEdit }
  }

  it('should recursively display and collapse sub-phases', async () => {
    renderTreeItem()

    expect(screen.getByText('Principale')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Réduire Phase finale' }))
    await waitFor(() => expect(screen.queryByText('Principale')).not.toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: 'Développer Phase finale' }))
    expect(await screen.findByText('Principale')).toBeInTheDocument()
  })

  it('should expose the selected phase when editing', () => {
    const { onEdit } = renderTreeItem()

    fireEvent.click(screen.getByRole('button', { name: 'Editer Principale' }))

    expect(onEdit).toHaveBeenCalledWith(node.subPhases?.[0].phase)
  })

  it('should expose the selected phase after confirming deletion', async () => {
    const { onDelete } = renderTreeItem()
    fireEvent.click(screen.getByRole('button', { name: 'Supprimer Principale' }))

    const dialog = screen.getByRole('dialog', { name: 'Supprimer ?' })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    await waitFor(() => expect(onDelete).toHaveBeenCalledWith(node.subPhases?.[0].phase))
  })
})
