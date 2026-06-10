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

type DeleteButtonProps = {
  onConfirm: () => Promise<void> | void
}

export const DeleteButton = ({ onConfirm }: DeleteButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(false)

  const stopParentClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const openDialog = (event: MouseEvent<HTMLButtonElement>) => {
    stopParentClick(event)
    setDeleteError(false)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setDeleteError(false)
    setIsDialogOpen(false)
  }

  const confirmDelete = async () => {
    setDeleteError(false)
    setIsDeleting(true)

    try {
      await onConfirm()
      closeDialog()
    } catch {
      setDeleteError(true)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <IconButton
        aria-label="Supprimer"
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
              Impossible de supprimer pour le moment.
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
