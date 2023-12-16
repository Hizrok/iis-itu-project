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

type CreateInstanceDialogProps = {
  rooms: string[];
  lecturers: string[];
  showDialog: boolean;
  toggleDialog: Function;
  createInstance: Function;
};

const CreateInstanceDialog = ({
  rooms,
  lecturers,
  showDialog,
  toggleDialog,
  createInstance,
}: CreateInstanceDialogProps) => {
  const [disabled, setDisabled] = useState(false);

  const [room, setRoom] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [day, setDay] = useState("pondělí");
  const [startTime, setStartTime] = useState("08:00:00");

  const handleCreateInstance = () => {
    setDisabled(true);
    createInstance(room, lecturer, day, startTime);
    setDisabled(false);
    toggleDialog(false);

    setRoom("");
    setLecturer("");
    setDay("pondělí");
    setStartTime("08:00:00");
  };

  return (
    <Dialog open={showDialog} onClose={() => toggleDialog(false)}>
      <DialogTitle>Vytvořit instanci</DialogTitle>
      <DialogContent>
        <InputLabel>room</InputLabel>
        <Select
          className="role-select"
          fullWidth
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        >
          {rooms.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </Select>
        <InputLabel>lecturer</InputLabel>
        <Select
          className="role-select"
          fullWidth
          value={lecturer}
          onChange={(e) => setLecturer(e.target.value)}
        >
          {lecturers.map((l) => (
            <MenuItem key={l} value={l}>
              {l}
            </MenuItem>
          ))}
        </Select>
        <InputLabel>day</InputLabel>
        <Select
          className="role-select"
          fullWidth
          value={day}
          onChange={(e) => setDay(e.target.value)}
        >
          <MenuItem value={"pondělí"}>pondělí</MenuItem>
          <MenuItem value={"úterý"}>úterý</MenuItem>
          <MenuItem value={"středa"}>středa</MenuItem>
          <MenuItem value={"čtvrtek"}>čtvrtek</MenuItem>
          <MenuItem value={"pátek"}>pátek</MenuItem>
        </Select>
        <TextField
          margin="dense"
          label="Start time"
          fullWidth
          variant="outlined"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
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
          onClick={handleCreateInstance}
          disabled={disabled}
        >
          Vytvořit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateInstanceDialog;
