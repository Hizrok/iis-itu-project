import React, { useState } from "react";
import "../../../styles/style.css";
import {
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteButton from "../../../components/common/Buttons/DeleteButton";
import UserDetailProps from "./UserDetailProps";

const UserDetail: React.FC<UserDetailProps> = (props) => {
  const { selectedUser, onEditUser, onDeleteUser } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(selectedUser.name);
  const [editedSurname, setEditedSurname] = useState(selectedUser.surname);
  const [editedRole, setEditedRole] = useState(selectedUser.role);

  const handleEditClick = () => {
    setEditedName(selectedUser.name);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    selectedUser.name = editedName;
    selectedUser.surname = editedSurname;
    selectedUser.role = editedRole;
    onEditUser(selectedUser);
  };

  const handleDeleteClick = () => {
    onDeleteUser(selectedUser);
  };

  return (
    <div className="user-detail-container">
      <div className="purple-bar"></div>
      <img
        src="https://www.pngkey.com/png/full/988-9886269_blank-person-facebook-no-profile.png"
        alt="Fotka uživatele"
      />
      <div className="user-detail-properties">
        <p>Jméno:</p>{" "}
        {isEditing ? (
          <TextField
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        ) : (
          <p>{selectedUser.name}</p>
        )}
        <p>Přijmení:</p>{" "}
        {isEditing ? (
          <TextField
            type="text"
            value={editedSurname}
            onChange={(e) => setEditedSurname(e.target.value)}
          />
        ) : (
          <p>{selectedUser.surname}</p>
        )}
        <p>Role:</p>{" "}
        {isEditing ? (
          <Select
            type="text"
            value={editedRole}
            onChange={(e) => setEditedRole(e.target.value)}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="garant">Garant</MenuItem>
            <MenuItem value="rozvrhar">Rozvrhář</MenuItem> 
            <MenuItem value="student">Student</MenuItem>
            </Select>
        ) : (
          <p>{selectedUser.role}</p>
        )}
        {isEditing ? (
          <Button variant="outlined" color="success" onClick={handleSaveClick}>Uložit</Button>
        ) : (
          <Button variant="outlined" onClick={handleEditClick}>Upravit</Button>
        )}
        <DeleteButton user={selectedUser} onDelete={handleDeleteClick}/>
      </div>
    </div>
  );
};

export default UserDetail;
