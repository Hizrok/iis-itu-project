import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";

type CreateActivityDialogProps = {
  showDialog: boolean;
  toggleDialog: Function;
  createActivity: Function;
};

const CreateActivityDialog = ({
  showDialog,
  toggleDialog,
  createActivity,
}: CreateActivityDialogProps) => {
  const [disabled, setDisabled] = useState(false);

  const [type, setType] = useState("přednáška");
  const [recurrence, setRecurrence] = useState("každý");
  const [capacity, setCapacity] = useState("");
  const [duration, setDuration] = useState("");

  const handleCreateActivity = () => {
    setDisabled(true);
    createActivity(type, recurrence, parseInt(capacity), duration);
    setDisabled(false);
    toggleDialog(false);

    setType("");
    setRecurrence("");
    setCapacity("");
    setDuration("");
  };

  return (
    <Dialog open={showDialog} onClose={() => toggleDialog(false)}>
      <DialogTitle>Vytvořit předmět</DialogTitle>
      <DialogContent>
        <InputLabel>Typ</InputLabel>
        <Select
          className="role-select"
          fullWidth
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value={"přednáška"}>přednáška</MenuItem>
          <MenuItem value={"cvičení"}>cvičení</MenuItem>
        </Select>
        <InputLabel>Recurence</InputLabel>
        <Select
          className="role-select"
          fullWidth
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value)}
        >
          <MenuItem value={"každý"}>každý</MenuItem>
          <MenuItem value={"sudý"}>sudý</MenuItem>
          <MenuItem value={"lichý"}>lichý</MenuItem>
        </Select>
        <TextField
          margin="dense"
          label="Kapacita"
          fullWidth
          variant="outlined"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Duration"
          fullWidth
          variant="outlined"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
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
          onClick={handleCreateActivity}
          disabled={disabled}
        >
          Vytvořit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateActivityDialog;
