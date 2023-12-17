// @author Tomáš Vlach
// @author Jan Kapsa

import { useState, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";

import "../styles.css";
import { Button, CircularProgress } from "@mui/material";

import Room from "../../../components/common/Types/Room";
import RoomDetail from "./RoomDetail";
import CreateRoomDialog from "./CreateRoomDetail";

const RoomListPage = () => {
  const authHeader = useAuthHeader();

  const [loading, setLoading] = useState(false);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [seleted, setSelected] = useState<string>("");
  const [index, setIndex] = useState(0);

  const [showDialog, setShowDialog] = useState(false);

  const getRooms = async () => {
    setLoading(true);
    await axios
      .get(`${import.meta.env.VITE_SERVER_HOST}rooms`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        setRooms(res.data);
      })
      .catch((err) => console.error(err.message))
      .finally(() => {
        setLoading(false);
      });
  };

  const createRoom = async (
    building: string,
    floor: number,
    number: number,
    capacity: number
  ) => {
    return await axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}rooms`,
        { building, floor, number, capacity },
        { headers: { Authorization: authHeader() } }
      )
      .then((res) => {
        const newId = res.data.id;
        setRooms((oldRooms) => {
          const newRooms = [...oldRooms];
          newRooms.push({ id: newId, building, floor, number, capacity });
          return newRooms;
        });
      })
      .catch(error => { console.error(error); throw error; });
  };

  const editRoom = async (
    building: string,
    floor: number,
    number: number,
    capacity: number
  ) => {
    return await axios
      .put(
        `${import.meta.env.VITE_SERVER_HOST}rooms/${seleted}`,
        {
          building,
          floor,
          number,
          capacity,
        },
        {
          headers: {
            Authorization: authHeader(),
          },
        }
      )
      .then((res) => {
        setRooms((oldRooms) => {
          const newRooms = [...oldRooms];
          newRooms[index].id = res.data.id;
          newRooms[index].building = building;
          newRooms[index].floor = floor;
          newRooms[index].number = number;
          newRooms[index].capacity = capacity;
          return newRooms;
        });
        setSelected(res.data.id);
      })
      .catch(error => { console.error(error); throw error; });
  };

  const deleteRoom = async () => {
    return await axios
      .delete(`${import.meta.env.VITE_SERVER_HOST}rooms/${seleted}`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        console.log(res.data.msg);
        setSelected("");
        setIndex(0);
        setRooms(rooms.filter((user: Room) => user.id !== seleted));
      })
      .catch(error => { console.error(error); throw error; });
  };

  const toggleDialog = (value: boolean) => {
    setShowDialog(value);
  };

  const handleSelect = (id: string, i: number) => {
    setSelected(id);
    setIndex(i);
  };

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <div>
      <h2>Seznam místností</h2>
      <Button variant="contained" onClick={() => toggleDialog(true)}>
        create room
      </Button>
      <div className="list-page-content">
        <div className="list">
          <div className="list-header room-list">
            <span>id</span>
            <span>building</span>
            <span>floor</span>
            <span>number</span>
            <span>capacity</span>
          </div>

          {loading ? (
            <div className="loader-container">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            rooms.map((room: Room, i) => (
              <div
                className={`list-item room-list ${
                  room.id === seleted && "list-item-selected"
                }`}
                key={i}
                onClick={() => handleSelect(room.id, i)}
              >
                <span>{room.id}</span>
                <span>{room.building}</span>
                <span>{room.floor}</span>
                <span>{room.number}</span>
                <span>{room.capacity}</span>
              </div>
            ))
          )}
        </div>
        <RoomDetail id={seleted} editRoom={editRoom} deleteRoom={deleteRoom} />
      </div>
      <CreateRoomDialog
        showDialog={showDialog}
        toggleDialog={toggleDialog}
        createRoom={createRoom}
      />
    </div>
  );
};

export default RoomListPage;
