import { useState, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { useDispatch } from "react-redux";
import Room from "../../components/common/Types/Room";
import RoomDetail from "./RoomListComponents/RoomDetail";
import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

const RoomListPage = () => {

  const [building, setBuilding] = useState<string>("");
  const [floor, setFloor] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");

  
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [createDialog, setCreateDialog] = useState<boolean>(false);

    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const authHeader = useAuthHeader();
    const dispatch = useDispatch();

    useEffect(() => {
    fetchRooms();
    }, []);

    async function fetchRooms() {
    try {
        dispatch(setLoadingContentState(true));
        const response = await fetch("http://localhost:3000/rooms", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: authHeader(),
        },
        });
        const json_users = await response.json();
        setRooms(json_users.filter((room: Room) => room.id !== null));
        dispatch(setLoadingContentState(false));
    } catch (error) {
        console.error("Error fetching users:", error);
        dispatch(setLoadingContentState(false));
    }
    }

    const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    };

    const handleDeleteRoom = (toBeDeletedUser: Room) => {  
        const deleteRoom = async () => {
            try {
            dispatch(setLoadingContentState(true));
            await fetch(
                "http://localhost:3000/rooms/" + toBeDeletedUser.id,
                {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    authorization: authHeader(),
                },
                }
            );

            // call fetch users after deleting user
            fetchRooms();
            dispatch(setLoadingContentState(false));
            } catch (error) {
            dispatch(setLoadingContentState(false));
            console.error("Error deleting user:", error);
            }
        };
        deleteRoom();
    }

    const handleEditRoom = (editedRoom: Room) => {  
    const toBeUpdatedRoom = {
        building: editedRoom.building,
        floor: editedRoom.floor,
        number: editedRoom.number,
        capacity: editedRoom.capacity,
    };

    const updateRoom = async () => {
        try {
        dispatch(setLoadingContentState(true));
        await fetch(
            "http://localhost:3000/rooms/" + editedRoom.id,
            {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                authorization: authHeader(),
            },
            body: JSON.stringify(toBeUpdatedRoom),
            }
        );

        // call fetch rooms after update room
        fetchRooms();
        dispatch(setLoadingContentState(false));
        } catch (error) {
        console.error("Error updating room:", error);
        dispatch(setLoadingContentState(false));
        }
    };

    updateRoom();
    };

    async function createRoom() {
      // TODO: course_guarantor == authenticated user
  
      const new_room = {
          building: building,
          floor: floor,
          number: number,
          capacity: capacity,
      };
  
      try{
        await fetch("http://localhost:3000/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": authHeader()
          },
          body: JSON.stringify(new_room),  
        });
        setCreateDialog(false);
        fetchRooms();
        dispatch(setLoadingContentState(false));
      }
      catch(err){
        setErrorMessage("Error during creation!");
        dispatch(setLoadingContentState(false));
      }
    }

    return (
      <>
       <div className="rooms-page">
          <div className="list-pages-list-container">
            <h2>Seznam Místností <AddIcon sx={{border:1}} onClick= {() => setCreateDialog(true)}/></h2>
            <ul>
              <li className="list-header">
                <span className="header-item">ID</span>
                <span className="header-item">Budova</span>
                <span className="header-item">Patro</span>
                <span className="header-item">Číslo Místnost</span>
                <span className="header-item">Kapacita Místnost</span>
              </li>
              {rooms.map((room: Room) => (
                <li
                  key={room.id}
                  className="list-item-properties"
                  onClick={() => handleRoomClick(room)}
                >
                  <span className="list-item-property">{room.id}</span>
                  <span className="list-item-property">{room.building}</span>
                  <span className="list-item-property">{room.floor}</span>
                  <span className="list-item-property">{room.number}</span>
                  <span className="list-item-property">{room.capacity}</span>
                </li>
              ))}
            </ul>
          </div>
          {selectedRoom && (
            <RoomDetail
            selectedRoom={selectedRoom}
            onEditRoom={handleEditRoom}
            onDeleteRoom={handleDeleteRoom}
            />
          )}
        </div>
      
        <Dialog
          open={createDialog}
          onClose={() => {
            setCreateDialog(false);
          }}>
          <DialogTitle>Vytvořit Místnost</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Budova místnosti"
              type="text"
              fullWidth
              variant="outlined"
              onChange={(e) => setBuilding(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Patro místnosti"
              type="text"
              fullWidth
              variant="outlined"
              onChange={(e) => setFloor(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Číslo místnosti"
              type="text"
              fullWidth
              variant="outlined"
              onChange={(e) => setNumber(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Kapacita místnosti"
              type="text"
              fullWidth
              variant="outlined"
              onChange={(e) => setCapacity(e.target.value)}
            />
          </DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                setCreateDialog(false);
              }}>
              Zrušit
            </Button>
            <Button 
              variant="outlined"
              onClick={createRoom}>Vytvořit</Button>
          </DialogActions>
        </Dialog>
      </>
      );
}

export default RoomListPage;