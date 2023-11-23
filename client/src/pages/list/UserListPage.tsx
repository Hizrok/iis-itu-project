import React, { useState, useEffect } from "react";
import User from "../../components/common/Types/User";
import '../../styles/style.css';
import UserDetail from "./UserListComponents/UserDetail";

const UserListPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("http://localhost:3000/users");
                const users_json = await response.json();
                setUsers(users_json);
                console.log(users_json);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchUsers();
    }, []);

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
    };

    const handleEditUser = (editedUser: User) => {
        console.log(editedUser);
        
        const toBeUpdatedUser = {
            user_role : editedUser.user_role,
            user_name : editedUser.user_name,
            user_surname : editedUser.user_surname
        };

        async function fetchCourses() {
            const request = await fetch("http://localhost:3000/users/" + editedUser.user_login, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(toBeUpdatedUser),
            });
            const request_json = await request.json();
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
                    {users.map((user) => (
                        <li key={user.user_login} className="list-item-properties" onClick={() => handleUserClick(user)}>
                            <span className="list-item-property">{user.user_name}</span>
                            <span className="list-item-property">{user.user_surname}</span>
                            <span className="list-item-property user-role">{user.user_role}</span>
                        </li>
                    ))}
                </ul>
            </div>
            {selectedUser && (
                <UserDetail selectedUser={selectedUser} onEditUser={handleEditUser}></UserDetail>
            )}
        </div>
    );
};

export default UserListPage;
