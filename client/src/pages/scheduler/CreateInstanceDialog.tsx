// @author Tomáš Vlach
// @author Jan Kapsa

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { toast } from "react-toastify";

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
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs("08:00:00", "HH:mm:ss"));

  const handleCreateInstance = async () => {
    setDisabled(true);
    await toast.promise(
      createInstance(room, lecturer, day, startTime),
      {
        pending: 'Instance se tvoří',
        success: 'Instance vytvořen',
        error: 'Problém s tvorbou instance'
      }
    );
    setDisabled(false);
    toggleDialog(false);

    setRoom("");
    setLecturer("");
    setDay("pondělí");
    setStartTime(dayjs("08:00:00", "HH:mm:ss"));
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker 
              label="Start Time" 
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              ampm={false}
              slotProps={{ textField: { fullWidth: true } }}
              />
          </LocalizationProvider>
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
