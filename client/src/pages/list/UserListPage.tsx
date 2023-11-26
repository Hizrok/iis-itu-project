import { useState, useEffect } from "react";
import User from "../../components/common/Types/User";
import "../../styles/style.css";
import UserDetail from "./UserListComponents/UserDetail";
import { useAuthHeader } from "react-auth-kit";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useDispatch } from "react-redux";

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const authHeader = useAuthHeader();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      dispatch(setLoadingContentState(true));
      const response = await fetch("http://localhost:3000/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authHeader(),
        },
      });
      const json_users = await response.json();
      setUsers(json_users.filter((user: User) => user.name !== null));
      dispatch(setLoadingContentState(false));
    } catch (error) {
      dispatch(setLoadingContentState(false));
      console.error("Error fetching users:", error);
    }
  }

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };
  
  const handleDeleteUser = (toBeDeletedUser: User) => {  
    const deleteUser = async () => {
      try {
        dispatch(setLoadingContentState(true));
        await fetch(
          "http://localhost:3000/users/" + toBeDeletedUser.id,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              authorization: authHeader(),
            },
          }
        );
  
        // call fetch users after deleting user
        fetchUsers();
        dispatch(setLoadingContentState(false));
      } catch (error) {
        dispatch(setLoadingContentState(false));
        console.error("Error deleting user:", error);
      }
    };
    deleteUser();
  }

  const handleEditUser = (editedUser: User) => {  
    const toBeUpdatedUser = {
      role: editedUser.role,
      name: editedUser.name,
      surname: editedUser.surname,
    };
  
    const updateUser = async () => {
      try {
        dispatch(setLoadingContentState(true));
        await fetch(
          "http://localhost:3000/users/" + editedUser.id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: authHeader(),
            },
            body: JSON.stringify(toBeUpdatedUser),
          }
        );
  
        // call fetch users after update user
        fetchUsers();
        dispatch(setLoadingContentState(false));
      } catch (error) {
        console.error("Error updating user:", error);
        dispatch(setLoadingContentState(false));
      }
    };
  
    updateUser();
  };

  return (
    <div className="users-page">
      <div className="list-pages-list-container">
        <h2>Seznam Uživatelů</h2>
        <ul>
          <li className="list-header">
            <span className="header-item">Jméno</span>
            <span className="header-item">Příjmení</span>
            <span className="header-item">Role</span>
          </li>
          {users.map((user: User) => (
            <li
              key={user.id}
              className="list-item-properties"
              onClick={() => handleUserClick(user)}
            >
              <span className="list-item-property">{user.name}</span>
              <span className="list-item-property">{user.surname}</span>
              <span className="list-item-property user-role">{user.role}</span>
            </li>
          ))}
        </ul>
      </div>
      {selectedUser && (
        <UserDetail
        selectedUser={selectedUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        ></UserDetail>
      )}
    </div>
  );
};

export default UserListPage;

