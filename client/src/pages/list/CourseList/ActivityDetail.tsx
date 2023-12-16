import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Activity } from "../../../components/common/Types/Course";
import { useEffect, useState } from "react";
import InstanceList from "./InstanceList";
import axios from "axios";
import { useAuthHeader } from "react-auth-kit";

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

  const [type, setType] = useState(activity.type);
  const [recurrence, setRecurrence] = useState(activity.recurrence);
  const [capacity, setCapacity] = useState(activity.capacity.toString());
  const [duration, setDuration] = useState(activity.duration);
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
      .catch((err) => console.error(err.message));
  };

  const handleEdit = (e: any) => {
    e.stopPropagation();
    editActivity(type, recurrence, parseInt(capacity), duration);
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    deleteActivity(activity.id);
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
      .catch((err) => console.error(err.message));
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
      .catch((err) => console.error(err.message));
  };

  useEffect(() => {
    getLecturers();
  }, []);

  return (
    <div>
      <div className="toggleble-list-item">
        <p>{activity.type}</p>
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
          <InputLabel>Lecturers</InputLabel>
          <Select
            className="role-select"
            value={selectedLecturer}
            onChange={(e) => setSelectedLecturer(e.target.value)}
          >
            {allLecturers.map((lecturer: string) => (
              <MenuItem key={lecturer} value={lecturer}>
                {lecturer}
              </MenuItem>
            ))}
          </Select>
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
