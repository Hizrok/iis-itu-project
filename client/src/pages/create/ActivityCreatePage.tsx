import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useAuthHeader } from "react-auth-kit";

const ActivityCreatePage = () => {
  const [building, setBuilding] = useState<string>("");
  const [floor, setFloor] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");

  const authHeader = useAuthHeader()

  async function createRoom() {
    // TODO: course_guarantor == authenticated user

    const new_room = {
        building: building,
        floor: floor,
        number: number,
        capacity: capacity,
    };

    await fetch("http://localhost:3000/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": authHeader()
      },
      body: JSON.stringify(new_room),
    });
  }

  const handleClick = () => {
    createRoom();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TextField
        label="Budova místnosti"
        variant="outlined"
        sx={{ m: 1, width: "25ch" }}
        onChange={(e) => setBuilding(e.target.value)}
      />
      <TextField
        label="Patro místnosti"
        variant="outlined"
        sx={{ m: 1, width: "25ch" }}
        onChange={(e) => setFloor(e.target.value)}
      />
      <TextField
        label="Číslo místnosti"
        variant="outlined"
        sx={{ m: 1, width: "25ch" }}
        onChange={(e) => setNumber(e.target.value)}
      />
      <TextField
        label="Kapacita místnosti"
        variant="outlined"
        sx={{ m: 1, width: "25ch" }}
        onChange={(e) => setCapacity(e.target.value)}
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
