import { useState, useEffect } from "react";
import User from "../../components/common/Types/User";
import "../../styles/style.css";
import UserDetail from "./UserListComponents/UserDetail";
import { useAuthHeader } from "react-auth-kit";

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const authHeader = useAuthHeader();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:3000/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: authHeader(),
          },
        });
        const json_users = await response.json();
        setUsers(json_users.filter((user: User) => user.name !== null));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    console.log(user);
  };

  const handleEditUser = (editedUser: User) => {
    console.log(editedUser);

    const toBeUpdatedUser = {
      role: editedUser.role,
      name: editedUser.name,
      surname: editedUser.surname,
    };

    async function fetchCourses() {
      const request = await fetch(
        "http://localhost:3000/users/" + editedUser.id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toBeUpdatedUser),
        }
      );
      const request_json = await request.json();
      console.log("SERVER DATA");
      console.log(request_json);
    }
    fetchCourses();
  };

  const handleDeleteUser = () => {
    console.log("Smazat uživatele:", selectedUser);
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
        ></UserDetail>
      )}
    </div>
  );
};

export default UserListPage;
