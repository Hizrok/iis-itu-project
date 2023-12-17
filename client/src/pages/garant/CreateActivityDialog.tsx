// @author Tomáš Vlach
// @author Jan Kapsa

import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  TextField,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { toast } from "react-toastify";

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
  const [duration, setDuration] = useState<Dayjs | null>(dayjs("00:00:00", "HH:mm:ss"));

  const handleCreateActivity = async () => {
    setDisabled(true);
    await toast.promise(
      createActivity(type, recurrence, parseInt(capacity), duration),
      {
        pending: 'Aktivita se tvoří',
        success: 'Aktivita vytvořen',
        error: 'Problém s tvorbou aktivity'
      }
    );
    setDisabled(false);
    toggleDialog(false);

    setType("");
    setRecurrence("");
    setCapacity("");
    setDuration(dayjs("00:00:00", "HH:mm:ss"));
  };

  const TypeOptions = [
    'přednáška',
    'cvičení',
    'laboratoř',
    'democvičení',
    'seminář'
  ]

  const RecurrenceOptions = [
    'každý',
    'sudý',
    'lichý'
  ]

  return (
    <Dialog open={showDialog} onClose={() => toggleDialog(false)}>
      <DialogTitle>Vytvořit předmět</DialogTitle>
      <DialogContent>
        <InputLabel>Typ</InputLabel>
        <Autocomplete
            value={type}
            disabled={disabled}
            onChange={(event: any, newValue: string | null) => {
              console.log(event);
              setType(newValue? newValue : type);
            }}
            id="controllable-states-type"
            options={TypeOptions}
            fullWidth
            renderInput={(params) => <TextField {...params} />}
            />
        <InputLabel>Recurence</InputLabel>
        <Autocomplete
            value={recurrence}
            disabled={disabled}
            onChange={(event: any, newValue: string | null) => {
              console.log(event);
              setRecurrence(newValue? newValue : recurrence);
            }}
            id="controllable-states-type"
            options={RecurrenceOptions}
            fullWidth
            renderInput={(params) => <TextField {...params} />}
            />
        <TextField
          margin="dense"
          label="Kapacita"
          fullWidth
          variant="outlined"
          value={capacity}
          disabled={disabled}
          onChange={(e) => setCapacity(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker 
              label="Duration" 
              value={duration}
              disabled={disabled}
              onChange={(newValue) => setDuration(newValue)}
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
