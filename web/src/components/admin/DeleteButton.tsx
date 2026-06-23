import DeleteIcon from '@mui/icons-material/Delete'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material'
import type { MouseEvent } from 'react'
import { useState } from 'react'
import { UserFacingError } from '../../services/apiError'

type DeleteButtonProps = {
  ariaLabel?: string
  onConfirm: () => Promise<void> | void
}

export const DeleteButton = ({ ariaLabel = 'Supprimer', onConfirm }: DeleteButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const stopParentClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const openDialog = (event: MouseEvent<HTMLButtonElement>) => {
    stopParentClick(event)
    setDeleteError(null)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setDeleteError(null)
    setIsDialogOpen(false)
  }

  const confirmDelete = async () => {
    setDeleteError(null)
    setIsDeleting(true)

    try {
      await onConfirm()
      closeDialog()
    } catch (error) {
      setDeleteError(
        error instanceof UserFacingError
          ? error.message
          : 'Impossible de supprimer pour le moment.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <IconButton
        aria-label={ariaLabel}
        onClick={openDialog}
        onMouseDown={stopParentClick}
        size="small"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      <Dialog
        aria-labelledby="delete-dialog-title"
        onClick={(event) => event.stopPropagation()}
        onClose={isDeleting ? undefined : closeDialog}
        open={isDialogOpen}
      >
        <DialogTitle id="delete-dialog-title">Supprimer ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Confirmez-vous la suppression ?</DialogContentText>
          {deleteError ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button disabled={isDeleting} onClick={closeDialog}>
            Annuler
          </Button>
          <Button color="error" disabled={isDeleting} onClick={confirmDelete} variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
