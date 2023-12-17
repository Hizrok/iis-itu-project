import { Autocomplete, InputLabel, TextField } from "@mui/material";
import { Activity } from "../../components/common/Types/Course";
import { useEffect, useState } from "react";
import InstanceList from "./InstanceList";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

type ActivityDetailProps = {
  course: string;
  activity: Activity;
  selected: boolean;
};

const ActivityDetail = ({
  course,
  activity,
  selected,
}: ActivityDetailProps) => {

  const [type, setType] = useState(activity.type);
  const [recurrence, setRecurrence] = useState(activity.recurrence);
  const [capacity, setCapacity] = useState(activity.capacity.toString());
  //const [duration, setDuration] = useState(activity.duration);
  const [duration, setDuration] = useState<Dayjs | null>(dayjs(activity.duration, "HH:mm:ss"));
  const [lecturers, setLecturers] = useState<string[]>(activity.lecturers);

  const [selectedLecturer, setSelectedLecturer] = useState("");

  useEffect(() => {
    setLecturers(activity.lecturers);
  }, []);

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
    <div>
      {selected && (
        <div>
          <InputLabel>Typ</InputLabel>
          <Autocomplete
            disabled
            value={type}
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
            disabled
            value={recurrence}
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
            disabled
            margin="normal"
            label="Kapacity"
            fullWidth
            variant="outlined"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker 
              disabled  
              label="Duration" 
              value={duration}
              onChange={(newValue) => setDuration(newValue)}
              ampm={false}
              slotProps={{ textField: { fullWidth: true } }}
              />
          </LocalizationProvider>
          <InputLabel>Lecturers</InputLabel>
          <Autocomplete
            disabled
            value={selectedLecturer}
            onChange={(event: any, newValue: string | null) => {
              console.log(event);
              setSelectedLecturer(newValue? newValue : '');
            }}
            id="controllable-states-type"
            options={[]}
            fullWidth
            renderInput={(params) => <TextField {...params} />}
            />
          <InstanceList
            course={course}
            activity={activity}
            lecturers={lecturers}
          />
        </div>
      )}
    </div>
  );
};

export default ActivityDetail;
