import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Activity } from "../../../components/common/Types/Course";
import { useState } from "react";

type ActivityDetailProps = {
  activity: Activity;
  selected: boolean;
  editActivity: Function;
  deleteActivity: Function;
};

const ActivityDetail = ({
  activity,
  selected,
  editActivity,
  deleteActivity,
}: ActivityDetailProps) => {
  const [type, setType] = useState(activity.type);
  const [recurrence, setRecurrence] = useState(activity.recurrence);
  const [capacity, setCapacity] = useState(activity.capacity.toString());
  const [duration, setDuration] = useState(activity.duration);

  const handleEdit = (e: any) => {
    e.stopPropagation();
    editActivity(type, recurrence, parseInt(capacity), duration);
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    deleteActivity(activity.id);
  };

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
        </div>
      )}
    </div>
  );
};

export default ActivityDetail;
