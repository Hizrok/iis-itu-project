import { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";

import "../styles.css";
import { Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";

type RoomDetailProps = {
  id: string;
  editRoom: Function;
  deleteRoom: Function;
};

const RoomDetail = ({ id, editRoom, deleteRoom }: RoomDetailProps) => {
  const authHeader = useAuthHeader();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState(0);
  const [number, setNumber] = useState(0);
  const [capacity, setCapacity] = useState(0);

  const getRoom = async () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_SERVER_HOST}rooms/${id}`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        setBuilding(res.data.building);
        setFloor(res.data.floor);
        setNumber(res.data.number);
        setCapacity(res.data.capacity);
      })
      .catch((err) => console.error(err.message))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEdit = () => {
    setDisabled(true);
    editRoom(building, floor, number, capacity);
    setDisabled(false);
  };

  const handleDelete = () => {
    setDisabled(true);
    deleteRoom();
    setDisabled(false);
  };

  useEffect(() => {
    if (id) {
      getRoom();
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
            <TextField
              margin="dense"
              label="Building"
              disabled={disabled}
              fullWidth
              variant="outlined"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Floor"
              disabled={disabled}
              fullWidth
              variant="outlined"
              value={floor}
              onChange={(e) => setFloor(parseInt(e.target.value))}
            />
            <TextField
              margin="dense"
              label="Number"
              disabled={disabled}
              fullWidth
              variant="outlined"
              value={number}
              onChange={(e) => setNumber(parseInt(e.target.value))}
            />
            <TextField
              margin="dense"
              label="Capacity"
              disabled={disabled}
              fullWidth
              variant="outlined"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value))}
            />
          </div>
        )
      ) : (
        <div className="nothing-selected-container">
          <h3>select room</h3>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;
