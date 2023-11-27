import React, { useState } from "react";
import "../../../styles/style.css";
import {
  Button,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import DeleteButton from "../../../components/common/Buttons/DeleteButton";
import ActivityDetailProps from "./ActivityDetailProps";

const ActivityDetail: React.FC<ActivityDetailProps> = (props) => {
  const { selectedActivity, onEditActivity, onDeleteActivity } = props;
  const [isEditing, setIsEditing] = useState(false);

  const [editedType, setEditedType] = useState(selectedActivity.type);
  const [editedRecurrence, setEditedRecurrence] = useState(selectedActivity.recurrence);
  const [editedDuration, setEditedDuration] = useState(selectedActivity.duration);
  const [editedCapacity, setEditedCapacity] = useState(selectedActivity.capacity);

  const handleEditClick = () => {
    setEditedType(selectedActivity.type);
    setEditedRecurrence(selectedActivity.recurrence);
    setEditedDuration(selectedActivity.duration);
    setEditedCapacity(selectedActivity.capacity);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    selectedActivity.type = editedType;
    selectedActivity.recurrence = editedRecurrence;
    selectedActivity.duration = editedDuration;
    selectedActivity.capacity = editedCapacity;
    onEditActivity(selectedActivity);
  };

  const handleDeleteClick = () => {
    onDeleteActivity(selectedActivity);
  };

  return (
    <div className="user-detail-container">
      <div className="purple-bar"></div>
      <div className="user-detail-properties">
        <p>Typ:</p>{" "}
        {isEditing ? (
          <><Select
          type="text"
          value={editedType}
          onChange={(e) => {
            setEditedType(e.target.value);
          }}
        >
          <MenuItem value="přednáška">přednáška</MenuItem>
          <MenuItem value="cvičení">cvičení</MenuItem>
          <MenuItem value="laboratoř">laboratoř</MenuItem>
          <MenuItem value="democvičení">democvičení</MenuItem>
          <MenuItem value="seminář">seminář</MenuItem>
        </Select></>
        ) : (
          <p>{selectedActivity.type}</p>
        )}
        <p>Rekurence:</p>{" "}
        {isEditing ? (
          <><Select
            type="text"
            value={editedRecurrence}
            onChange={(e) => {
              setEditedRecurrence(e.target.value);
            } }
          >
            <MenuItem value="každý">každý</MenuItem>
            <MenuItem value="lichý">lichý</MenuItem>
            <MenuItem value="sudý">sudý</MenuItem>
            <MenuItem value="jednorázová aktivita">jednorázová aktivita</MenuItem>
          </Select></>
        ) : (
          <p>{selectedActivity.recurrence}</p>
        )}
        <p>Trvání:</p>{" "}
        {isEditing ? (
          <TextField
            type="text"
            value={editedDuration}
            onChange={(e) => setEditedDuration(e.target.value)}
          />
        ) : (
          <p>{selectedActivity.duration}</p>
        )}
        <p>Kapacita:</p>{" "}
        {isEditing ? (
          <TextField
            type="text"
            value={editedCapacity}
            onChange={(e) => setEditedCapacity(parseInt(e.target.value))}
          />
        ) : (
          <p>{selectedActivity.capacity}</p>
        )}
        {isEditing ? (
          <Button variant="outlined" color="success" onClick={handleSaveClick}>Uložit</Button>
        ) : (
          <Button variant="outlined" onClick={handleEditClick}>Upravit</Button>
        )}
        <DeleteButton onDelete={handleDeleteClick}/>
      </div>
    </div>
  );
};

export default ActivityDetail;
