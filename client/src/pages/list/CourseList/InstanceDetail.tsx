import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Instance } from "../../../components/common/Types/Course";
import { useState } from "react";

type InstanceDetailProps = {
  instance: Instance;
  selected: boolean;
  lecturers: string[];
  rooms: string[];
  editInstance: Function;
  deleteInstance: Function;
};

const InstanceDetail = ({
  instance,
  selected,
  lecturers,
  rooms,
  editInstance,
  deleteInstance,
}: InstanceDetailProps) => {
  const [room, setRoom] = useState(instance.room ? instance.room : "");
  const [lecturer, setLecturer] = useState(
    instance.lecturer ? instance.lecturer : ""
  );
  const [day, setDay] = useState(instance.day);
  const [startTime, setStartTime] = useState(instance.start_time);

  const handleEdit = (e: any) => {
    e.stopPropagation();
    editInstance(room, lecturer, day, startTime);
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    deleteInstance(instance.id);
  };

  return (
    <div>
      <div className="toggleble-list-item">
        <p>{instance.id}</p>
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
        </div>
      )}
    </div>
  );
};

export default InstanceDetail;
