import { useEffect, useState } from "react";
import { Box, Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useAuthHeader } from "react-auth-kit";
import User from "../../components/common/Types/User";
import { useDispatch } from "react-redux";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";

const CourseCreatePage = () => {
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [garant, setGarant] = useState<string>("");
  const [annotation, setAnnotation] = useState<string>("");

  const authHeader = useAuthHeader();
  const dispatch = useDispatch();

  const [users, setUsers] = useState<User[]>([]);

  async function createCourses() {
    // TODO: course_guarantor == authenticated user

    const new_course = {
      id: id,
      name: name,
      annotation: annotation,
      guarantor: garant,
    };

    const request = await fetch("http://localhost:3000/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": authHeader()
      },
      body: JSON.stringify(new_course),
    });
    const request_json = await request.json();
    console.log(request_json);
    console.log(JSON.stringify(new_course));
  }

  const handleClick = () => {
    createCourses();
  };

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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TextField
        label="Zkratka předmětu"
        variant="outlined"
        sx={{ m: 1, width: "25ch" }}
        onChange={(e) => setId(e.target.value)}
      />
      <TextField
        label="Jméno předmětu"
        variant="outlined"
        sx={{ m: 1, width: "25ch" }}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Anotace předmětu"
        variant="outlined"
        sx={{ m: 1, width: "25ch" }}
        onChange={(e) => setAnnotation(e.target.value)}
      />
      <InputLabel id="select-label">Garant</InputLabel>
      <Select
        sx={{ m: 1, width: "25ch" }}
        labelId="select-label"
        value={garant}
        onChange={(e) => {
          setGarant(e.target.value);
        }}
      >
        {users.map((user: User) => (
          user.role === "garant"?
          <MenuItem value={user.id}>{user.id}</MenuItem>
          :
          null
        ))}
      </Select>
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

export default CourseCreatePage;
