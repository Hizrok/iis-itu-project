import React, { useState } from "react";
import "../../../styles/style.css";
import {
  Button,
  TextField
} from "@mui/material";
import DeleteButton from "../../../components/common/Buttons/DeleteButton";
import RoomDetailProps from "./RoomDetailProps";

const UserDetail: React.FC<RoomDetailProps> = (props) => {
  const { selectedRoom, onEditRoom, onDeleteRoom } = props;
  const [isEditing, setIsEditing] = useState(false);

  const [editedBuilding, setEditedBuilding] = useState(selectedRoom.building);
  const [editedFloor, setEditedFloor] = useState(selectedRoom.floor);
  const [editedNumber, setEditedNumber] = useState(selectedRoom.number);
  const [editedCapacity, setEditedCapacity] = useState(selectedRoom.capacity);

  const handleEditClick = () => {
    setEditedBuilding(selectedRoom.building);
    setEditedFloor(selectedRoom.floor);
    setEditedNumber(selectedRoom.number);
    setEditedCapacity(selectedRoom.capacity);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    selectedRoom.building = editedBuilding;
    selectedRoom.floor = editedFloor;
    selectedRoom.number = editedNumber;
    selectedRoom.capacity = editedCapacity;
    onEditRoom(selectedRoom);
  };

  const handleDeleteClick = () => {
    onDeleteRoom(selectedRoom);
  };

  return (
    <div className="user-detail-container">
      <div className="purple-bar"></div>
      <div className="user-detail-properties">
        <p>Budova:</p>{" "}
        {isEditing ? (
          <TextField
            type="text"
            value={editedBuilding}
            onChange={(e) => setEditedBuilding(e.target.value)}
          />
        ) : (
          <p>{selectedRoom.building}</p>
        )}
        <p>Patro:</p>{" "}
        {isEditing ? (
          <TextField
            type="text"
            value={editedFloor}
            onChange={(e) => setEditedFloor(e.target.value)}
          />
        ) : (
          <p>{selectedRoom.floor}</p>
        )}
        <p>Číslo:</p>{" "}
        {isEditing ? (
          <TextField
            type="text"
            value={editedNumber}
            onChange={(e) => setEditedNumber(e.target.value)}
          />
        ) : (
          <p>{selectedRoom.number}</p>
        )}
        <p>Kapacita:</p>{" "}
        {isEditing ? (
          <TextField
            type="text"
            value={editedCapacity}
            onChange={(e) => setEditedCapacity(e.target.value)}
          />
        ) : (
          <p>{selectedRoom.capacity}</p>
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

export default UserDetail;
