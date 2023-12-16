import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

type CreateRoomDialogProps = {
  showDialog: boolean;
  toggleDialog: Function;
  createRoom: Function;
};

const CreateRoomDialog = ({
  showDialog,
  toggleDialog,
  createRoom,
}: CreateRoomDialogProps) => {
  const [disabled, setDisabled] = useState(false);

  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState(0);
  const [number, setNumber] = useState(0);
  const [capacity, setCapacity] = useState(0);

  const handleCreateUser = async () => {
    setDisabled(true);
    await toast.promise(
      createRoom(building, floor, number, capacity),
      {
        pending: 'Místnost se tvoří',
        success: 'Místnost vytvořen',
        error: 'Problém s tvorbou místnosti'
      }
    );
    setDisabled(false);
    toggleDialog(false);

    setBuilding("");
    setFloor(0);
    setNumber(0);
    setCapacity(0);
  };

  return (
    <Dialog open={showDialog} onClose={() => toggleDialog(false)}>
      <DialogTitle>Vytvořit místnost</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          disabled={disabled}
          margin="dense"
          label="Building"
          fullWidth
          variant="outlined"
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
        />
        <TextField
          autoFocus
          disabled={disabled}
          margin="dense"
          label="Floor"
          fullWidth
          variant="outlined"
          value={floor}
          onChange={(e) => setFloor(parseInt(e.target.value))}
        />
        <TextField
          autoFocus
          disabled={disabled}
          margin="dense"
          label="Number"
          fullWidth
          variant="outlined"
          value={number}
          onChange={(e) => setNumber(parseInt(e.target.value))}
        />
        <TextField
          autoFocus
          disabled={disabled}
          margin="dense"
          label="Capacity"
          fullWidth
          variant="outlined"
          value={capacity}
          onChange={(e) => setCapacity(parseInt(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => toggleDialog(false)}
          disabled={disabled}
        >
          Zrušit
        </Button>
        <Button
          variant="outlined"
          onClick={handleCreateUser}
          disabled={disabled}
        >
          Vytvořit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoomDialog;
