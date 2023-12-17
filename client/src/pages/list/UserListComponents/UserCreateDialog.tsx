import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel, MenuItem, Select, TextField } from "@mui/material";

const [role, setRole] = useState<string>("");
const [name, setName] = useState<string>("");
const [surname, setSurname] = useState<string>("");

const [errorMessage, setErrorMessage] = useState<string>("");

const [createDialog, setCreateDialog] = useState<boolean>(false);

const UserCreateDialog = () => {
    return(
        <Dialog
        open={createDialog}
        onClose={() => {
          setCreateDialog(false);
        }}>
        <DialogTitle>Login</DialogTitle>
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
            variant="standard"
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Příjmení"
            type="login"
            fullWidth
            variant="standard"
            onChange={(e) => setSurname(e.target.value)}
          />
        </DialogContent>
        <DialogContentText>{errorMessage}</DialogContentText>
        <DialogActions>
          <Button
            onClick={() => {
              setCreateDialog(false);
            }}>
            Zrušit
          </Button>
          <Button onClick={createUser}>Vytvořit</Button>
        </DialogActions>
      </Dialog>
    )
}