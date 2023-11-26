import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useAuthHeader } from "react-auth-kit";

const CourseCreatePage = () => {
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [garant, setGarant] = useState<string>("");
  const [annotation, setAnnotation] = useState<string>("");

  const authHeader = useAuthHeader()

  const handleClick = () => {
    async function fetchCourses() {
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

    fetchCourses();
  };

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
        label="Garant předmětu"
        variant="outlined"
        sx={{ m: 1, width: "25ch" }}
        onChange={(e) => setGarant(e.target.value)}
      />
      <TextField
        label="Anotace předmětu"
        variant="outlined"
        sx={{ m: 1, width: "25ch" }}
        onChange={(e) => setAnnotation(e.target.value)}
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

export default CourseCreatePage;
