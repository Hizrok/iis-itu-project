import { useState, useEffect } from "react";
import User from "../../components/common/Types/User";
import "../../styles/style.css";
import UserDetail from "./UserListComponents/UserDetail";
import { useAuthHeader } from "react-auth-kit";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useDispatch } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel, MenuItem, Select, TextField } from "@mui/material";

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const authHeader = useAuthHeader();
  const dispatch = useDispatch();


  const [role, setRole] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [createDialog, setCreateDialog] = useState<boolean>(false);

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

  const createUser = () => {
    dispatch(setLoadingContentState(true));
    async function postUser() {
      const new_user = {
        role: role,
        name: name,
        surname: surname,
      };

      try{
          const request = await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": authHeader()
          },
          body: JSON.stringify(new_user),
        });
        const request_json = await request.json();
        console.log(request_json);
        console.log(JSON.stringify(new_user));
        setCreateDialog(false);
        fetchUsers();
        dispatch(setLoadingContentState(false));
      }
      catch(err){
        setErrorMessage("Error during creation!");
        dispatch(setLoadingContentState(false));
      }
      
    }

    postUser();
  };

  return (
    <>
      <div className="users-page">
        <div className="list-pages-list-container">
          <h2>Seznam Uživatelů <AddIcon sx={{border:1}} onClick= {() => setCreateDialog(true)}/></h2>
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
      
      <Dialog
        open={createDialog}
        onClose={() => {
          setCreateDialog(false);
        }}>
        <DialogTitle>Vytvořit Uživatele</DialogTitle>
        <DialogContent>
          <InputLabel id="select-label">Role</InputLabel>
          <Select
            sx={{ m: 1, width: "25ch" }}
            labelId="select-label"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
            }}
          >
            <MenuItem value={"admin"}>admin</MenuItem>
            <MenuItem value={"garant"}>garant</MenuItem>
            <MenuItem value={"rozvrhář"}>rozvrhář</MenuItem>
            <MenuItem value={"vyučující"}>vyučující</MenuItem>
            <MenuItem value={"student"}>student</MenuItem>
          </Select>
          <TextField
            autoFocus
            margin="dense"
            id="login"
            label="Jméno"
            type="login"
            fullWidth
            variant="outlined"
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="password"
            label="Příjmení"
            type="login"
            fullWidth
            variant="outlined"
            onChange={(e) => setSurname(e.target.value)}
          />
        </DialogContent>
        <DialogContentText>{errorMessage}</DialogContentText>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setCreateDialog(false);
            }}>
            Zrušit
          </Button>
          <Button 
            variant="outlined"
            onClick={createUser}>Vytvořit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserListPage;

