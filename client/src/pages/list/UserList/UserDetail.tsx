// @author Tomáš Vlach
// @author Jan Kapsa

import { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";

import {
  CircularProgress,
  InputLabel,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";

type UserDetailProps = {
  id: string;
  editUser: Function;
  deleteUser: Function;
};

const UserDetail = ({ id, editUser, deleteUser }: UserDetailProps) => {
  const confirm = useConfirm();
  const authHeader = useAuthHeader();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  const getUser = async () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_SERVER_HOST}users/${id}`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        setRole(res.data.role);
        setName(res.data.name);
        setSurname(res.data.surname);
        setEmail(res.data.email);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEdit = async () => {
    setDisabled(true);
    await toast.promise(
      editUser(role, name, surname, email),
      {
        pending: 'Uživatel se aktualizuje',
        success: 'Uživatel aktualizován',
        error: 'Problém s aktualizací aktivity'
      }
    );
    setDisabled(false);
  };

  const handleDelete = async () => {
    confirm({ description: "Chcete vymazat uživatele?", confirmationText: "Ano", cancellationText: "Ne", title: "Smazání uživatele", confirmationButtonProps: { color: "error" } })
      .then(async () => {
        setDisabled(true);
        await toast.promise(
          deleteUser(),
          {
            pending: 'Uživatel se maže',
            success: 'Uživatel smazán',
            error: 'Problém s mazáním uživatele'
          }
        );
        setDisabled(false);
      })
      .catch(() => {
        
      });
    
  };

  useEffect(() => {
    if (id) {
      getUser();
    }
  }, [id]);

  return (
    <div className="detail">
      {id ? (
        loading ? (
          <div className="loader-container">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <div>
            <div className="detail-buttons">
              <Button
                variant="contained"
                disabled={disabled}
                onClick={handleEdit}
              >
                Save
              </Button>
              <Button
                variant="contained"
                disabled={disabled}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
            <InputLabel>Role</InputLabel>
            <Select
              className="role-select"
              fullWidth
              disabled={disabled}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value={"admin"}>admin</MenuItem>
              <MenuItem value={"garant"}>garant</MenuItem>
              <MenuItem value={"rozvrhář"}>rozvrhář</MenuItem>
              <MenuItem value={"vyučující"}>vyučující</MenuItem>
              <MenuItem value={"student"}>student</MenuItem>
            </Select>
            <TextField
              margin="dense"
              label="Jméno"
              disabled={disabled}
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Příjmení"
              disabled={disabled}
              fullWidth
              variant="outlined"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Email"
              disabled={disabled}
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )
      ) : (
        <div className="nothing-selected-container">
          <h3>select user</h3>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
