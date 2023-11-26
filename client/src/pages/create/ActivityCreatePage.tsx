import { useEffect, useState } from "react";
import { Box, Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useAuthHeader } from "react-auth-kit";
import { useDispatch } from "react-redux";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import Course from "../../components/common/Types/Course";

const ActivityCreatePage = () => {

  const [courses, setCourses] = useState<Course[]>([]);

  const [courseID, setCourseID] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [recurrence, setRecurrence] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  const authHeader = useAuthHeader();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    dispatch(setLoadingContentState(true));
    const response = await fetch("http://localhost:3000/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authHeader(),
        },
      });
      const json_courses = await response.json();

    setCourses(json_courses);
    dispatch(setLoadingContentState(false));
  }

  async function createRoom() {

    const new_activity = {
      type: type,
      recurrence: recurrence,
      capacity: capacity,
      duration: duration,
    };

    await fetch("http://localhost:3000/courses/"+courseID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": authHeader()
      },
      body: JSON.stringify(new_activity),
    });
  }

  const handleClick = () => {
    createRoom();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <InputLabel id="select-label">Předmět</InputLabel>
      <Select
        sx={{ m: 1, width: "25ch" }}
        labelId="select-label"
        value={courseID}
        onChange={(e) => {
          setCourseID(e.target.value);
        }}
      >
        {courses.map((course: Course) => (
          <MenuItem value={course.id}>{course.id}</MenuItem>
        ))}
      </Select>
      <InputLabel id="select-label">Typ</InputLabel>
      <Select
        sx={{ m: 1, width: "25ch" }}
        labelId="select-label"
        value={type}
        onChange={(e) => {
          setType(e.target.value);
        }}
      >
        <MenuItem value="přednáška">přednáška</MenuItem>
        <MenuItem value="cvičení">cvičení</MenuItem>
        <MenuItem value="laboratoř">laboratoř</MenuItem>
        <MenuItem value="democvičení">democvičení</MenuItem>
        <MenuItem value="seminář">seminář</MenuItem>
      </Select>
      <InputLabel id="select-label">Typ</InputLabel>
      <Select
        sx={{ m: 1, width: "25ch" }}
        labelId="select-label"
        value={recurrence}
        onChange={(e) => {
          setRecurrence(e.target.value);
        }}
      >
        <MenuItem value="každý">každý</MenuItem>
        <MenuItem value="lichý">lichý</MenuItem>
        <MenuItem value="sudý">sudý</MenuItem>
        <MenuItem value="jednorázová aktivita">jednorázová aktivita</MenuItem>
      </Select>
      <TextField
        label="Kapacita"
        variant="outlined"
        sx={{ m: 1, width: "25ch" }}
        onChange={(e) => setCapacity(e.target.value)}
      />
      <TextField
        label="Duration - hh:mm"
        variant="outlined"
        sx={{ m: 1, width: "25ch" }}
        onChange={(e) => setDuration(e.target.value)}
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

export default ActivityCreatePage;
