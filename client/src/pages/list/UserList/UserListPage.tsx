import { useState, useEffect } from "react";
import { User } from "../../../components/common/Types/User";
import { useAuthHeader } from "react-auth-kit";
import UserDetail from "./UserDetail";
import { Button, CircularProgress } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import axios from "axios";

import "../styles.css";
import CreateUserDialog from "./CreateUserDialog";
import { toast } from "react-toastify";

const UserListPage = () => {
  const authHeader = useAuthHeader();
  const confirm = useConfirm();

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
        toast.success('Uživatel vytvořen');
      })
      .catch((err) => {
        console.error(err.message); 
        toast.error('Problém s tvorbou uživatele');
      });
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
          toast.success('Uživatel aktualizován');
          return newUsers;
        });
      })
      .catch((err) => {
        console.error(err.message);
        toast.error('Problém s aktualizováním uživatele');
      });
  };

  const deleteUser = async () => {
    confirm({ description: "Chcete vymazat uživatele?", confirmationText: "Ano", cancellationText: "Ne", title: "Smazání uživatele", confirmationButtonProps: { color: "error" } })
      .then(async () => {
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
            toast.success('Uživatel smazán');
          })
          .catch((err) => {
            console.error(err.message);
            toast.error('Problém s mazáním uživatele');
          });
      })
      .catch(() => {
        
      });
    
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
      <div className="list-page-content">
        <div className="list">
          <div className="list-header user-list">
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
                className={`list-item user-list ${
                  user.id === seleted && "list-item-selected"
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
