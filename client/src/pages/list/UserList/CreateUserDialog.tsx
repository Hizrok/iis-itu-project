import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";

type CreateUserDialogProps = {
  showDialog: boolean;
  toggleDialog: Function;
  createUser: Function;
};

const CreateUserDialog = ({
  showDialog,
  toggleDialog,
  createUser,
}: CreateUserDialogProps) => {
  const [disabled, setDisabled] = useState(false);

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  const handleCreateUser = () => {
    setDisabled(true);
    createUser(role, name, surname, email);
    setDisabled(false);
    toggleDialog(false);

    setRole("student");
    setName("");
    setSurname("");
    setEmail("");
  };

  return (
    <Dialog open={showDialog} onClose={() => toggleDialog(false)}>
      <DialogTitle>Vytvořit Uživatele</DialogTitle>
      <DialogContent>
        <InputLabel id="select-label">Role</InputLabel>
        <Select
          sx={{ m: 1, width: "25ch" }}
          labelId="select-label"
          disabled={disabled}
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
          disabled={disabled}
          margin="dense"
          label="Jméno"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          disabled={disabled}
          label="Příjmení"
          fullWidth
          variant="outlined"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <TextField
          margin="dense"
          disabled={disabled}
          label="Email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => toggleDialog(false)}
          disabled={disabled}
        >
          Zrušit
        </Button>
        <Button
          variant="outlined"
          onClick={handleCreateUser}
          disabled={disabled}
        >
          Vytvořit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserDialog;
