// @author Tomáš Vlach
// @author Jan Kapsa

import { Autocomplete, Button, InputLabel, TextField } from "@mui/material";
import { Activity } from "../../../components/common/Types/Course";
import { useEffect, useState } from "react";
import InstanceList from "./InstanceList";
import axios from "axios";
import { useAuthHeader } from "react-auth-kit";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useConfirm } from "material-ui-confirm";
import { toast } from "react-toastify";

type ActivityDetailProps = {
  course: string;
  activity: Activity;
  selected: boolean;
  editActivity: Function;
  deleteActivity: Function;
};

const ActivityDetail = ({
  course,
  activity,
  selected,
  editActivity,
  deleteActivity,
}: ActivityDetailProps) => {
  const authHeader = useAuthHeader();
  const confirm = useConfirm();

  const [type, setType] = useState(activity.type);
  const [recurrence, setRecurrence] = useState(activity.recurrence);
  const [capacity, setCapacity] = useState(activity.capacity.toString());
  //const [duration, setDuration] = useState(activity.duration);
  const [duration, setDuration] = useState<Dayjs | null>(dayjs(activity.duration, "HH:mm:ss"));
  const [lecturers, setLecturers] = useState<string[]>(activity.lecturers);

  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [allLecturers, setAllLecturers] = useState<string[]>([]);

  const getLecturers = async () => {
    await axios
      .get(`${import.meta.env.VITE_SERVER_HOST}users/lecturers`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        setAllLecturers(
          res.data
            .map((l: any) => l.id)
            .filter((l: string) => !lecturers.includes(l))
        );
      })
      .catch(error => { console.error(error); throw error; });
  };

  const handleEdit = async (e: any) => {
    e.stopPropagation();
    await toast.promise(
      editActivity(type, recurrence, parseInt(capacity), duration),
      {
        pending: 'Aktivita se aktualizuje',
        success: 'Aktivita aktualizována',
        error: 'Problém s aktualizací aktivity'
      }
    );
    
  };

  const handleDelete = async (e: any) => {
    confirm({  description: "Chcete smazat aktivitu?", confirmationText: "Ano", cancellationText: "Ne", title: "Smazání aktivity", confirmationButtonProps: { color: "error" } })
      .then(async () => {
        e.stopPropagation();
        await toast.promise(
          deleteActivity(activity.id),
          {
            pending: 'Aktivita se maže',
            success: 'Aktivita smazána',
            error: 'Problém s mazáním aktivity'
          }
        );
      })
      .catch(() => {
      });
  };

  const handleAddLecturer = async () => {
    await axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}activities/${activity.id}`,
        {
          lecturer: selectedLecturer,
        },
        {
          headers: {
            Authorization: authHeader(),
          },
        }
      )
      .then((res) => {
        console.log(res.data.msg);
        setLecturers((oldLecturers) => {
          const newLecturers = [...oldLecturers];
          newLecturers.push(selectedLecturer);
          return newLecturers;
        });
        setAllLecturers(
          allLecturers.filter((lecturer) => lecturer !== selectedLecturer)
        );
        setSelectedLecturer("");
      })
      .catch(error => { console.error(error); throw error; });
  };

  const handleDeleteLecturer = async (lecturer: string) => {
    await axios
      .delete(
        `${import.meta.env.VITE_SERVER_HOST}activities/${
          activity.id
        }/${lecturer}`,
        {
          headers: {
            Authorization: authHeader(),
          },
        }
      )
      .then((res) => {
        console.log(res.data.msg);
        setAllLecturers((oldLecturers) => {
          const newLecturers = [...oldLecturers];
          newLecturers.push(lecturer);
          return newLecturers;
        });
        setLecturers(lecturers.filter((l) => l !== lecturer));
      })
      .catch(error => { console.error(error); throw error; });
  };

  useEffect(() => {
    getLecturers();
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
      <div className="toggleble-list-item">
        <Button variant="contained">{activity.type}</Button>
        <div className="detail-buttons">
          <Button variant="contained" disabled={!selected} onClick={handleEdit}>
            Save
          </Button>
          <Button variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
      {selected && (
        <div>
          <InputLabel>Typ</InputLabel>
          <Autocomplete
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
            margin="normal"
            label="Kapacity"
            fullWidth
            variant="outlined"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker 
              label="Duration" 
              value={duration}
              onChange={(newValue) => setDuration(newValue)}
              ampm={false}
              slotProps={{ textField: { fullWidth: true } }}
              />
          </LocalizationProvider>
          <InputLabel>Lecturers</InputLabel>
          <Autocomplete
            value={selectedLecturer}
            onChange={(event: any, newValue: string | null) => {
              console.log(event);
              setSelectedLecturer(newValue? newValue : '');
            }}
            id="controllable-states-type"
            options={allLecturers}
            fullWidth
            renderInput={(params) => <TextField {...params} />}
            />
          <Button variant="contained" onClick={handleAddLecturer}>
            Add lecturer
          </Button>
          <div>
            {lecturers.map((lecturer: string) => (
              <div
                key={lecturer}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <p>{lecturer}</p>
                <Button
                  variant="contained"
                  onClick={() => handleDeleteLecturer(lecturer)}
                >
                  delete lecturer
                </Button>
              </div>
            ))}
          </div>
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
