import { useState, useEffect } from "react";
import { User } from "../../../components/common/Types/User";
import { useAuthHeader } from "react-auth-kit";
import UserDetail from "./UserDetail";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";

import "./styles.css";
import CreateUserDialog from "./CreateUserDialog";

const UserListPage = () => {
  const authHeader = useAuthHeader();

  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [seleted, setSelected] = useState<string>("");
  const [index, setIndex] = useState(0);

  const [showDialog, setShowDialog] = useState(false);

  const getUsers = async () => {
    await axios
      .get(`${import.meta.env.VITE_SERVER_HOST}users`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const createUser = async (
    role: string,
    name: string,
    surname: string,
    email: string
  ) => {
    await axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}users`,
        { role, name, surname, email },
        { headers: { Authorization: authHeader() } }
      )
      .then((res) => {
        const newId = res.data.id;
        setUsers((oldUsers) => {
          const newUsers = [...oldUsers];
          newUsers.push({ id: newId, role, name, surname, email });
          return newUsers;
        });
      })
      .catch((err) => console.error(err.message));
  };

  const editUser = async (
    role: string,
    name: string,
    surname: string,
    email: string
  ) => {
    await axios
      .put(
        `${import.meta.env.VITE_SERVER_HOST}users/${seleted}`,
        {
          role,
          name,
          surname,
          email,
        },
        {
          headers: {
            Authorization: authHeader(),
          },
        }
      )
      .then((res) => {
        console.log(res.data.msg);
        setUsers((oldUsers) => {
          const newUsers = [...oldUsers];
          newUsers[index].role = role;
          newUsers[index].name = name;
          newUsers[index].surname = surname;
          newUsers[index].email = email;
          return newUsers;
        });
      })
      .catch((err) => console.error(err.message));
  };

  const deleteUser = async () => {
    await axios
      .delete(`${import.meta.env.VITE_SERVER_HOST}users/${seleted}`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        console.log(res.data.msg);
        setSelected("");
        setIndex(0);
        setUsers(users.filter((user: User) => user.id !== seleted));
      })
      .catch((err) => console.error(err.message));
  };

  const toggleDialog = (value: boolean) => {
    setShowDialog(value);
  };

  const handleSelect = (id: string, i: number) => {
    setSelected(id);
    setIndex(i);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <h2>Seznam uživatelů</h2>
      <Button variant="contained" onClick={() => toggleDialog(true)}>
        create user
      </Button>
      <div className="user-page-content">
        <div className="user-list">
          <div className="user-list-header">
            <span>id</span>
            <span>role</span>
            <span>name</span>
          </div>

          {loading ? (
            <div className="loader-container">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            users.map((user: User, i) => (
              <div
                className={`user-list-item ${
                  user.id === seleted && "user-list-item-selected"
                }`}
                key={i}
                onClick={() => handleSelect(user.id, i)}
              >
                <span>{user.id}</span>
                <span>{user.role}</span>
                <span>
                  {user.name} {user.surname}
                </span>
              </div>
            ))
          )}
        </div>
        <UserDetail id={seleted} editUser={editUser} deleteUser={deleteUser} />
      </div>
      <CreateUserDialog
        showDialog={showDialog}
        toggleDialog={toggleDialog}
        createUser={createUser}
      />
    </div>
  );
};

export default UserListPage;
