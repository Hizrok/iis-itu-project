import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { useAuthHeader } from "react-auth-kit";

const UserCreatePage = () => {

  const authHeader = useAuthHeader();


  const [role, setRole] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");

  const handleClick = () => {
    async function createUser() {
      const new_user = {
        role: role,
        name: name,
        surname: surname,
      };

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
    }

    createUser();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <InputLabel id="select-label">Role</InputLabel>
      <Select
        sx={{ m: 1, width: "25ch" }}
        labelId="select-label"
        value={role}
        // label="role"
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
        label="Jméno"
        variant="outlined"
        sx={{ m: 1, width: "25ch" }}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Příjmení"
        variant="outlined"
        sx={{ m: 1, width: "25ch" }}
        onChange={(e) => setSurname(e.target.value)}
      />
      <Button
        variant="outlined"
        onClick={handleClick}
        sx={{ m: 1, width: "25ch" }}
      >
        Vytvořit
      </Button>
    </Box>
  );
};

export default UserCreatePage;
