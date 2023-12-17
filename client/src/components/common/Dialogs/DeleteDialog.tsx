import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteConfirmationModalProps from './DeleteModalInterface';

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onDelete,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Smazat uživatele</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Opravdu chcete smazat tohoto uživatele? Tato akce je nevratná.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Zrušit
        </Button>
        <Button onClick={onDelete} color="secondary">
          Smazat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;