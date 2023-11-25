import React, { useState } from 'react';
import User from "../../../components/common/Types/User";
import '../../../styles/style.css';

interface UserDetailProps {
    selectedUser: User;
    onEditUser: (user: User) => void;
}

const UserDetail: React.FC<UserDetailProps> = (props) => {

    const { selectedUser, onEditUser } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(selectedUser.name);
  const [editedSurname, setEditedSurname] = useState(selectedUser.surname);

  const handleEditClick = () => {
    setEditedName(selectedUser.name);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    selectedUser.name = editedName;
    onEditUser(selectedUser)
    setIsEditing(false);
  };
  return (
    <div className="user-detail-container">
      <div className="purple-bar"></div>
      <img src="https://www.pngkey.com/png/full/988-9886269_blank-person-facebook-no-profile.png" alt="Fotka uživatele" />
      <div className="user-detail-properties">
        <p>Jméno:</p>{' '}
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />) : (<p>{selectedUser.name}</p>
          )}
        <p>Přijmení:</p>{' '}
          {isEditing ? (
            <input
              type="text"
              value={editedSurname}
              onChange={(e) => setEditedSurname(e.target.value)}
            />) : (<p>{selectedUser.surname}</p>
          )}
        {isEditing ? (
          <button onClick={handleSaveClick}>Uložit</button>
        ) : (
          <button onClick={handleEditClick}>Upravit</button>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
