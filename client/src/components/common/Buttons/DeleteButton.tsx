import React, { useState } from 'react';
import Button from '@mui/material/Button';
import DeleteButtonProps from './DeleteButtonProps';
import DeleteConfirmationModal from '../Dialogs/DeleteDialog';


const DeleteButton: React.FC<DeleteButtonProps> = ({ user, onDelete }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete();
    handleCloseDeleteModal();
  };

  return (
    <div>
      <Button color="error" variant = "outlined" onClick={handleDeleteClick}>
        Smazat
      </Button>

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default DeleteButton;
