// @author Tomáš Vlach
// @author Jan Kapsa

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
  } from "@mui/material";
  import { useState } from "react";
  
  type CreateUserDialogProps = {
    showDialog: boolean;
    toggleDialog: Function;
    loginUser: Function;
  };
  
  const LoginDialog = ({
    showDialog,
    toggleDialog,
    loginUser,
  }: CreateUserDialogProps) => {
  
    
    const [id, setId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
  
    const handleLogin = () => {
      loginUser(id,password);
      setPassword("");
    };
  
    return (
      <Dialog
          open={showDialog}
          onClose={() => {
            toggleDialog(false);
          }}
        >
          <DialogTitle>Přihlášení</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="login"
              label="Login"
              type="login"
              fullWidth
              variant="standard"
              onChange={(e) => setId(e.target.value)}
            />
            <TextField
              margin="dense"
              id="password"
              label="Heslo"
              type="password"
              fullWidth
              variant="standard"
              onChange={(e) => setPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                toggleDialog(false);
              }}
            >
              Zrušit
            </Button>
            <Button onClick={handleLogin}>Přihlásit</Button>
          </DialogActions>
        </Dialog>
    );
  };
  
  export default LoginDialog;